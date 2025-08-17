const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
// 引入天气服务
const weatherService = require('../service/weather.service');

const router = new Router({ prefix: '/weather' });

// 获取天气（当日+未来三天）
router.get('/all', auth, async (ctx) => {
  try {
    const { location } = ctx.state.user;
    const weatherData = await weatherService.getWeather(location);
    ctx.body = { code: 200, msg: '获取天气成功', result: weatherData };
  } catch (error) {
    ctx.body = { code: 500, msg: '获取天气失败', error: error.message };
  }
});

// 代理发送，获取穿衣建议
router.post('/clothing', auth, async (ctx) => {
  try {
    const { location } = ctx.state.user;
    const clothingSuggestion =
      await weatherService.getClothingSuggestion(location);
    ctx.body = {
      code: 200,
      msg: '获取穿衣建议成功',
      result: clothingSuggestion,
    };
  } catch (error) {
    ctx.body = { code: 500, msg: '获取穿衣建议失败', error: error.message };
  }
});

// 得修改user表中的位置信息，然后返回最新的位置信息，此处还未实现
router.post('/location', auth, async (ctx) => {
  try {
    // const { id } = ctx.state.user;
    // const { location } = ctx.request.body;
    // await userService.updateUser(id, { location });
    ctx.body = { code: 200, msg: '更新位置成功', result: '待实现' };
  } catch (error) {
    ctx.body = { code: 500, msg: '更新位置失败', error: error.message };
  }
});

module.exports = router;
