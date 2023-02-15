import config from '@/config'
import { ConfigModel } from '@/database'
import { createController } from '@/helpers/router'

export const isInitedController = createController(async (req, res) => {
  const doc = await ConfigModel.findOne({
    key: config.configKeys.INITED,
  })

  res.json({ inited: !!doc?.value })
})
