<template>
  <el-input
    ref="input"
    v-model="_value"
    class="input-number"
    :placeholder="placeholder"
    @blur="validateValue"
    @keydown.native.enter="validateValue"
  ></el-input>
</template>

<script>
import numeral from 'numeral'
export default {
  props: {
    value: { type: null },
    placeholder: { type: String },
    min: {},
    max: {},
  },

  data() {
    return {
      selectionIndex: 0,
    }
  },

  computed: {
    _value: {
      get() {
        if (typeof this.value === 'string' && this.value?.trim() === '-') {
          return '-'
        }
        if (
          this.value === '' ||
          this.value === null ||
          this.value === undefined
        )
          return ''
        if (!isNaN(this.value)) return numeral(this.value).format('0,0.[00]')
        return this.value
      },
      set(v) {
        if (v?.trim() === '-') {
          this.$emit('input', '-')
          return
        }
        const coma = v.match(/,/g)?.length || 0
        let coma2
        let value
        try {
          value = numeral(v).value()
          coma2 = numeral(value).format('0,0.[00]').match(/,/g)?.length || 0
        } catch (error) {}
        if (value < this.min) {
          value = this.min
        }
        if (value > this.max) {
          value = this.max
        }
        this.$emit('input', value)
        const selectionEnd = this.$refs.input.$refs.input.selectionEnd
        this.$nextTick(() => {
          this.$refs.input.$refs.input.selectionEnd =
            selectionEnd + (coma2 > coma ? 1 : coma2 === coma ? 0 : -1)
        })
      },
    },
  },
  mounted() {},

  methods: {
    validateValue() {
      if (this.value === '-') {
        this.$emit('input', null)
      }
    },
  },
}
</script>

<style lang="scss"></style>
