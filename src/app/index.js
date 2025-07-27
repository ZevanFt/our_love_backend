// 引入 Node.js 内置的 path 模块，用于处理文件和目录路径
const path = require('path')

// 引入 Koa 框架核心模块，用于创建 Web 服务器
const Koa = require('koa');
// 引入 koa-body 中间件，用于解析请求体
const KoaBody = require('koa-body')
// 引入 koa-static 中间件，用于提供静态文件服务
const KoaStatic = require('koa-static')
// 引入 koa-parameter 中间件，用于请求参数验证
const parameter = require('koa-parameter')
// 引入 @koa/cors 中间件，用于处理跨域问题
const cors = require('@koa/cors');

// 引入自定义的错误处理模块
const errHandler = require('./errHandler')

// 引入自定义的路由模块
const router = require('../router')

// 创建一个 Koa 应用实例
const app = new Koa()

// 使用 @koa/cors 中间件处理跨域
app.use(cors({
    // 允许所有域名跨域访问，实际生产环境建议指定具体域名
    origin: '*',
    // 允许的请求方法
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // 允许的请求头
    headers: ['Content-Type', 'Authorization']
}));
// 使用 koa-body 中间件解析请求体
app.use(KoaBody.default({
    // 开启文件上传功能
    multipart: true,
    // 配置 formidable 库，用于处理文件上传
    formidable: {
        // 指定文件上传目录，使用 path.join 拼接当前文件所在目录和 '../upload'
        // 注意：option 里的相对路径是相对于 process.cwd()，而非当前文件
        uploadDir: path.join(__dirname, '../upload'),
        // 保留上传文件的扩展名
        keepExtensions: true,
    },
    // 指定需要解析请求体的 HTTP 方法
    parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
}))

// 使用 koa-static 中间件将 '../html' 目录下的文件作为静态资源暴露
app.use(KoaStatic(path.join(__dirname, '../html')))

// 使用 koa-static 中间件将 '../upload' 目录下的文件作为静态资源暴露
app.use(KoaStatic(path.join(__dirname, '../upload')))

// 使用 koa-parameter 中间件进行请求参数验证，将其挂载到 Koa 应用实例
app.use(parameter(app))

// 使用自定义路由模块中定义的路由规则
// router.routes() 挂载路由规则
// router.allowedMethods() 根据路由匹配结果返回相应的 HTTP 方法支持信息
app.use(router.routes()).use(router.allowedMethods())

// 统一的错误处理
// 监听 Koa 应用实例的 'error' 事件，当发生错误时调用 errHandler 函数处理
app.on('error', errHandler)

// 导出 Koa 应用实例，供其他模块使用
module.exports = app