const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
const {
  getAssignedTasks,
  getCreatedTasks,
  createTask,
  updateTask,
  completeTask,
  confirmTask,
  deleteTask,
} = require('../controller/task.controller');

const router = new Router({ prefix: '/tasks' });

// 获取分配给我的任务
router.get('/assigned-to-me', auth, getAssignedTasks);

// 获取我发布的任务
router.get('/created-by-me', auth, getCreatedTasks);

// 发布任务
router.post('/', auth, createTask);

// 修改任务信息
router.put('/:id', auth, updateTask);

// 提交任务完成
router.put('/:id/complete', auth, completeTask);

// 确认任务完成
router.put('/:id/confirm', auth, confirmTask);

// 删除任务
router.delete('/:id', auth, deleteTask);

module.exports = router;
