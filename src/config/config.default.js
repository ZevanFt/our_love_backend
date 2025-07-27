// const dotenv = require('dotenv')
const path = require('path')
// dotenv.config()

require('dotenv').config({ path: path.join(__dirname, '../../.env') })
//  process.env.APP_PORT
// console.log(process.env.APP_PORT)
// console.log(path.join(__dirname, '../../.env'))

module.exports = process.env