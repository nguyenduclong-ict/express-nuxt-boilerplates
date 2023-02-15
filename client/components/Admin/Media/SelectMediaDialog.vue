<template>
  <div>
    <el-dialog
      :visible.sync="visible"
      append-to-body
      custom-class="select-media-dialog dialog-bg-footer"
    >
      <div slot="title">
        <div v-if="mode === 'list'">Thư viện file và ảnh</div>
        <div v-if="mode === 'edit'">
          <span class="cursor-pointer" @click="backToList">
            <i class="el-icon-arrow-left"></i>
            Quay lại thư viện
          </span>
        </div>
      </div>

      <div class="flex">
        <ListMedia
          v-show="mode === 'list'"
          ref="list"
          class="flex-1 px-4"
          :limit="limit"
          :accept="accept"
          :multiple="multiple"
          @select="onSelectMedias"
          @show-detail="showDetail"
        />

        <el-scrollbar
          v-if="selectedMedia && mode === 'list'"
          class="flex-none w-80 px-4"
          style="background: #f6f7f7; max-height: calc(90vh - 165px)"
        >
          <div class="font-semibold mb-2 pt-4">CHI TIẾT ĐÍNH KÈM</div>
          <img
            v-if="isImage(selectedMedia)"
            :src="selectedMedia.url"
            style="height: 128px"
            class="border border-gray-200 object-contain"
          />
          <div
            v-else
            style="height: 72px; width: 72px"
            class="flex items-center justify-center border border-gray-200"
          >
            <i class="el-icon-document" style="font-size: 56px"></i>
          </div>
          <div class="font-semibold mt-1 text-sm">{{ selectedMedia.name }}</div>
          <div class="text-sm">
            {{ selectedMedia.updatedAt | date }}
          </div>
          <div>{{ selectedMedia.size | fileSize }}</div>
          <el-button
            v-if="isImage(selectedMedia)"
            type="text"
            @click="showDetail(selectedMedia)"
          >
            Sửa ảnh
          </el-button>
          <el-button type="text" @click="replaceMedia()">Thay thế</el-button>
          <el-button type="text" class="danger" @click="deleteMedia">
            Xóa
          </el-button>

          <el-divider class="small"></el-divider>

          <el-form label-width="128px">
            <el-form-item label="Tên">
              <el-input
                v-model="selectedMedia.name"
                @input="debounceUpdateMedia"
              ></el-input>
            </el-form-item>
            <template v-if="isImage(selectedMedia)">
              <el-form-item label="Alternative text">
                <el-input
                  v-model="selectedMedia.alt"
                  type="textarea"
                  @input="debounceUpdateMedia"
                ></el-input>
              </el-form-item>
            </template>
            <el-form-item label="File URL:">
              <el-input :value="selectedMedia.url"></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>

      <DetailMedia
        v-if="mode === 'edit' && selectedMedia"
        ref="detail"
        :media="selectedMedia"
        @update="onUpdateMedia"
        @dupplicate="onDupplicate"
      />

      <div v-if="mode === 'list'" slot="footer" class="flex">
        <el-button @click="hide">Hủy</el-button>
        <div class="flex-1"></div>
        <el-button
          v-if="selectedMedias.length > 0"
          type="success"
          @click="handleSelectMedias"
        >
          Chọn {{ selectedMedias.length }} file
        </el-button>
      </div>

      <div v-if="mode === 'edit'" slot="footer" class="flex">
        <el-button @click="backToList">Hủy</el-button>
        <el-button type="danger" @click="deleteMedia">Xóa</el-button>
        <div class="flex-1"></div>
        <el-button
          :disabled="replacing"
          :loading="replacing"
          type="primary"
          @click="replaceMedia"
        >
          Thay thế
        </el-button>
        <el-button type="success" @click="updateMedia">Lưu</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DetailMedia from './DetailMedia.vue'
import ListMedia from './ListMedia.vue'
import MediaMixin from './media.mixin'
import { removeItems, replace } from '~/utils'
import { cloneDeep, debounce } from '~/utils/lodash'

