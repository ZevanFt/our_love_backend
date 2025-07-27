const { getProductModel } = require('../model/product.model')

class ProductService {
    async createProduct(product) {
        const Product = await getProductModel();
        const res = await Product.create(product)
        return res.dataValues
    }

    async updateProduct(id, product) {
        const Product = await getProductModel();
        const res = await Product.update(product, { where: { id } })
        return res[0] > 0
    }

    async removeProduct(id) {
        const Product = await getProductModel();
        const res = await Product.destroy({ where: { id } })
        return res > 0
    }

    async restoreProduct(id) {
        const Product = await getProductModel();
        const res = await Product.restore({ where: { id } })
        return res > 0
    }

    async findProducts(pageNum, pageSize, status) {
        const Product = await getProductModel();
        const whereOpt = {}
        if (status !== undefined) {
            whereOpt.status = status
        }

        const offset = (pageNum - 1) * pageSize
        const { count, rows } = await Product.findAndCountAll({
            offset,
            limit: pageSize * 1,
            where: whereOpt,
        })

        return {
            total: count,
            list: rows,
        }
    }

    async findProductById(id) {
        const Product = await getProductModel();
        const res = await Product.findByPk(id)
        return res ? res.dataValues : null
    }
}

module.exports = new ProductService()
