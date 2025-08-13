const { getCategoryModel } = require('../model/bookkeeping_category.model');
const { accessService } = require('../utils/console.utils');

/**
 * BookkeepingCategoryService 类，封装了与交易分类相关的数据库操作服务
 */
class BookkeepingCategoryService {
  /**
   * 创建新分类的异步方法
   * @param {object} categoryData - 分类数据
   * @param {string} categoryData.couple_link_id - 情侣关系ID
   * @param {string} categoryData.name - 分类名称
   * @param {string} categoryData.type - 分类类型 (INCOME/EXPENSE)
   * @param {string} [categoryData.icon] - 分类图标
   * @returns {Promise<object>} - 新创建分类的数据库记录数据
   */
  async createCategory({ couple_link_id, name, type, icon }) {
    accessService('createCategory');
    const Category = await getCategoryModel();
    const res = await Category.create({
      couple_link_id,
      name,
      type,
      icon,
    });
    return res.dataValues;
  }

  /**
   * 根据 couple_link_id 查询分类列表的异步方法
   * @param {string} couple_link_id - 情侣关系ID
   * @returns {Promise<Array<object>>} - 分类列表
   */
  async getCategoriesByCoupleId(couple_link_id) {
    accessService('getCategoriesByCoupleId');
    const Category = await getCategoryModel();
    const categories = await Category.findAll({
      where: { couple_link_id },
    });
    return categories.map((category) => category.dataValues);
  }

  /**
   * 根据ID查询单个分类的异步方法
   * @param {number} id - 分类ID
   * @returns {Promise<object|null>} - 分类数据或null
   */
  async getCategoryById(id) {
    accessService('getCategoryById');
    const Category = await getCategoryModel();
    const category = await Category.findByPk(id);
    return category ? category.dataValues : null;
  }

  /**
   * 更新分类信息的异步方法
   * @param {number} id - 分类ID
   * @param {object} updateData - 要更新的分类数据
   * @returns {Promise<Array<number>>} - 更新操作的结果
   */
  async updateCategory(id, updateData) {
    accessService('updateCategory');
    const Category = await getCategoryModel();
    const res = await Category.update(updateData, {
      where: { id },
    });
    return res;
  }

  /**
   * 删除分类的异步方法
   * @param {number} id - 分类ID
   * @returns {Promise<number>} - 删除操作的结果
   */
  async deleteCategory(id) {
    accessService('deleteCategory');
    const Category = await getCategoryModel();
    const res = await Category.destroy({
      where: { id },
    });
    return res;
  }
}

module.exports = new BookkeepingCategoryService();
