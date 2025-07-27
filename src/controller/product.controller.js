const productService = require('../service/product.service')
const {
    productCreateError,
    productUpdateError,
    productRemoveError,
    productRestoreError,
    productFindError,
} = require('../constant/err.type')

class ProductController {
    async create(ctx) {
        try {
            const { ...res } = await productService.createProduct(ctx.request.body)
            ctx.body = {
                code: 0,
                message: '创建商品成功',
                result: res,
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', productCreateError, ctx)
        }
    }

    async update(ctx) {
        try {
            const { id } = ctx.params
            const res = await productService.updateProduct(id, ctx.request.body)
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '更新商品成功',
                    result: '',
                }
            } else {
                return ctx.app.emit('error', productUpdateError, ctx)
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', productUpdateError, ctx)
        }
    }

    async remove(ctx) {
        try {
            const { id } = ctx.params
            const res = await productService.removeProduct(id)
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '下架商品成功',
                    result: '',
                }
            } else {
                return ctx.app.emit('error', productRemoveError, ctx)
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', productRemoveError, ctx)
        }
    }

    async restore(ctx) {
        try {
            const { id } = ctx.params
            const res = await productService.restoreProduct(id)
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '上架商品成功',
                    result: '',
                }
            } else {
                return ctx.app.emit('error', productRestoreError, ctx)
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', productRestoreError, ctx)
        }
    }

    async findAll(ctx) {
        try {
            const { pageNum = 1, pageSize = 10, status } = ctx.request.query
            const res = await productService.findProducts(pageNum, pageSize, status)
            ctx.body = {
                code: 0,
                message: '获取商品列表成功',
                result: res,
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', productFindError, ctx)
        }
    }

    async findOne(ctx) {
        try {
            const { id } = ctx.params
            const res = await productService.findProductById(id)
            if (res) {
                ctx.body = {
                    code: 0,
                    message: '获取商品信息成功',
                    result: res,
                }
            } else {
                return ctx.app.emit('error', productFindError, ctx)
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', productFindError, ctx)
        }
    }
}

module.exports = new ProductController()
