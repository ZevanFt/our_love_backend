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
      const address = amapInfo.formatted_address; // 从高德获取详细地址
      await userService.updateUser(
        { id },
        { location: geography, adcode, address },
      );
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
    console.log('开始获取伴侣当天天气...');
    try {
      const { mate_id } = ctx.state.user;
      if (!mate_id) {
        console.log('无伴侣关系，无法获取天气');
        return ctx.app.emit('error', noCoupleRelationshipError, ctx);
      }
      const partner = await userService.getUser({ id: mate_id });
      if (!partner || !partner.adcode) {
        console.log('伴侣未设置adcode:', partner);
        return ctx.app.emit(
          'error',
          { code: '80004', message: '对象未设置位置信息' },
          ctx,
        );
      }
      console.log(`获取到伴侣adcode: ${partner.adcode}，正在请求天气...`);
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
    console.log('开始获取伴侣地理位置...');
    try {
      const { mate_id } = ctx.state.user;
      if (!mate_id) {
        console.log('无伴侣关系，无法获取位置');
        return ctx.app.emit('error', noCoupleRelationshipError, ctx);
      }
      const partner = await userService.getUser({ id: mate_id });
      if (!partner || (!partner.location && !partner.address)) {
        console.log('伴侣未设置位置信息:', partner);
        return ctx.app.emit(
          'error',
          { code: '80004', message: '对象未设置位置信息' },
          ctx,
        );
      }

      let amapInfo;
      if (partner.address) {
        console.log('从数据库获取到伴侣地址:', partner.address);
        // 解析地址字符串以模拟高德API的addressComponent结构
        const address = partner.address;
        let remainingAddress = address;

        const provinceMatch = remainingAddress.match(/[^省]+省|[^市]+市/);
        const province = provinceMatch ? provinceMatch[0] : '';
        if (province) {
          remainingAddress = remainingAddress.replace(province, '');
        }

        const cityMatch = remainingAddress.match(/[^市]+市|[^州]+州/);
        const city = cityMatch ? cityMatch[0] : '';
        if (city) {
          remainingAddress = remainingAddress.replace(city, '');
        }

        const districtMatch =
          remainingAddress.match(/[^区]+区|[^县]+县|[^市]+市/);
        const district = districtMatch ? districtMatch[0] : '';
        if (district) {
          remainingAddress = remainingAddress.replace(district, '');
        }

        // 剩下的就是街道、路、号等信息
        // 提取更精确的街道信息，去掉具体的建筑物名称
        let street = remainingAddress;
        const streetMatch = remainingAddress.match(
          /(.*(?:路|街|道|巷|胡同|辅路|号))/,
        );
        if (streetMatch && streetMatch[1]) {
          street = streetMatch[1];
        }

        amapInfo = {
          formatted_address: address,
          addressComponent: {
            province: province || '--',
            city: city || '--',
            district: district || '--',
            township: '--', // 简单解析无法获取乡镇
            streetNumber: {
              street: street || '--',
              number: '--',
              location: '--',
              direction: '--',
              distance: '--',
            },
            adcode: partner.adcode,
            country: '中国',
            businessAreas: [],
            building: { name: [], type: [] },
            neighborhood: { name: [], type: [] },
            citycode: '--',
          },
        };
      } else if (partner.location) {
        // 兼容老数据，如果只有经纬度，则请求高德API
        console.log('数据库无地址，通过经纬度请求高德API:', partner.location);
        amapInfo = await getAmapCityCode(partner.location);
        console.log('从高德API获取到的地址信息:', amapInfo);
      }

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
