// 引入 Node.js 的 fs 模块，用于进行文件系统操作
const fs = require('fs')

// 引入 koa-router 模块，用于创建和管理路由
const Router = require('koa-router')
// 创建一个新的路由实例
const router = new Router()

/**
 * 自动加载当前目录下除 index.js 之外的所有路由文件
 * 使用同步方法 readdirSync 读取当前目录下的所有文件
 * 遍历这些文件并加载对应的路由
 */
fs.readdirSync(__dirname).forEach(file => {
    // 过滤掉当前的 index.js 文件
    if (file !== 'index.js') {
        // 动态引入当前目录下的路由文件
        let routerFile = require('./' + file)
        // 将引入的路由文件中的路由规则挂载到主路由实例上
        router.use(routerFile.routes())
    }
})

// 导出主路由实例，供其他模块使用
module.exports = router