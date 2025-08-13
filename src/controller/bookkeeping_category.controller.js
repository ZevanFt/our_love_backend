const categoryService = require('../service/bookkeeping_category.service');
const { bookkeepingCategoryError } = require('../constant/err.type');

class BookkeepingCategoryController {
  // 创建分类
  async createCategory(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const { category_name, category_type } = ctx.request.body;
      const res = await categoryService.createCategory({
        user_id,
        category_name,
        category_type,
      });
      ctx.body = {
        code: 0,
        message: '创建分类成功',
        result: res,
      };
    } catch (err) {
      console.error('创建分类失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingCategoryError.createCategoryError,
        ctx,
      );
    }
  }

  // 获取所有分类
  async getAllCategories(ctx) {
    try {
      const { user_id } = ctx.state.user;
      const res = await categoryService.getAllCategories(user_id);
      ctx.body = {
        code: 0,
        message: '获取分类列表成功',
        result: res,
      };
    } catch (err) {
      console.error('获取分类列表失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingCategoryError.getAllCategoriesError,
        ctx,
      );
    }
  }

  // 更新分类
  async updateCategory(ctx) {
    try {
      const { id } = ctx.params;
      const { category_name, category_type } = ctx.request.body;
      const res = await categoryService.updateCategory(id, {
        category_name,
        category_type,
      });
      if (res) {
        ctx.body = {
          code: 0,
          message: '更新分类成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingCategoryError.updateCategoryError,
          ctx,
        );
      }
    } catch (err) {
      console.error('更新分类失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingCategoryError.updateCategoryError,
        ctx,
      );
    }
  }

  // 删除分类
  async deleteCategory(ctx) {
    try {
      const { id } = ctx.params;
      const res = await categoryService.deleteCategory(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: '删除分类成功',
          result: '',
        };
      } else {
        return ctx.app.emit(
          'error',
          bookkeepingCategoryError.deleteCategoryError,
          ctx,
        );
      }
    } catch (err) {
      console.error('删除分类失败', err);
      return ctx.app.emit(
        'error',
        bookkeepingCategoryError.deleteCategoryError,
        ctx,
      );
    }
  }
}

module.exports = new BookkeepingCategoryController();
