class ConsoleUtil {
    // 访问服务器-输出日志
    accessService(msg) {
        console.log('——访问服务器——', msg)
    }
    // 访问控制器
    accessController(msg) {
        console.log('——访问控制器——', msg)
    }
    // 访问中间件
    accessMiddleware(msg) {
        console.log('——访问中间件——', msg)
    }

    success(msg) {
        console.log('——注册成功——', msg)
    }
}

module.exports = new ConsoleUtil();
