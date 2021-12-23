#!/usr/bin/env node

const path = require('path')
const fs = require('fs-extra')

fs.copySync(path.join(__dirname, 'template-vue'), path.join(process.cwd(), 'fir'))
