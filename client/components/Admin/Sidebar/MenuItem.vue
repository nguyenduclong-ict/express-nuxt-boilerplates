<template>
  <component
    :is="type"
    v-bind="linkProps"
    class="el-menu-item"
    role="menuitem"
    tabindex="-1"
    :style="[paddingStyle, itemStyle, { backgroundColor }]"
    :class="{
      'is-active': active,
      'is-disabled': disabled,
    }"
    @click="handleItemClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <el-tooltip
      v-if="
        parentMenu.$options.componentName === 'ElMenu' &&
        rootMenu.collapse &&
        $slots.title
      "
      effect="dark"
      placement="right"
    >
      <div slot="content"><slot name="title"></slot></div>
      <div
        style="
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 100%;
          display: inline-block;
          box-sizing: border-box;
          padding: 0 20px;
        "
      >
        <slot></slot>
      </div>
    </el-tooltip>
    <template v-else>
      <slot></slot>
      <slot name="title"></slot>
    </template>
  </component>
</template>

<script>
import Vue from 'vue'
import { MenuItem } from 'element-ui'
import { isExternal } from '~/utils'

export default Vue.extend({
  name: 'ElMenuItem',
  extends: MenuItem,

  props: {
    route: Object,
  },

  computed: {
    isExternal() {
      return isExternal(this.index)
    },
    type() {
      if (!this.index) return 'li'
      return 'router-link'
    },
    linkProps() {
      if (this.route && this.route.name) {
        return { to: this.route }
      }
      if (this.index) return { to: this.index }
      return {}
    },
  },

  methods: {
    handleItemClick(e) {
      if (this.type === 'a') {
        e.preventDefault()
      }
      this.handleClick()
    },
  },
})
</script>

<style scoped>
a.el-menu-item {
  display: list-item;
  text-align: -webkit-match-parent;
}
</style>
