<template>
  <div class="tinymce-editor" :class="[toolbarSize]">
    <editor v-model="_value" :init-value="value" :init="init" />

    <SelectMediaDialog
      ref="mediaDialog"
      :multiple="true"
      @select="onSelectMedia"
    />
  </div>
</template>

<script>
/* eslint import/no-webpack-loader-syntax: off */
/* Import TinyMCE */
import 'tinymce'
/* Default icons are required for TinyMCE 5.3 or above */
import 'tinymce/icons/default'
/* A theme is also required */
import 'tinymce/themes/silver'
/* Import the skin */
import 'tinymce/skins/ui/oxide/skin.css'
/* Import plugins */
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/code'
import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/table'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/media'
import 'tinymce/plugins/image'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/wordcount'

import Editor from '@tinymce/tinymce-vue'
import SelectMediaDialog from './Media/SelectMediaDialog.vue'
import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css'
import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css'

export default {
  name: 'TinymceEditor',
  components: {
    editor: Editor,
    SelectMediaDialog,
  },

  props: {
    value: String,
    toolbarSize: {
      validator: (v) => v === 'small' || v === 'normal',
      default: 'small',
    },
    placeholder: String,
  },

  data() {
    return {
      init: {
        height: 500,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap print preview anchor preview',
          'searchreplace visualblocks code fullscreen imagetools',
          'insertdatetime media table paste code wordcount a11ychecker tabfocus',
        ],
        toolbar: [
          'formatselect | bold italic backcolor | table |',
          'alignleft aligncenter alignright alignjustify| ',
          'bullist numlist outdent indent | removeformat | image media gallery | preview fullscreen',
        ].join(''),
        toolbar_mode: 'wrap',
        lists_indent_on_tab: true,
        content_css: '/assets/tinymce/css/tinymce.css',
        content_style: contentUiCss.toString() + '\n' + contentCss.toString(),
        // Image
        images_upload_handler: this.imageUploadHandler,
        image_caption: true,
        image_advtab: true,
        a11y_advanced_options: true,
        resize_img_proportional: false,
        paste_data_images: true,
        image_dimensions: false,
        automatic_uploads: true,
        file_picker_callback: this.filePickerHandler,
        image_class_list: [
          { title: 'Width: 100%', value: 'image__w-full' },
          { title: 'Width: 50%', value: 'image__w-50pt' },
          { title: 'Width: auto', value: 'image__w-auto' },
        ],
        setup: (editor) => {
          this.editor = editor
          editor.on('ObjectResized', this.handleImageResized)
          editor.on('keydown', this.handleEditorKeydown)
          this.setup(editor)
        },
        init_instance_callback: (editor) => {
          editor.contentAreaContainer
            .querySelector('iframe')
            .contentDocument.addEventListener(
              'dblclick',
              this.handleEditorContainerDblclick
            )
        },
        placeholder: this.placeholder,
        // Image
        branding: false,
        elementpath: true,
        statusbar: true,
      },
      editor: null,
      previewKeyDown: null,
    }
  },

  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        return this.$emit('input', v)
      },
    },
  },

  methods: {
    setup(editor) {
      editor.ui.registry.addButton('gallery', {
        text: `<i class="el-icon-upload" style="font-size: 22px"></i> Thư viện`,
        onAction: (_) => {
          this.$refs.mediaDialog.show()
        },
      })
    },

    imageUploadHandler(blobInfo, success, failure, progress) {
      const onError = (error) => failure(error.message)
      const formData = new FormData()
      formData.append('file', blobInfo.blob())

      this.$axios
        .$post('/api/upload', formData, progress, onError)
        .then((fileResponses) => {
          success(fileResponses.url)
        })
    },

    handleImageResized(e) {
      e.target.classList.value = e.target.classList.value.replace(
        /(^| )image__w-\w*/g,
        ''
      )
      e.target.classList.add('resized')
    },

    handleEditorContainerDblclick(e) {
      if (e.target.tagName === 'IMG') {
        window.open(e.target.getAttribute('src'), '_blank')
      }
    },

    handleEditorKeydown(e) {
      if (e.code === 'Tab' && this.previewKeyDown === 'Minus') {
        // this.editor.execCommand('InsertDefinitionList', false)
        // this.editor.execCommand('InsertDefinitionList', false)
        e.preventDefault()
        this.$nextTick(() => {
          this.editor.execCommand('Delete')
          this.editor.execCommand('InsertOrderedList', false, {
            'list-style-type': 'decimal',
          })
        })
      } else if (e.code === 'Tab' && this.previewKeyDown === 'Period') {
        e.preventDefault()
        this.$nextTick(() => {
          this.editor.execCommand('Delete')
          this.editor.execCommand('InsertUnorderedList', true, {
            'list-style-type': 'disc',
          })
        })
      }
      this.previewKeyDown = e.code
    },

    onSelectMedia(medias) {
      medias.forEach((media) => {
        this.editor.insertContent(
          `<img class="resized" width="auto"
            src="${media.url}"
            alt="${media.alt || media.name}"
          />`
        )
      })
    },
  },
}
</script>

<style lang="scss">
.tox-notifications-container {
  display: none;
}

.tox.tox-silver-sink.tox-tinymce-aux {
  z-index: 3000;
}

.tinymce-editor {
  width: 100%;
  display: inline-block;
  &.small .tox-toolbar {
    background: url("data:image/svg+xml;charset=utf8,%3Csvg height='29px' viewBox='0 0 30 29px' width='30' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='28px' width='100' height='1' fill='%23cccccc'/%3E%3C/svg%3E")
      left 0 bottom 0 #fff !important;

    .tox-tbtn {
      height: var(--toolbar-size);
      cursor: pointer;
    }

    .tox-tbtn__select-label {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
  }
}
</style>
