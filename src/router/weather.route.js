const Router = require('koa-router');
// 引入中间件
const { verifyToken } = require('../middleware/auth.middleware');
// 引入天气服务
const { getAmapWeather, getAIClothingSuggestion, getAmapCityCode } = require('../service/weather.service');

const router = new Router({ prefix: '/weather' });

// 获取天气（当日+未来三天）
router.get('/all', verifyToken, async (ctx, next) => {
    try {
        const city = ctx.query.city || '110101'; // 默认北京
        const weatherData = await getAmapWeather('base', city);
        ctx.body = weatherData;
    } catch (error) {
        ctx.body = {
            code: 500,
            msg: '获取当日天气失败'
        };
    }
});

// 代理发送，获取穿衣建议
router.post('/clothing', verifyToken, async (ctx, next) => {
    try {
        const city = ctx.query.city || '110000'; // 默认北京
        const weatherresData = await getAmapWeather('base', city);
        console.log(weatherresData, 'weatherData');
        const weatherData = weatherresData.lives[0];

        // 构建 AI 提示模板
        const template = `
        基于当前的天气状况，为您提供以下穿衣建议：

        ### 基本天气信息
        - **城市**：${weatherData.city}
        - **天气状况**：${weatherData.weather}
        - **温度**：${weatherData.temperature}℃
        - **风力**：${weatherData.windpower}级
        - **湿度**：${weatherData.humidity}%

        ### 穿衣建议
        #### 上衣
        - **材质**：根据天气状况，建议选择{{top_material}}材质的衣物。
        - **款式**：推荐穿着{{top_style}}，以应对当前的天气。

        #### 下装
        - **材质**：{{bottom_material}}材质的下装会比较合适。
        - **款式**：建议选择{{bottom_style}}。

        #### 配饰
        - **帽子**：如果有必要，可以佩戴{{hat}}来保护头部。
        - **鞋子**：穿着{{shoes}}能让您行走更舒适。
        - **其他**：根据实际情况，还可以携带{{other_accessories}}。

        ### 温馨提示
        {{additional_tips}}
                `;
        console.log(template, 'template');
        const clothingSuggestion = await getAIClothingSuggestion(template);
        ctx.body = clothingSuggestion;
    } catch (error) {
        ctx.body = {
            code: 500,
            msg: '获取穿衣建议失败'
        };
    }
});

// 得修改user表中的位置信息，然后返回最新的位置信息，此处还未实现
router.post('/location', verifyToken, async (ctx, next) => {
    try {
        const geography = ctx.query.geography;
        console.log(geography, 'geography');
        const locationData = await getAmapCityCode(geography)
        console.log(locationData.addressComponent.adcode, 'locationData.addressComponent.adcode');
        ctx.body = locationData;
    } catch (error) {
        ctx.body = {
            code: 500,//
            msg: `更新个人位置失败:${error.message}`,
        };
    }
})

module.exports = router;