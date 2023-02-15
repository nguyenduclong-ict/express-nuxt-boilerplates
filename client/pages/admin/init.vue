<template>
  <div class="flex flex-col h-screen items-center justify-center">
    <div class="text-3xl text-gray-700 mb-4">Init Admin Account</div>
    <el-form ref="form" :model="form" :rules="rules" class="w-96" size="normal">
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
      <el-form-item label="Nhập lại Password" prop="confirmationPassword">
        <el-input
          v-model="form.confirmationPassword"
          placeholder="Nhập lại Password"
          show-password
        ></el-input>
      </el-form-item>

      <el-button type="primary" class="w-full" size="medium" @click="init">
        Tạo tài khoản
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
        confirmationPassword: {
          required: true,
          validator: (rule, value, callback) => {
            callback(
              value === this.form.password
                ? undefined
                : new Error(`password not match`)
            )
          },
        },
      },
    }
  },
  methods: {
    async init() {
      const valid = await validateForm(this.$refs.form)
      if (valid) {
        try {
          const res = await this.$axios.$post('/auth/init', {
            username: this.form.username,
            password: this.form.password,
          })

          this.$store.commit('SET_INITED', true)

          if (res.success) {
            this.$router.push('/admin/login')
          }
        } catch (error) {
          this.showErrorMessage(error)
        }
      }
    },
  },
}
</script>
