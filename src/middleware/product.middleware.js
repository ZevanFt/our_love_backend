const { productCreateError } = require('../constant/err.type')

const validator = (rules) => {
    return async (ctx, next) => {
        try {
            ctx.verifyParams(rules)
        } catch (err) {
            console.error(err)
            productCreateError.result = err.errors
            return ctx.app.emit('error', productCreateError, ctx)
        }
        await next()
    }
}

module.exports = {
    validator,
}
