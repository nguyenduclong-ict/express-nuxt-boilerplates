<template>
  <button
    class="el-button m-el-button"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
      },
    ]"
    @click="handleClick"
  >
    <i v-if="loading" class="el-icon-loading"></i>
    <template v-if="icon && !loading">
      <i v-if="icon.startsWith('el-icon')" :class="icon"></i>
      <svg-icon v-else class="el-icon-base" :name="icon"></svg-icon>
    </template>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
import { Button } from 'element-ui'
export default {
  name: 'ElButton',
  extends: Button,
}
</script>

<style lang="scss">
.el-button.m-el-button {
  display: inline-flex;
  justify-content: center;
  &.el-button--small {
    .icon {
      width: 12px;
      height: 12px;
    }
  }

  &.icon-only.el-button--small {
    padding: 9px;
  }

  &.icon-only.el-button--mini {
    padding: 7px;
  }
}
</style>
