<template>
  <div class="detail-media">
    <div class="flex detail-image-content">
      <div class="flex-1 w-50 image-left">
        <template v-if="cropping">
          <div class="detail-image-tooltip" style="z-index: 1000">
            <el-button
              size="mini"
              icon="el-icon-close"
              class="icon-only"
              @click="cropping = false"
            ></el-button>

            <el-dropdown @command="handleCropCommand">
              <el-button
                size="mini"
                icon="el-icon-check"
                class="icon-only"
                type="success"
                @click="cropAndReplaceImage"
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="cropAndReplace">
                  Cắt và thay thế
                </el-dropdown-item>
                <el-dropdown-item command="cropAndDupplicate">
                  Cắt và tạo bản sao
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <cropper ref="cropper" :src="media.url" class="cropper" />
        </template>
        <div v-else>
          <div v-if="isImage(media)" class="detail-image-tooltip">
            <el-button
              size="mini"
              icon="el-icon-link"
              class="icon-only"
              @click="copyMediaUrl"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-crop"
              class="icon-only"
              @click="showCropImage"
            ></el-button>
          </div>
          <img class="preview-image" :src="media.url" />
        </div>
      </div>
      <div class="flex-1 w-50">
        <!-- file info -->
        <div class="block-info bg-light rounded p-3 flex flex-wrap">
          <div class="text-secondary">
            <div>Size</div>
            <div>{{ media.size | fileSize }}</div>
          </div>
          <div class="text-secondary">
            <div>Date</div>
            <div>{{ media.createdAt | date }}</div>
          </div>
          <div class="text-secondary">
            <div>Mimetype</div>
            <div>{{ media.mimetype }}</div>
          </div>
          <div class="text-secondary">
            <div>Extension</div>
            <div class="text-uppercase">{{ getExt(media) }}</div>
          </div>
        </div>

        <el-form class="mt-4">
          <el-form-item label="File name">
            <el-input v-model="media.name" placeholder="File name"></el-input>
          </el-form-item>

          <el-form-item label="Alternative text">
            <el-input
              v-model="media.alt"
              placeholder="Alternative text"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper'
import MediaMixin from './media.mixin'
import 'vue-advanced-cropper/dist/style.css'

export default {
  components: {
    Cropper,
  },

  mixins: [MediaMixin],

  props: {
    media: { type: Object },
  },

  data() {
    return {
      cropping: false,
    }
  },

  methods: {
    showCropImage() {
      this.cropping = true
    },

    copyMediaUrl() {
      this.$copyText(this.media.url).then(
        (e) => {
          this.$message.success('Đã sao chép')
        },
        (e) => {
          console.log(e)
        }
      )
    },

    handleCropCommand(command) {
      switch (command) {
        case 'cropAndReplaceImage':
          this.cropAndReplaceImage()
          break

        case 'cropAndDupplicate':
          this.cropAndDupplicate()
          break

        default:
          break
      }
    },

    async cropAndReplaceImage() {
      try {
        const blob = await this.getBlob(this.$refs.cropper.getCanvas())
        const file = new File([blob], this.media.name, {
          type: this.media.mimetype,
        })
        const formData = new FormData()
        formData.append('file', file)
        const response = await this.$axios.$put(
          `/file/${this.media.id}/replace`,
          formData
        )
        response.url = response.url + '?time=' + Date.now()
        this.$emit('update', response)
        this.cropping = false
      } catch (error) {
        console.log('[error] cropAndReplaceImage', error)
      }
    },

    async cropAndDupplicate() {
      try {
        const blob = await this.getBlob(this.$refs.cropper.getCanvas())
        this.uploading = true
        const formData = new FormData()
        const ext = this.media.name.split('.').pop()
        const newName = this.media.name.replace(
          new RegExp(ext + '$'),
          ' Copy.' + ext
        )
        const file = new File([blob], newName)
        formData.append('file', file)
        const response = await this.$axios.$post(`/file/upload`, formData)
        this.cropping = false
        this.$emit('dupplicate', response)
      } catch (error) {
        console.error('[error] uploadNewImages', error)
      } finally {
        this.uploading = false
      }
    },
  },
}
</script>

<style lang="scss">
.detail-media {
  .detail-image-content {
    gap: 32px;

    img.preview-image {
      width: 100%;
      background: #3b4148;
      max-height: 500px;
      object-fit: contain;
    }

    .image-left {
      position: relative;
      .detail-image-tooltip {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 8px;
        .el-button {
          margin: 0px;
        }
      }
    }
  }

  .block-info {
    gap: 12px;

    > div {
      width: calc(50% - 6px);
    }
  }
}
</style>
