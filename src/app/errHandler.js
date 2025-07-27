module.exports = (err, ctx) => {
    // 默认 HTTP 状态码，500 表示服务器内部错误
    let status = 500;
    // 默认自定义业务错误码，50000 表示通用服务器错误
    let code = 50000;
    // 默认错误消息
    let msg = '服务器内部错误';

    // 根据不同的业务错误码设置 HTTP 状态码和自定义错误信息
    switch (err.code) {
        // 10001 表示请求参数错误
        case '10001':
            // 400 表示客户端请求错误
            status = 400;
            code = 10001;
            msg = '请求参数错误';
            break;
        // 10002 表示资源冲突，比如用户名已存在
        case '10002':
            // 409 表示请求与服务器当前状态冲突
            status = 409;
            code = 10002;
            msg = '资源冲突';
            break;
        // 20001 表示用户未认证
        case '20001':
            // 401 表示需要用户认证
            status = 401;
            code = 20001;
            msg = '用户未认证，请先登录';
            break;
        // 20002 表示用户无权限
        case '20002':
            // 403 表示服务器理解请求但拒绝执行
            status = 403;
            code = 20002;
            msg = '用户无权限访问该资源';
            break;
        // 30001 表示资源未找到
        case '30001':
            // 404 表示请求的资源未找到
            status = 404;
            code = 30001;
            msg = '请求的资源未找到';
            break;
        default:
            status = 500;
            code = 50000;
            msg = '服务器内部错误';
    }

    // 设置 HTTP 状态码
    ctx.status = status;
    // 以 JSON 格式返回错误信息，包含自定义业务错误码、错误消息
    ctx.body = {
        code,
        msg,
        data: null
    };
};