import { ElMessageBoxShortcutMethod } from 'element-ui/types/message-box'

declare module 'vue/types/vue' {
  interface Vue {
    showConfirm: ElMessageBoxShortcutMethod
    showErrorMessage: (error) => void
    validateForm: (form: any) => Promise<boolean>

    meta: {
      title: string
      sidebarKey: string
    }
  }
}
