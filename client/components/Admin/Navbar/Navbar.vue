<template>
  <div class="navbar border-b border-gray-300 flex bg-white">
    <div class="toggle-button active:bg-slate-100" @click="toggleMenu">
      <i v-if="sidebar.collapse" class="el-icon-s-unfold"></i>
      <i v-else class="el-icon-s-fold"></i>
    </div>
    <div class="flex-1 flex items-center px-2">{{ title }}</div>
    <el-dropdown
      class="p-2 flex items-center justify-center"
      style="display: flex"
      @command="handleCommand"
    >
      <el-avatar size="small"></el-avatar>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>@{{ $auth.user.username }}</el-dropdown-item>
        <el-dropdown-item divided command="logout">Đăng xuất</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  computed: {
    ...mapState('admin', ['sidebar']),
    ...mapGetters('admin', ['sidebarItems']),
    title() {
      if (this.$route.meta.title) return this.$route.meta.title
      let title = ''
      const key =
        this.$route.meta?.sidebarKey || this.$route.path.replace(/\/+$/g, '')
      this.sidebarItems.forEach((item) => {
        if (item.path === key) title = item.name
        if (item.children) {
          item.children.forEach((child) => {
            if (child.path === key) title = child.name
          })
        }
      })
      return title
    },
  },

  methods: {
    toggleMenu() {
      this.$store.commit('admin/toggleSidebar')
    },
    async handleCommand(command) {
      if (command === 'logout') {
        await this.$auth.logout({
          data: {
            refresh_token: this.$auth.strategy.refreshToken.get(),
          },
        })
        this.$router.push('/admin/login')
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 42px;
  z-index: 2000;

  .toggle-button {
    width: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}
</style>
