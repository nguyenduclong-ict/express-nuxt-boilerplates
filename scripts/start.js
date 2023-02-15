const tsConfig = require('../.output/server/tsconfig.json')
const tsConfigPaths = require('tsconfig-paths')
const path = require('path')

tsConfigPaths.register({
  baseUrl: path.join(__dirname, '../.output/server'),
  paths: tsConfig.compilerOptions.paths,
})
