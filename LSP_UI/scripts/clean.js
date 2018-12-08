'use strict'
process.chdir('../LSP_UI')

const fs = require('fs-extra')
const paths = require('../config/paths')

fs.emptyDirSync(paths.appDistServer)
fs.emptyDirSync(paths.appDistPublic)
