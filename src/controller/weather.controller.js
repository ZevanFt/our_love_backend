const {
  getAmapWeather,
  getAmapCityCode,
  getClothingSuggestion,
} = require('../service/weather.service');
const userService = require('../service/user.service');
const {
  weatherGetSuccess,
  updateLocationSuccess,
  getLocationSuccess,
  getClothingSuggestionSuccess,
} = require('../constant/succuss.type');
const {
  weatherGetFail,
  updateLocationFail,
  noCoupleRelationshipError,
  getClothingSuggestionFail,
} = require('../constant/err.type');

class WeatherController {
  // 获取自己的当天天气
  async getTodayWeather(ctx) {
    try {
      const { adcode } = ctx.query;
      if (!adcode) {
        return ctx.app.emit(
          'error',
          { code: 400, msg: 'adcode参数不能为空' },
          ctx,
        );
      }
      const weatherData = await getAmapWeather('all', adcode);
      if (
        !weatherData ||
        !weatherData.forecasts ||
        weatherData.forecasts.length === 0 ||
        !weatherData.forecasts[0].casts ||
        weatherData.forecasts[0].casts.length === 0
      ) {
        return ctx.app.emit('error', weatherGetFail, ctx);
      }
      const result = { ...weatherGetSuccess };
      const todayWeather = weatherData.forecasts[0].casts[0];
      todayWeather.weather_icon = 'weather-unknown';
      result.result = todayWeather;
      ctx.body = result;
    } catch (error) {
      console.error('获取当天天气失败', error);
      ctx.app.emit('error', weatherGetFail, ctx);
    }
  }

  // 获取自己的预报天气
  async getForeseeWeather(ctx) {
    try {
      const { geography } = ctx.query;
      if (!geography) {
        return ctx.app.emit(
          'error',
          { code: 400, msg: 'geography参数不能为空' },
          ctx,
        );
      }
      const cityInfo = await getAmapCityCode(geography);
      const adcode = cityInfo.addressComponent.adcode;
      const weatherData = await getAmapWeather('all', adcode);
      const result = { ...weatherGetSuccess };
      const forecast = weatherData.forecasts[0];
      if (forecast && forecast.casts) {
        forecast.casts.forEach((cast) => {
          cast.weather_icon = 'weather-unknown';
        });
      }
      result.result = forecast;
      ctx.body = result;
    } catch (error) {
      console.error('获取预报天气失败', error);
      ctx.app.emit('error', weatherGetFail, ctx);
    }
  }

  // 更新自己的位置
  async updateUserLocation(ctx) {
    try {
      const { id } = ctx.state.user;
      const { geography } = ctx.request.query;
      if (!geography) {
        return ctx.app.emit(
          'error',
          { code: 400, msg: 'geography参数不能为空' },
          ctx,
        );
      }
      const amapInfo = await getAmapCityCode(geography);
      const adcode = amapInfo.addressComponent.adcode;
      await userService.updateUser({ id }, { location: geography, adcode });
      const result = { ...updateLocationSuccess };
      result.result = amapInfo;
      ctx.body = result;
    } catch (error) {
      console.error('更新位置失败:', error);
      ctx.app.emit('error', updateLocationFail, ctx);
    }
  }

  // 获取对象当天天气
  async getPartnerTodayWeather(ctx) {
    try {
      const { mate_id } = ctx.state.user;
      if (!mate_id) {
        return ctx.app.emit('error', noCoupleRelationshipError, ctx);
      }
      const partner = await userService.getUser({ id: mate_id });
      if (!partner || !partner.adcode) {
        return ctx.app.emit(
          'error',
          { code: '80004', message: '对象未设置位置信息' },
          ctx,
        );
      }
      const weatherData = await getAmapWeather('all', partner.adcode);
      if (
        !weatherData ||
        !weatherData.forecasts ||
        weatherData.forecasts.length === 0 ||
        !weatherData.forecasts[0].casts ||
        weatherData.forecasts[0].casts.length === 0
      ) {
        return ctx.app.emit('error', weatherGetFail, ctx);
      }
      const result = { ...weatherGetSuccess };
      const todayWeather = weatherData.forecasts[0].casts[0];
      todayWeather.weather_icon = 'weather-unknown';
      result.result = todayWeather;
      ctx.body = result;
    } catch (error) {
      console.error('获取对象当天天气失败', error);
      ctx.app.emit('error', weatherGetFail, ctx);
    }
  }

  // 获取对象预报天气
  async getPartnerForeseeWeather(ctx) {
    try {
      const { mate_id } = ctx.state.user;
      if (!mate_id) {
        return ctx.app.emit('error', noCoupleRelationshipError, ctx);
      }
      const partner = await userService.getUser({ id: mate_id });
      if (!partner || !partner.location) {
        return ctx.app.emit(
          'error',
          { code: '80004', message: '对象未设置位置信息' },
          ctx,
        );
      }
      const cityInfo = await getAmapCityCode(partner.location);
      const adcode = cityInfo.addressComponent.adcode;
      const weatherData = await getAmapWeather('all', adcode);
      const result = { ...weatherGetSuccess };
      const forecast = weatherData.forecasts[0];
      if (forecast && forecast.casts) {
        forecast.casts.forEach((cast) => {
          cast.weather_icon = 'weather-unknown';
        });
      }
      result.result = forecast;
      ctx.body = result;
    } catch (error) {
      console.error('获取对象预报天气失败', error);
      ctx.app.emit('error', weatherGetFail, ctx);
    }
  }

  // 获取对象地理位置信息
  async getPartnerLocation(ctx) {
    try {
      const { mate_id } = ctx.state.user;
      if (!mate_id) {
        return ctx.app.emit('error', noCoupleRelationshipError, ctx);
      }
      const partner = await userService.getUser({ id: mate_id });
      if (!partner || !partner.location) {
        return ctx.app.emit(
          'error',
          { code: '80004', message: '对象未设置位置信息' },
          ctx,
        );
      }
      const amapInfo = await getAmapCityCode(partner.location);
      const result = { ...getLocationSuccess };
      result.result = amapInfo;
      ctx.body = result;
    } catch (error) {
      console.error('获取对象位置信息失败', error);
      ctx.app.emit(
        'error',
        { code: '80005', message: '获取对象位置信息失败' },
        ctx,
      );
    }
  }

  // 获取穿衣建议
  async getClothingSuggestion(ctx) {
    try {
      const { location } = ctx.request.query;
      if (!location) {
        return ctx.app.emit(
          'error',
          { code: 400, msg: '位置信息不能为空' },
          ctx,
        );
      }
      const suggestion = await getClothingSuggestion(location);
      const result = { ...getClothingSuggestionSuccess };
      result.result = suggestion;
      ctx.body = result;
    } catch (error) {
      console.error('获取穿衣建议失败', error);
      ctx.app.emit('error', getClothingSuggestionFail, ctx);
    }
  }
}

module.exports = new WeatherController();
