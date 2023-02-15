<template>
  <div class="flex flex-col">
    <div class="flex">
      <div class="flex-1">
        <img
          v-if="!variant.image"
          src="~/assets/png/image.png"
          class="my-4 cursor-pointer"
          style="width: 64px; height: 64px"
          @click="() => $refs.selectMedia.show()"
        />
        <div
          v-else
          style="width: 64px; height: 64px"
          class="my-4 cursor-pointer relative border border-gray-200"
        >
          <img
            :src="variant.image.url"
            :alt="variant.image.alt"
            class="w-full h-full object-cover"
          />
          <i
            class="el-icon-delete absolute top-1 right-1 cursor-pointer p-1 bg-white text-red-500 border rounded-sm"
            @click="variant.image = null"
          ></i>
        </div>
        <SelectMediaDialog
          ref="selectMedia"
          accept="image.*"
          @select="handleSelectImage"
        ></SelectMediaDialog>
      </div>
      <div class="flex-1">
        <el-form-item label="Mã sản phẩm">
          <el-input v-model="variant.sku" class="w-full"></el-input>
        </el-form-item>
      </div>
    </div>
    <div class="flex w-full">
      <el-checkbox v-model="variant.active">Bật</el-checkbox>
      <el-checkbox v-model="variant.is_manage_stock">
        Quản lý kho hàng
      </el-checkbox>
    </div>
    <div class="flex gap-4 w-full">
      <el-form-item label="Giá" class="flex-1">
        <InputNumber v-model="variant.price" class="w-full"></InputNumber>
      </el-form-item>
      <el-form-item label="Giá khuyến mãi" class="flex-1">
        <InputNumber
          v-model="variant.sale_off_price"
          class="w-full"
        ></InputNumber>
      </el-form-item>
    </div>
    <el-form-item label="Trạng thái kho hàng">
      <el-select v-model="variant.status" class="w-full">
        <el-option
          v-for="st in statuses"
          :key="st.value"
          :label="st.name"
          :value="st.value"
        ></el-option>
      </el-select>
    </el-form-item>

    <div class="flex gap-4">
      <el-form-item label="Cân nặng (kg)" class="flex-1">
        <InputNumber
          v-model="variant.shipping.weight"
          :min="0"
          class="w-full"
        ></InputNumber>
      </el-form-item>
      <el-form-item label="Kích cỡ (D×R×C)(cm)" class="label-w-full flex-1">
        <div class="flex w-full">
          <InputNumber
            v-model="variant.shipping.length"
            class="w-auto"
            :min="0"
          ></InputNumber>
          <InputNumber
            v-model="variant.shipping.width"
            class="w-auto"
            :min="0"
          ></InputNumber>
          <InputNumber
            v-model="variant.shipping.height"
            class="w-auto"
            :min="0"
          ></InputNumber>
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import InputNumber from '../InputNumber.vue'
import SelectMediaDialog from '../Media/SelectMediaDialog.vue'

export default {
  components: { InputNumber, SelectMediaDialog },
  props: {
    variant: Object,
    statuses: Array,
  },
  methods: {
    handleSelectImage(medias) {
      const media = medias[0]
      this.variant.image = {
        url: media.url,
        alt: media.alt,
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
