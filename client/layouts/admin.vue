<template>
  <div id="layout-admin">
    <Sidebar></Sidebar>
    <div id="content">
      <Navbar class="sticky top-0"></Navbar>
      <nuxt></nuxt>
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Admin/Navbar/Navbar.vue'
import Sidebar from '~/components/Admin/Sidebar/Sidebar.vue'
import '~/assets/css/admin.scss'
export default { components: { Sidebar, Navbar } }
</script>

<style lang="scss">
#layout-admin {
  display: flex;
  width: 100vw;
  height: 100vh;

  #content {
    height: 100vh;
    overflow-y: auto;
    flex: 1;
    width: calc(100%);
  }
}
</style>
