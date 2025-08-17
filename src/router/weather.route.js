const Router = require('@koa/router');
const { auth } = require('../middleware/auth.middleware');
const weatherController = require('../controller/weather.controller');

const router = new Router({ prefix: '/weather' });

// 获取自己的当天天气
router.get('/today', auth, weatherController.getTodayWeather);

// 获取自己的预报天气
router.get('/foresee', auth, weatherController.getForeseeWeather);

// 更新自己的位置信息
router.post('/location', auth, weatherController.updateUserLocation);

// 获取对象当天天气
router.get('/today/partner', auth, weatherController.getPartnerTodayWeather);

// 获取对象预报天气
router.get(
  '/foresee/partner',
  auth,
  weatherController.getPartnerForeseeWeather,
);

// 获取对象地理位置信息
router.get('/location/partner', auth, weatherController.getPartnerLocation);

// 获取穿衣建议
router.post('/clothing', auth, weatherController.getClothingSuggestion);

module.exports = router;
