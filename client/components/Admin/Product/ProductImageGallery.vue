<template>
  <div class="flex flex-col product-image-gallery">
    <draggable v-model="product.images" class="flex gap-2 flex-nowrap">
      <div
        v-for="image in product.images"
        :key="image.id"
        style="width: 72px; height: 72px"
        class="relative border border-gray-200 gallery-item"
      >
        <img
          v-if="isImage(image)"
          :src="image.url"
          :alt="image.alt"
          class="h-full object-contain"
        />

        <i
          class="el-icon-close bg-gray-400 text-white font-bold rounded-full cursor-pointer absolute -right-2 -top-2 hidden remove-button"
          @click="remove(image)"
        ></i>
      </div>
    </draggable>

    <div>
      <el-button type="text" @click="() => $refs.selectImageDialog.show()">
        Thêm thư viện ảnh sản phẩm
      </el-button>
    </div>

    <SelectMediaDialog
      ref="selectImageDialog"
      multiple
      accept="image.*"
      @select="handleSelect"
      @update="
        ($event) => {
          Object.assign(form.image, $event)
        }
      "
    ></SelectMediaDialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import SelectMediaDialog from '../Media/SelectMediaDialog.vue'
import MediaMixin from '../Media/media.mixin'
import { cloneDeep } from '~/utils/lodash'
import { removeItems } from '~/utils'

export default {
  components: {
    draggable,
    SelectMediaDialog,
  },
  mixins: [MediaMixin],
  props: { product: Object },
  methods: {
    handleSelect(medias) {
      this.product.images.push(...cloneDeep(medias))
    },
    remove(image) {
      removeItems(this.product.images, image)
    },
  },
}
</script>

<style lang="scss">
.product-image-gallery {
  .gallery-item {
    cursor: move;

    .remove-button {
      display: none;
    }

    &:hover .remove-button {
      display: block;
    }
  }
}
</style>
