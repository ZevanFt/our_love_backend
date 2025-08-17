const { fn, col } = require('sequelize');
const { getPointModel } = require('../model/point.model');
const { getUserModel } = require('../model/user.model');

class PointService {
  /**
   * 仅记录积分变更
   * @param {object} record - 积分记录
   */
  async createPointRecord(record) {
    const Point = await getPointModel();
    const { user_id, type, amount, description, related_id } = record;

    if (amount <= 0) {
      throw new Error('积分数量必须为正数');
    }

    const res = await Point.create({
      user_id,
      type,
      amount,
      description,
      related_id,
    });

    return res.dataValues;
  }

  /**
   * 动态计算用户的总积分
   * @param {number} user_id - 用户ID
   * @returns {Promise<number>} 用户当前的总积分
   */
  async calculateUserPoints(user_id) {
    // 获取 Point 模型实例，用于操作积分记录数据表
    const Point = await getPointModel();
    // 获取 User 模型实例，用于操作用户数据表
    const User = await getUserModel();

    // 查询指定用户的积分记录，按积分类型分组并计算每种类型的积分总和
    const result = await Point.findAll({
      where: { user_id }, // 筛选条件，只查询指定用户的积分记录
      attributes: [
        'type', // 选择积分类型字段
        [fn('SUM', col('amount')), 'total_amount'], // 计算每种类型积分的总和，并将结果命名为 total_amount
      ],
      group: ['type'], // 按积分类型分组
      raw: true, // 返回原始数据，提高性能
    });

    // 初始化用户总积分为 0
    let totalPoints = 0;
    // 遍历查询结果，根据积分类型累加或扣减总积分
    result.forEach((item) => {
      if (item.type === 'earn') {
        // 若积分类型为获得，则累加积分
        totalPoints += parseInt(item.total_amount, 10);
      } else if (item.type === 'spend') {
        // 若积分类型为消费，则扣减积分
        totalPoints -= parseInt(item.total_amount, 10);
      }
    });

    // 将计算出的总积分更新回用户表中的 point 字段
    await User.update({ point: totalPoints }, { where: { id: user_id } });

    // 返回用户当前的总积分
    return totalPoints;
  }

  /**
   * 查询用户的积分记录
   * @param {number} user_id - 用户ID
   * @param {number} pageNum - 页码
   * @param {number} pageSize - 每页数量
   */
  async findPointRecords(user_id, pageNum, pageSize) {
    const Point = await getPointModel();
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Point.findAndCountAll({
      where: { user_id },
      offset,
      limit: pageSize * 1,
      order: [['createdAt', 'DESC']],
    });

    return {
      total: count,
      list: rows,
    };
  }
}

module.exports = new PointService();
