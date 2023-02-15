<template>
  <div class="flex flex-col h-screen items-center justify-center">
    <div class="text-3xl text-gray-700 mb-4">Login Admin Panel</div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      class="w-96"
      size="normal"
      @keyup.native.enter.prevent="login"
    >
      <el-form-item label="Username" prop="username">
        <el-input
          v-model="form.username"
          placeholder="Nhập Username"
        ></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          placeholder="Nhập Password"
          show-password
        ></el-input>
      </el-form-item>

      <el-button
        type="primary"
        class="w-full"
        :loading="loading"
        size="normal"
        @click="login"
      >
        {{ loading ? 'Đang đăng nhập' : 'Đăng nhập' }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { patterns, validateForm } from '@/utils'
export default {
  layout: 'admin-login',
  auth: 'guest',
  data() {
    return {
      loading: false,
      form: {
        username: '',
        password: '',
        confirmationPassword: '',
      },
      rules: {
        username: {
          type: 'string',
          required: true,
          min: 4,
        },
        password: {
          type: 'string',
          requried: true,
          pattern: patterns.password,
          message: `password invalid`,
          required: true,
        },
      },
    }
  },
  methods: {
    async login() {
      this.loading = true
      const valid = await validateForm(this.$refs.form)
      if (valid) {
        try {
          const res = await this.$auth.loginWith('local', {
            data: {
              username: this.form.username,
              password: this.form.password,
            },
          })

          if (res.data.token) {
            this.$router.push('/admin')
          }
        } catch (error) {
          this.$message.error(error?.response?.data?.message || error.message)
        }
      }
      this.loading = false
    },
  },
}
</script>
