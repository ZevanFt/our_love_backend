// src/config/config.default.js

const path = require('path');

// 1. 自动加载项目根目录下的 .env 文件
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

/**
 * 导出一个经过精心组织的配置对象。
 * 这种方式清晰、安全，且易于维护。
 */
module.exports = {
  // 服务器配置
  APP_PORT: process.env.APP_PORT,
  NODE_ENV: process.env.NODE_ENV,

  // MySQL 数据库配置
  // 注意：这里我们使用了你 .env 文件中定义的确切变量名
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PWD: process.env.MYSQL_PWD,
  MYSQL_DB: process.env.MYSQL_DB,

  // JWT 配置
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,

  // 高德地图 API 配置
  AMAP_KEY: process.env.AMAP_KEY,
  AMAP_WEATHER_API_URL: process.env.AMAP_WEATHER_API_URL,
  AMAP_CITY_API_URL: process.env.AMAP_CITY_API_URL,

  // AI API 配置
  AI_API_URL: process.env.AI_API_URL,
  AI_API_KEY: process.env.AI_API_KEY,
};
