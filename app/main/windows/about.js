const openAboutWindow = require('about-window').default
const path = require('path')

const create = () => openAboutWindow({
  icon_path: path.join(__dirname, 'icon.png'),
  package_json_dir: path.join(__dirname, '../../../'),
  copyright: 'Copyrighr (c) 2020 Ying Wang',
  homepage: 'https://github.com/upcwangying',
})

module.exports = { create }
