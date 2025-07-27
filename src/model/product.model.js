const { DataTypes } = require('sequelize')
const initSeq = require('../db/seq')

let ProductModel;

const initializeProductModel = async () => {
    try {
        const seq = await initSeq; // 正确地从异步函数获取seq实例
        ProductModel = seq.define(
            'lovedb_product',
            {
                name: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    comment: '商品名称',
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                    comment: '商品描述',
                },
                image: {
                    type: DataTypes.STRING,
                    allowNull: true,
                    comment: '商品图片',
                },
                points_cost: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    comment: '兑换所需积分',
                },
                stock: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                    comment: '商品库存',
                },
                status: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                    defaultValue: true,
                    comment: '商品状态（true: 上架, false: 下架）',
                },
            },
            {
                tableName: 'lovedb_product',
                comment: '商品表',
                timestamps: true,
                paranoid: true,
            }
        )
        await ProductModel.sync();
        console.log('商品-数据库表结构已更新');
        return ProductModel;
    } catch (error) {
        console.error('初始化 Product 模型失败:', error);
        throw error;
    }
};

const getProductModel = async () => {
    if (!ProductModel) {
        await initializeProductModel();
    }
    return ProductModel;
};

module.exports = {
    getProductModel
};
