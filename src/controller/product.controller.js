const productService = require('../service/product.service');
const {
  CREATE_SUCCESS,
  UPDATE_SUCCESS,
  SUCCESS,
  FETCH_SUCCESS,
} = require('../constant/succuss.type');
const {
  productCreateError,
  productUpdateError,
  productRemoveError,
  productRestoreError,
  productFindError,
  exchangeError,
} = require('../constant/err.type');

class ProductController {
  async create(ctx) {
    try {
      const { ...res } = await productService.createProduct(ctx.request.body);
      ctx.body = {
        ...CREATE_SUCCESS,
        result: res,
      };
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productCreateError, ctx);
    }
  }

  async update(ctx) {
    try {
      const { id } = ctx.params;
      const res = await productService.updateProduct(id, ctx.request.body);
      if (res) {
        ctx.body = {
          ...UPDATE_SUCCESS,
          result: '',
        };
      } else {
        return ctx.app.emit('error', productUpdateError, ctx);
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productUpdateError, ctx);
    }
  }

  async remove(ctx) {
    try {
      const { id } = ctx.params;
      const res = await productService.removeProduct(id);
      if (res) {
        ctx.body = {
          ...SUCCESS,
          msg: '下架商品成功',
          result: '',
        };
      } else {
        return ctx.app.emit('error', productRemoveError, ctx);
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productRemoveError, ctx);
    }
  }

  async restore(ctx) {
    try {
      const { id } = ctx.params;
      const res = await productService.restoreProduct(id);
      if (res) {
        ctx.body = {
          ...SUCCESS,
          msg: '上架商品成功',
          result: '',
        };
      } else {
        return ctx.app.emit('error', productRestoreError, ctx);
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productRestoreError, ctx);
    }
  }

  async findAll(ctx) {
    // 这个接口现在用于获取可兑换的商品，即对方发布的商品
    try {
      // 需要用户登录才能知道谁是对方
      const { mate_id: partnerId } = ctx.state.user;
      if (!partnerId) {
        return (ctx.body = {
          ...FETCH_SUCCESS,
          msg: '你还没有绑定的情侣，暂无可兑换商品',
          result: { total: 0, list: [] },
        });
      }
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const res = await productService.findProductsByUser(
        partnerId,
        pageNum,
        pageSize,
      );
      ctx.body = {
        ...FETCH_SUCCESS,
        msg: '获取可兑换的商品列表成功',
        result: res,
      };
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productFindError, ctx);
    }
  }

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const res = await productService.findProductById(id);
      if (res) {
        ctx.body = {
          ...FETCH_SUCCESS,
          msg: '获取商品信息成功',
          result: res,
        };
      } else {
        return ctx.app.emit('error', productFindError, ctx);
      }
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productFindError, ctx);
    }
  }

  async findMyProducts(ctx) {
    try {
      const { id: userId } = ctx.state.user;
      const { pageNum = 1, pageSize = 10 } = ctx.request.query;
      const res = await productService.findProductsByUser(
        userId,
        pageNum,
        pageSize,
      );
      ctx.body = {
        ...FETCH_SUCCESS,
        msg: '获取我发布的商品成功',
        result: res,
      };
    } catch (err) {
      console.error(err);
      return ctx.app.emit('error', productFindError, ctx);
    }
  }

  async exchangeProduct(ctx) {
    try {
      const { id: userId } = ctx.state.user;
      const { productId } = ctx.request.body;
      if (!productId) {
        // 简单参数校验
        return (ctx.body = {
          code: 10001,
          message: '商品ID不能为空',
          result: null,
        });
      }
      const res = await productService.exchangeProduct(userId, productId);
      ctx.body = {
        ...SUCCESS,
        msg: '兑换成功',
        result: res,
      };
    } catch (err) {
      console.error(err);
      // 根据错误信息匹配具体的错误类型
      switch (err.message) {
        case '商品库存不足':
          return ctx.app.emit('error', exchangeError.stockNotEnough, ctx);
        case '用户积分不足':
          return ctx.app.emit('error', exchangeError.pointsNotEnough, ctx);
        case '只能兑换对方发布的商品':
          return ctx.app.emit('error', exchangeError.notPartnerProduct, ctx);
        default:
          return ctx.app.emit('error', exchangeError.exchangeFailed, ctx);
      }
    }
  }
}

module.exports = new ProductController();
