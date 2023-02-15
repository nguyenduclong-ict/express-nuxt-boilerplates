<template>
  <el-input
    v-model="cValue"
    class="input-search"
    :placeholder="placeholder"
    :prefix-icon="prefixIcon"
    :suffix-icon="loading ? 'el-icon-loading' : 'el-icon'"
    :size="size"
    @input="handleInput"
  ></el-input>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  props: {
    placeholder: String,
    value: [String, Number],
    debounce: {
      type: Number,
      default: 500,
    },
    prefixIcon: {
      type: String,
      default: 'el-icon-search',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small',
    },
  },
  data() {
    const data = {
      cValue: '',
    }
    data.handleInput = this.debounce
      ? debounce(this.onInput, this.debounce)
      : this.onInput
    return data
  },
  watch: {
    value: {
      handler(v) {
        this.cValue = v
      },
      immediate: true,
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
      this.$emit('search', value)
    },
  },
}
</script>
