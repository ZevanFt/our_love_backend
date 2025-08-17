const { getTaskModel } = require('../model/task.model');
const { getUserModel } = require('../model/user.model');
const { getPointModel } = require('../model/point.model');
const { seq } = require('../db/seq');

class TaskService {
  async createTask(taskData) {
    const Task = await getTaskModel();
    const res = await Task.create(taskData);
    return res.dataValues;
  }

  async findTasks(where) {
    const Task = await getTaskModel();
    return await Task.findAll({ where });
  }

  async updateTask(taskId, updateData, userId) {
    const Task = await getTaskModel();
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('任务不存在');
    if (task.publisher_id !== userId) throw new Error('无权修改此任务');

    const res = await task.update(updateData);
    return res.dataValues;
  }

  async completeTask(taskId, userId) {
    const Task = await getTaskModel();
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('任务不存在');
    if (task.assignee_id !== userId) throw new Error('你不是此任务的执行人');
    if (task.status !== 'pending') throw new Error('任务当前状态无法提交完成');

    const res = await task.update({ status: 'completed' });
    return res.dataValues;
  }

  async confirmTask(taskId, userId) {
    const t = await seq.transaction();
    try {
      const Task = await getTaskModel();
      const User = await getUserModel();
      const Point = await getPointModel();

      const task = await Task.findByPk(taskId, { transaction: t });
      if (!task) throw new Error('任务不存在');
      if (task.publisher_id !== userId)
        throw new Error('你不是此任务的发布者，无权确认');
      if (task.status !== 'completed')
        throw new Error('任务尚未完成，无法确认');

      // 更新任务状态
      const updatedTask = await task.update(
        { status: 'confirmed' },
        { transaction: t },
      );

      // 为执行人增加积分
      const assignee = await User.findByPk(task.assignee_id, {
        transaction: t,
      });
      await assignee.increment('points', {
        by: task.points_reward,
        transaction: t,
      });

      // 创建积分获取记录
      await Point.create(
        {
          user_id: task.assignee_id,
          type: 'earn',
          amount: task.points_reward,
          description: `完成任务: ${task.title}`,
          related_id: taskId,
        },
        { transaction: t },
      );

      await t.commit();
      return updatedTask.dataValues;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async deleteTask(taskId, userId) {
    const Task = await getTaskModel();
    const task = await Task.findByPk(taskId);
    if (!task) throw new Error('任务不存在');
    if (task.publisher_id !== userId) throw new Error('无权删除此任务');

    const res = await task.destroy();
    return res;
  }
}

module.exports = new TaskService();
