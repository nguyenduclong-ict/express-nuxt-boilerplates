<template>
  <div class="list-media-wrapper">
    <div class="flex mb-4">
      <div class="flex gap-2">
        <InputSearch
          icon="el-icon-search"
          placeholder="Tìm kiếm ảnh"
          @search="handleSearch"
        ></InputSearch>

        <el-select v-model="filterByType" @change="handleFilterByType">
          <el-option label="Tất cả" value="all"></el-option>
          <el-option label="Hình ảnh" value="image"></el-option>
          <el-option label="Tệp tin" value="file"></el-option>
        </el-select>

        <el-button
          v-if="selectedMedias.length"
          type="danger"
          icon="el-icon-delete"
          :disabled="onDeleteMedias"
          :loading="onDeleteMedias"
          @click="deleteMedias"
        >
          Xóa {{ selectedMedias.length }} file
        </el-button>
      </div>
      <div class="flex-1"></div>
      <div>
        <el-button
          :disabled="uploading"
          :loading="uploading"
          type="primary"
          icon="el-icon-upload"
          @click="uploadNewImages"
        >
          Tải lên
        </el-button>
      </div>
    </div>

    <el-scrollbar :wrap-style="[{ maxHeight: 'calc(90vh - 230px)' }]">
      <div v-if="medias.length > 0" class="list-medias">
        <div v-for="media in medias" :key="media.id" class="media-item">
          <el-checkbox
            v-if="isChecked(media)"
            :value="true"
            class="selected-checkbox"
          ></el-checkbox>
          <div class="media-control">
            <el-button-group>
              <el-button
                size="mini"
                icon="el-icon-edit-outline"
                class="icon-only"
                @click="showDetailMedia(media)"
              ></el-button>
            </el-button-group>
          </div>

          <div
            class="border-4"
            :class="[
              isChecked(media) ? 'border-blue-500' : 'border-transparent',
            ]"
          >
            <img
              v-if="isImage(media)"
              :src="media.url"
              :alt="media.alt"
              @click="toggleCheckedMedia(media)"
            />
            <div
              v-else
              class="flex items-center justify-center cursor-pointer file"
              @click="toggleCheckedMedia(media)"
            >
              <i class="el-icon-document" style="font-size: 56px"></i>
            </div>
          </div>

          <div class="flex mt-1">
            <small class="text-truncate flex-1">{{ media.name }}</small>
            <el-tag type="info">{{ getMediaType(media) }}</el-tag>
          </div>
          <div>
            <small class="text-uppercase text-secondary">
              {{ getExt(media) }} - {{ media.size | fileSize }}
            </small>
          </div>
        </div>
      </div>
      <el-empty
        v-else-if="!fetching && medias.length === 0"
        :image-size="64"
        description="Không có kết quả"
      ></el-empty>
    </el-scrollbar>

    <div class="mt-2">
      <el-pagination
        v-if="pagination.totalPages > 0"
        layout="->, prev, pager, next"
        background
        :page-size="pagination.page_size"
        :page-count="pagination.total_pages"
        :current-page="pagination.page"
        :total="pagination.total"
        @current-change="handlePageChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import MediaMixin from './media.mixin'
import InputSearch from '~/components/Admin/InputSearch.vue'
import { removeItems, buildURL } from '~/utils'

export default {
  components: { InputSearch },
  mixins: [MediaMixin],

  props: {
    multiple: Boolean,
    limit: Number,
    accept: String,
  },

  data() {
    return {
      selectedMedias: [],
      medias: [],
      uploading: false,
      search: '',
      isShowDetailMedia: false,
      selectedMedia: null,
      onDeleteMedias: false,
      fetching: false,
      pagination: {
        page: 1,
        page_size: 10,
        total_pages: 0,
        total: 0,
      },
      filters: {},
      filterByType: 'all',
    }
  },

  fetch() {
    this.fetchMedias()
  },

  methods: {
    uploadNewImages() {
      const input = document.createElement('input')
      input.type = 'file'
      input.multiple = true
      input.onchange = async (event) => {
        try {
          this.uploading = true
          const files = Array.from(event.target.files)
          await Promise.all(
            files.map(async (file) => {
              const formData = new FormData()
              formData.append('file', file)
              const response = await this.$axios.$post(`/file/upload`, formData)
              this.medias.unshift(response)
            })
          )
        } catch (error) {
          console.error('[error] uploadNewImages', error)
        } finally {
          this.uploading = false
        }
        input.remove()
      }
      input.click()
    },

    toggleCheckedMedia(media) {
      if (this.accept && !new RegExp(this.accept).test(media.mimetype)) {
        return
      }
      if (
        this.multiple &&
        (!this.limit || this.selectedMedias.length < this.limit)
      ) {
        const index = this.selectedMedias.findIndex(
          (item) => item.id === media.id
        )
        if (index >= 0) this.selectedMedias.splice(index, 1)
        else this.selectedMedias.push(media)
      } else if (
        !this.multiple &&
        this.selectedMedias.length &&
        this.selectedMedias[0] === media
      ) {
        this.selectedMedias = []
      } else {
        this.selectedMedias = [media]
      }
      this.$emit('select', this.selectedMedias)
    },

    isChecked(media) {
      return this.selectedMedias.findIndex((item) => item.id === media.id) >= 0
    },

    showDetailMedia(media) {
      this.$emit('show-detail', media)
    },

    handleSearch(text) {
      this.pagination.page = 1
      this.search = text
      this.fetchMedias()
    },

    async fetchMedias() {
      const url = `/file`
      const { data, ...pagination } = await this.$axios.$get(
        buildURL(url, {
          ...this.filters,
          _page: this.pagination.page,
          _page_size: this.pagination.page_size,
          _search: this.search,
          _sort: ['-createdAt'],
        })
      )
      this.medias = data
      this.pagination = pagination
    },

    handleFilterByType(value) {
      if (value === 'all') {
        this.filters = {}
      } else if (value === 'image') {
        this.filters = {
          mimetype: {
            $regex: '^image.*',
          },
        }
      } else if (value === 'file') {
        this.filters = {
          mimetype: {
            $not: {
              $regex: '^image.*',
            },
          },
        }
      }
      this.fetchMedias()
    },

    handlePageChange(page) {
      this.pagination.page = page
      this.fetchMedias()
    },

    async deleteMedias() {
      try {
        this.onDeleteMedias = true
        const agree = await this.$confirm(
          `Xác nhận xóa ${this.selectedMedias.length} file?`,
          {
            type: 'warning',
          }
        )
          .then(() => true)
          .catch(() => false)

        if (agree) {
          const ids = this.selectedMedias.map((e) => e.id).join('+')
          const response = await this.$axios.$delete(`/file/${ids}`)
          this.selectedMedias = []
          removeItems(this.medias, (e) => ids.includes(e.id))
        }
      } catch (error) {
        console.error('[error] deleteMedias', error)
      } finally {
        this.onDeleteMedias = false
      }
    },
  },
}
</script>

<style lang="scss">
.list-medias {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;

  .media-item {
    width: 175px;
    height: 175px;
    display: flex;
    flex-direction: column;
    position: relative;

    .selected-checkbox {
      position: absolute;
      top: 8px;
      left: 8px;
    }

    &:hover {
      .media-control {
        display: block;
      }
    }

    .media-control {
      position: absolute;
      display: none;
      top: 8px;
      right: 8px;
    }

    img,
    .file {
      width: 100%;
      height: 120px;
      object-fit: contain;
      background: #abafb2;
      cursor: pointer;
    }
  }
}
</style>
