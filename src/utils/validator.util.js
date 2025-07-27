// Desc: 验证器

// 引入错误信息
const ErrorMsg = require('../constant/err.type')


const validator = (rules, errMsg) => {
    return async (ctx, next) => {
        const errors = [];
        const params = ctx.request.body;
        console.log(errMsg, '校验器传入errMsg')

        for (const [field, rule] of Object.entries(rules)) {
            if (rule.required) {
                if (params[field] === '' || params[field] === undefined || params[field] === null) {
                    console.log(field, "校验器校验格式不满足要求")
                    // console.log(rule, params[field], field, 'field')
                    if (rule.default !== undefined) {
                        console.log(field, "规则默认值不是未定义")
                        // console.log('测试代码-前', params[field], field)
                        params[field] = rule.default;
                        ctx.request.body[field] = rule.default
                        console.log('测试代码-后', params[field], field, 'field')
                    } else {
                        errors.push({
                            message: 'should not be empty',
                            code: 'invalid',
                            field,
                        });
                    }
                }
            }
        }
        if (errors.length > 0) {
            return ctx.app.emit('error', errMsg, ctx);
        }
        // console.log(params, "params")
        console.log(ctx.request.body, 'ctx.request.body')
        try {
            ctx.verifyParams(rules)
            console.log('校验通过')
        } catch (err) {
            console.log('校验失败', err)
            return ctx.app.emit('error', errMsg, ctx)
        }
        await next()
    }
}

module.exports = {
    validator
}