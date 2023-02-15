import numeral from 'numeral'
import dayjs from '~/utils/dayjs'

const MediaMixin = {
  filters: {
    date(value) {
      return dayjs(value).format('D MMMM, YYYY h:mm A')
    },
    fileSize(value) {
      return numeral(value).format('0b')
    },
  },
  methods: {
    isImage(media) {
      return media?.mimetype?.includes('image')
    },

    getMediaType(media) {
      if (media.mimetype?.includes('image')) return 'IMAGE'
      return 'FILE'
    },

    getExt(media) {
      return media.name.split('.').pop()
    },

    getBlob(canvas) {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob)
        })
      })
    },
  },
}

export default MediaMixin
