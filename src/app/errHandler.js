module.exports = (err, ctx) => {
  let status = 500; // 默认HTTP状态码
  let code = 50000;
  let message = '服务器内部错误';

  // 检查 err 对象是否是我们从控制器 emit 的标准错误格式
  if (err.code && err.message) {
    code = err.code;
    message = err.message;

    // 根据错误码的第一位数字设置合适的HTTP状态码
    const firstDigit = String(code).charAt(0);
    switch (firstDigit) {
      case '1': // 1xxxx: 用户端错误
        status = 400; // Bad Request
        break;
      case '2': // 2xxxx: 认证或权限错误
        if (err.code === '10101' || err.code === '10102') {
          status = 401; // Unauthorized
        } else {
          status = 403; // Forbidden
        }
        break;
      case '3': // 3xxxx: 资源未找到 (我们这里用在了卡券模块)
        status = 404; // Not Found
        break;
      // 其他错误码 (4xxxx, 5xxxx, 7xxxx 等) 默认使用 500
      default:
        status = 500;
    }
  } else if (err.message) {
    // 如果是一个普通的 Error 对象，就只用它的 message
    message = err.message;
  }

  ctx.status = status;
  ctx.body = {
    code: code,
    msg: message, // 统一使用 msg 字段
    data: null,
  };
};
