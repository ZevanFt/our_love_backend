const taskService = require('../service/task.service');
const {
  FETCH_SUCCESS,
  CREATE_SUCCESS,
  UPDATE_SUCCESS,
  SUCCESS,
  DELETE_SUCCESS,
} = require('../constant/succuss.type');
const {
  taskError,
  noCoupleRelationshipError,
} = require('../constant/err.type');

class TaskController {
  async getAssignedTasks(ctx) {
    try {
      const { id: assignee_id } = ctx.state.user;
      const tasks = await taskService.findTasks({ assignee_id });
      ctx.body = {
        ...FETCH_SUCCESS,
        msg: '获取分配给我的任务成功',
        result: tasks,
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.findError, ctx);
    }
  }

  async getCreatedTasks(ctx) {
    try {
      const { id: publisher_id } = ctx.state.user;
      const tasks = await taskService.findTasks({ publisher_id });
      ctx.body = {
        ...FETCH_SUCCESS,
        msg: '获取我发布的任务成功',
        result: tasks,
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.findError, ctx);
    }
  }

  async createTask(ctx) {
    try {
      const { id: publisher_id, couple_link_id, mate_id } = ctx.state.user;
      if (!mate_id) {
        return ctx.app.emit('error', noCoupleRelationshipError, ctx);
      }
      const assignee_id = mate_id;
      const taskData = {
        ...ctx.request.body,
        publisher_id,
        couple_link_id,
        assignee_id,
      };
      const res = await taskService.createTask(taskData);
      ctx.body = { ...CREATE_SUCCESS, result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.createFailed, ctx);
    }
  }

  async updateTask(ctx) {
    try {
      const { id: taskId } = ctx.params;
      const { id: userId } = ctx.state.user;
      const res = await taskService.updateTask(
        taskId,
        ctx.request.body,
        userId,
      );
      ctx.body = { ...UPDATE_SUCCESS, result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.updateFailed, ctx);
    }
  }

  async completeTask(ctx) {
    try {
      const { id: taskId } = ctx.params;
      const { id: userId } = ctx.state.user;
      const res = await taskService.completeTask(taskId, userId);
      ctx.body = { ...SUCCESS, msg: '提交任务完成成功', result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.completeFailed, ctx);
    }
  }

  async confirmTask(ctx) {
    try {
      const { id: taskId } = ctx.params;
      const { id: userId } = ctx.state.user;
      const res = await taskService.confirmTask(taskId, userId);
      ctx.body = { ...SUCCESS, msg: '确认任务完成成功', result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.confirmFailed, ctx);
    }
  }

  async deleteTask(ctx) {
    try {
      const { id: taskId } = ctx.params;
      const { id: userId } = ctx.state.user;
      const res = await taskService.deleteTask(taskId, userId);
      ctx.body = { ...DELETE_SUCCESS, result: res };
    } catch (err) {
      console.error(err);
      ctx.app.emit('error', taskError.deleteFailed, ctx);
    }
  }
}

module.exports = new TaskController();
