const axios = require('axios');
const {
  AI_API_KEY,
  AI_API_URL,
  AMAP_KEY,
  AMAP_WEATHER_API_URL,
  AMAP_CITY_API_URL,
} = require('../config/config.default');
const { accessService } = require('../utils/console.utils');

const getAmapCityCode = async (location) => {
  accessService('getAmapCityCode');
  // 获取高德地图API密钥
  const amapKey = AMAP_KEY;
  // 获取高德地图城市编码API请求URL
  const amapApiUrl = AMAP_CITY_API_URL;

  // 构建高德地图城市编码API请求URL
  const apiUrl = `${amapApiUrl}?location=${location}&output=JSON&key=${amapKey}`;
  console.log(apiUrl, 'apiUrl');
  try {
    // 发送GET请求获取城市编码数据
    const response = await axios.get(apiUrl);
    // 返回城市编码数据
    if (response.status === 200) {
      console.log('获取高德地图城市编码成功');
      return response.data.regeocode;
    } else {
      console.log('获取高德地图城市编码失败');
      return null;
    }
  } catch (error) {
    // 打印错误信息
    console.error('获取高德地图城市编码失败:', error);
    // 抛出错误
    throw error;
  }
};

// 获取高德地图天气数据
const getAmapWeather = async (type, city) => {
  // 获取高德地图API密钥
  const amapKey = AMAP_KEY;
  // 获取高德地图天气API请求URL
  const amapApiUrl = AMAP_WEATHER_API_URL;

  // 构建高德地图天气API请求URL
  const apiUrl = `${amapApiUrl}?key=${amapKey}&city=${city}&extensions=${type}`;

  try {
    // 发送GET请求获取天气数据
    const response = await axios.get(apiUrl);
    // 返回天气数据
    return response.data;
  } catch (error) {
    // 打印错误信息
    console.error('获取高德地图天气数据失败:', error);
    // 抛出错误
    throw error;
  }
};

// 获取 AI 穿衣建议
/**
 * 获取AI穿衣建议
 *
 * 该函数使用 OpenAI 兼容的 API 来获取基于用户输入模板的穿衣建议。
 * 它会向指定的 AI API 发送 POST 请求，并处理返回的响应。
 *
 * @param {string} template - 用户输入的模板，用于向 AI 描述需求，以获取穿衣建议。
 * @returns {Promise<string>} - 一个 Promise，解析为 AI 提供的穿衣建议字符串。
 * @throws {Error} - 如果获取建议失败或未获取到有效的 AI 响应，将抛出错误。
 */
const getAIClothingSuggestion = async (template) => {
  accessService('getAIClothingSuggestion');
  // 从环境变量中获取 AI API 的请求 URL
  const aiApiUrl = AI_API_URL;
  // 从环境变量中获取 AI API 的密钥
  const aiApiKey = AI_API_KEY;

  // 构造 OpenAI 兼容格式的请求体
  const requestBody = {
    // 选择合适的模型，可根据实际情况调整
    model: 'Qwen/Qwen-8B',
    messages: [
      {
        // 指定消息发送者的角色为用户
        role: 'user',
        // 将用户输入的模板作为消息内容
        content: template,
      },
    ],
  };

  try {
    // 发送 POST 请求到 AI API，携带请求体和请求头
    const response = await axios.post(aiApiUrl, requestBody, {
      headers: {
        // 使用 Bearer 认证方式，将 API 密钥添加到请求头
        Authorization: `Bearer ${aiApiKey}`,
        // 指定请求体的内容类型为 JSON
        'Content-Type': 'application/json',
      },
    });

    // 解析 OpenAI 兼容格式的响应
    // 检查响应数据中是否存在 choices 数组，并且数组长度大于 0
    if (response.data.choices && response.data.choices.length > 0) {
      // 返回第一个选择项中的消息内容，即 AI 提供的穿衣建议
      return response.data.choices[0].message.content;
    } else {
      // 若未获取到有效的 AI 响应，抛出错误
      throw new Error('未获取到有效的 AI 响应');
    }
  } catch (error) {
    // 打印获取 AI 穿衣建议失败的错误信息
    console.error('获取 AI 穿衣建议失败:', error);
    // 重新抛出错误，以便调用者处理
    throw error;
  }
};

const getWeather = async (location) => {
  accessService('getWeather');
  try {
    // 1. 根据经纬度获取城市编码
    const cityInfo = await getAmapCityCode(location);
    const adcode = cityInfo.addressComponent.adcode;
    // 2. 根据城市编码获取天气数据
    const weatherData = await getAmapWeather('all', adcode);
    return weatherData;
  } catch (error) {
    console.error('获取天气数据失败:', error);
    throw error;
  }
};

const getClothingSuggestion = async (location) => {
  accessService('getClothingSuggestion');
  try {
    // 1. 根据经纬度获取城市编码
    const cityInfo = await getAmapCityCode(location);
    const adcode = cityInfo.addressComponent.adcode;
    const city =
      Array.isArray(cityInfo.addressComponent.city) &&
      cityInfo.addressComponent.city.length === 0
        ? cityInfo.addressComponent.district
        : cityInfo.addressComponent.city;
    // 2. 根据城市编码获取实时天气数据
    const weatherData = await getAmapWeather('base', adcode);
    const liveWeather = weatherData.lives[0];
    // 3. 构造 AI 穿衣建议模板
    const template = `
      城市：${city}
      天气：${liveWeather.weather}
      温度：${liveWeather.temperature}°C
      湿度：${liveWeather.humidity}%
      风向：${liveWeather.winddirection}
      风力：${liveWeather.windpower}级
      请根据以上天气信息，为我提供一份详细的今日穿衣建议。
    `;
    // 4. 获取 AI 穿衣建议
    const suggestion = await getAIClothingSuggestion(template);
    return suggestion;
  } catch (error) {
    console.error('获取穿衣建议失败:', error);
    throw error;
  }
};

module.exports = {
  getWeather,
  getClothingSuggestion,
  getAmapWeather,
  getAIClothingSuggestion,
  getAmapCityCode,
};
