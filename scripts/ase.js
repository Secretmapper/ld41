const exec = require('child_process').exec
const fs = require('fs')
const path = require('path')

const dirname = './src/assets/images/entities/'

function onError (err) {
  console.error(err)
}

fs.readdir(dirname, function(err, filenames) {
  if (err) {
    onError(err)
    return
  }
  filenames.forEach(function(filename) {
    if (path.extname(filename).toLowerCase() === '.ase') {
      exec(`/Applications/Aseprite.app/Contents/MacOS/aseprite -b ${dirname + filename} --save-as ${dirname + filename.slice(0, -4)}.png`)
    }
  })
})
