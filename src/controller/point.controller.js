const pointService = require('../service/point.service')
const productService = require('../service/product.service')
const {
    pointRecordFindError,
    productExchangeError,
} = require('../constant/err.type')
const seq = require('../db/seq')

class PointController {
    async exchangeProduct(ctx) {
        const t = await seq.transaction()
        try {
            const user_id = ctx.state.user.id
            const { product_id } = ctx.request.body

            // 1. 检查商品是否存在且已上架
            const product = await productService.findProductById(product_id)
            if (!product || !product.status) {
                return ctx.app.emit('error', { ...productExchangeError, message: '商品不存在或已下架' }, ctx)
            }

            // 2. 检查库存
            if (product.stock <= 0) {
                return ctx.app.emit('error', { ...productExchangeError, message: '商品库存不足' }, ctx)
            }

            // 3. 检查用户积分是否足够
            const userPoints = await pointService.calculateUserPoints(user_id)
            if (userPoints < product.points_cost) {
                return ctx.app.emit('error', { ...productExchangeError, message: '用户积分不足' }, ctx)
            }

            // 4. 创建消费记录
            await pointService.createPointRecord(
                {
                    user_id,
                    type: 'spend',
                    amount: product.points_cost,
                    description: `兑换商品: ${product.name}`,
                    related_id: product.id,
                },
                { transaction: t }
            )

            // 5. 扣减商品库存
            await productService.updateProduct(product_id, { stock: product.stock - 1 }, { transaction: t })

            await t.commit()

            ctx.body = {
                code: 0,
                message: '商品兑换成功',
                result: '',
            }
        } catch (err) {
            await t.rollback()
            console.error(err)
            return ctx.app.emit('error', productExchangeError, ctx)
        }
    }

    async findRecords(ctx) {
        try {
            const user_id = ctx.state.user.id
            const { pageNum = 1, pageSize = 10 } = ctx.request.query
            const res = await pointService.findPointRecords(user_id, pageNum, pageSize)
            ctx.body = {
                code: 0,
                message: '获取积分记录成功',
                result: res,
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', pointRecordFindError, ctx)
        }
    }

    async getUserPoints(ctx) {
        try {
            const user_id = ctx.state.user.id
            const points = await pointService.calculateUserPoints(user_id)
            ctx.body = {
                code: 0,
                message: '获取用户积分成功',
                result: {
                    points,
                },
            }
        } catch (err) {
            console.error(err)
            return ctx.app.emit('error', { code: '10704', message: '获取用户积分失败' }, ctx)
        }
    }
}

module.exports = new PointController()
