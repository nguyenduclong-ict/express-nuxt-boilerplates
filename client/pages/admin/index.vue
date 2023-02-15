<template>
  <div></div>
</template>

<script>
export default {
  layout: 'admin',
  auth: true,
  methods: {
    async logout() {
      await this.$auth.logout({
        data: {
          refresh_token: this.$auth.strategy.refreshToken.get(),
        },
      })
      this.$router.push('/admin/login')
    },
  },
}
</script>

<style lang="scss" scoped></style>