export default {
  components: { ListMedia, DetailMedia },
  mixins: [MediaMixin],
  props: {
    multiple: Boolean,
    limit: Number,
    accept: String,
  },

  data() {
    return {
      visible: false,
      selectedMedia: null,
      updating: false,
      replacing: false,
      mode: 'list',
      selectedMedias: [],
      debounceUpdateMedia: debounce(this.updateMedia, 500),
    }
  },

  methods: {
    onSelectMedias(medias) {
      if (medias.length === 0) {
        this.selectedMedia = null
      } else if (medias.length >= this.selectedMedias.length) {
        this.selectedMedia = medias[medias.length - 1]
      }
      this.selectedMedias = medias
    },

    hide() {
      this.visible = false
      this.mode = 'list'
    },

    show(media) {
      this.visible = true
      this.mode = 'list'
      if (media) {
        this.selectedMedia = media
      }
      this.$nextTick(() => {
        this.$refs.list.pagination.page = 1
        this.$refs.list.pagination.search = ''
        this.$refs.list.selectedMedias = []
        this.$refs.list.fetchMedias()
      })
    },

    handleSelectMedias() {
      this.$emit('select', this.selectedMedias)
      this.visible = false
      this.$refs.list.selectedMedias = []
      this.selectedMedias = []
      this.selectedMedia = null
    },

    showDetail(media) {
      this.selectedMedia = cloneDeep(media)
      this.mode = 'edit'
    },

    backToList() {
      this.mode = 'list'
    },

    replaceMedia() {
      const listRef = this.$refs.list
      const detailRef = this.$refs.detail
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.multiple = false
      input.onchange = async (event) => {
        try {
          this.replacing = true
          const file = event.target.files[0]
          const formData = new FormData()
          formData.append('file', file)
          const response = await this.$axios.$put(
            `/file/${this.selectedMedia.id}/replace`,
            formData
          )
          response.url = response.url + '?time=' + Date.now()
          this.selectedMedia = response
          detailRef.cropping = false

          const index = listRef.medias.findIndex(
            (item) => item.id === response.id
          )
          if (index >= 0) {
            listRef.medias.splice(index, 1, response)
          }
        } catch (error) {
          console.error('[error] replaceMedia', error)
        } finally {
          this.replacing = false
        }
        input.remove()
      }
      input.click()
    },

    async updateMedia() {
      this.updating = true
      try {
        const response = await this.$axios.$put(
          `/file/${this.selectedMedia.id}`,
          this.selectedMedia
        )
        replace(this.$refs.list.medias, response, 'id')
        this.mode = 'list'
        this.$emit('update', response)
      } catch (error) {
        console.error('[error] updateMedia', error)
      } finally {
        this.updating = false
      }
    },

    onUpdateMedia(media) {
      replace(this.$refs.list.medias, media, 'id')
      this.selectedMedia = media
    },

    onDupplicate(response) {
      this.$refs.list.medias.unshift(response)
      this.selectedMedia = null
      this.mode = 'list'
    },

    async deleteMedia() {
      try {
        const agree = await this.$confirm('Xác nhận xóa file này?', {
          type: 'warning',
        })
          .then(() => true)
          .catch(() => false)

        if (agree) {
          const response = await this.$axios.$delete(
            `/file/${this.selectedMedia.id}`
          )

          if (response.deletedCount > 0) {
            removeItems(this.$refs.list.medias, this.selectedMedia, 'id')
            removeItems(
              this.$refs.list.selectedMedias,
              this.selectedMedia,
              'id'
            )
            removeItems(this.selectedMedias, this.selectedMedia, 'id')
            this.selectedMedia = null
            this.mode = 'list'
          }
        }
      } catch (error) {
        console.error('[error] deleteMedia', error)
      }
    },
  },
}
</script>

<style lang="scss">
.select-media-dialog {
  margin-top: 5vh !important;
  width: 80vw !important;
}
</style>
