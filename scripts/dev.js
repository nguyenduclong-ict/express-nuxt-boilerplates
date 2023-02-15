const tsConfig = require('../server/tsconfig.json')
const tsConfigPaths = require('tsconfig-paths')
const path = require('path')

tsConfigPaths.register({
  baseUrl: path.join(__dirname, '../server'),
  paths: tsConfig.compilerOptions.paths,
})
