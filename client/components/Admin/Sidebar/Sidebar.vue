<template>
  <div class="sidebar" :class="{ 'is-collapse': sidebar.collapse }">
    <div class="backdrop" @click="handleBackdropClick"></div>

    <div
      class="sidebar-content flex flex-col"
      :style="{ 'background-color': variables.menuBg }"
    >
      <el-scrollbar class="menu-scrollbar" wrap-style="overflow-x: hidden;">
        <el-menu
          ref="menu"
          class="admin-sidebar-menu"
          :default-active="active"
          :collapse="sidebar.collapse"
          :background-color="variables.menuBg"
          :text-color="variables.menuText"
          :active-text-color="variables.menuActiveText"
          :collapse-transition="false"
          router
          mode="vertical"
        >
          <SidebarItem
            v-for="item in sidebarItems"
            :key="item.name"
            :item="item"
          />
        </el-menu>
      </el-scrollbar>
    </div>

    <div id="toogle-button" @click="toggleSidebar">
      <i v-if="sidebar.collapse" class="el-icon-arrow-right"></i>
      <i v-else class="el-icon-arrow-left"></i>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Vue from 'vue'
import SidebarItem from './SidebarItem.vue'

export default Vue.extend({
  components: { SidebarItem },
  data() {
    return {
      active: '',
      variables: {
        menuText: '#bfcbd9',
        menuActiveText: '#ffd04b',
        subMenuActiveText: '#f4f4f5',
        menuBg: '#304156',
        menuHover: '#263445',
        subMenuBg: '#1f2d3d',
        subMenuHover: '#001528',
        sideBarWidth: '210px',
      },
    }
  },

  computed: {
    ...mapState('admin', ['sidebar']),
    ...mapGetters('admin', ['sidebarItems']),
  },

  watch: {
    $route() {
      const $route = this.$route
      const menu = this.$refs?.menu
      // @ts-ignore
      menu.activeIndex =
        $route.meta?.sidebarKey || $route.path.replace(/\/+$/g, '')
    },
  },

  created() {
    this.active =
      this.$route.meta?.sidebarKey || this.$route.path.replace(/\/+$/g, '')
  },

  methods: {
    handleBackdropClick() {
      this.$store.commit('admin/toggleSidebar')
    },
    toggleSidebar() {
      this.$store.commit('admin/toggleSidebar')
    },
  },
})
</script>

<style lang="scss">
$menuText: #bfcbd9;
$menuActiveText: #ffd04b;
$subMenuActiveText: #f4f4f5; // https://github.com/ElemeFE/element/issues/12951

$menuBg: #304156;
$menuHover: #263445;

$subMenuBg: #1f2d3d;
$subMenuHover: #001528;

$sideBarWidth: 210px;

.sidebar {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: $menuBg;

  left: 0;
  top: 0;
  transition: width 0.3s;
  width: $sideBarWidth;
  z-index: 1000;

  #toogle-button {
    height: 32px;
    width: 16px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    right: -8px;
    bottom: 16px;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.is-collapse {
    width: 64px;
  }

  .backdrop {
    display: none;
  }

  .sidebar-content {
    height: 100%;
  }

  @media screen and (max-width: 768px) {
    // mobile
    transition: width 0.5s;
    position: fixed;
    top: 0;
    left: 0;

    #toogle-button {
      position: fixed;
      left: 0;
      bottom: 16px;
    }

    &:not(.is-collapse) {
      .sidebar-content {
        z-index: 1001;
        height: 100%;
      }

      .backdrop {
        display: block;
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 999;
        background: rgba(0, 0, 0, 0.3);
      }
    }

    &.is-collapse {
      left: -1 * $sideBarWidth;
    }
  }

  .el-submenu i,
  .el-menu-item i {
    color: $menuText;
  }

  a.el-menu-item {
    text-decoration: none !important;
  }

  .el-submenu [class^='icofont-'],
  .el-menu-item [class^='icofont-'] {
    margin-right: 5px;
    width: 24px;
    text-align: center;
    font-size: 18px;
    vertical-align: middle;
  }

  .el-menu-item {
    height: 42px;
    line-height: 42px;

    &.is-active {
      background-color: rgb(38, 52, 69) !important;
    }
  }

  .el-menu-item.is-active i {
    color: $menuActiveText;
  }

  .topbar {
    height: 48px;
    width: 100%;

    .logo {
      width: 32px;
      height: 32px;
    }
  }

  .menu-scrollbar {
    height: 100%;
    flex: 1;
    overflow-x: hidden;
  }

  .admin-sidebar-menu {
    border: none;
  }

  .admin-sidebar-menu:not(.el-menu--collapse) {
    width: $sideBarWidth;
  }

  .el-menu--collapse > .el-menu-item-group > .el-menu-item-group__title {
    display: none;
  }

  .el-menu--collapse {
    .el-menu-item-group {
      .el-menu-item span,
      .el-menu--collapse > .el-submenu > .el-submenu__title span {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
      }
    }
  }
}
</style>
