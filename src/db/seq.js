// src/db/seq.js

const { Sequelize } = require('sequelize');
// 完整导入配置对象，而不是解构，这样更清晰
const config = require('../config/config.default');

// 1. 从我们标准化的配置文件中获取所有需要的变量
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = config;

// 2. 创建一个主 Sequelize 实例。
// 这是我们将要导出的唯一实例，它包含了所有正确的配置。
const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT, // 确保端口被正确配置
  dialect: 'mysql',
  logging: false, // 在生产环境中可以关闭日志，或根据需要开启 console.log
  pool: {
    // 增加连接池配置，提高性能
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * 一个独立的、一次性的函数，用于检查并创建数据库。
 * 它会在应用启动时被调用。
 */
const initializeDatabase = async () => {
  // 创建一个临时的、不带数据库名的连接
  const tempSeq = new Sequelize('', MYSQL_USER, MYSQL_PWD, {
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: 'mysql',
    logging: false,
  });

  try {
    // 检查连接
    await tempSeq.authenticate();
    console.log('✅ 数据库服务器连接成功，准备检查数据库是否存在...');

    // 创建数据库 (如果不存在)
    await tempSeq.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DB}\`;`);
    console.log(`✅ 数据库 '${MYSQL_DB}' 已存在或创建成功。`);
  } catch (error) {
    // 如果是权限错误，直接抛出，因为后续操作都无法进行
    if (error.name === 'SequelizeAccessDeniedError') {
      console.error(`❌ 数据库权限验证失败: ${error.message}`);
      console.error(
        '👉 请检查 .env 文件中的 MYSQL_USER 和 MYSQL_PWD 是否正确。',
      );
      process.exit(1); // 权限错误是致命的，直接退出进程
    }
    // 其他错误
    console.error(`❌ 连接数据库服务器或创建数据库时出错: ${error.message}`);
    process.exit(1); // 同样退出
  } finally {
    // 无论成功与否，都关闭这个临时连接
    await tempSeq.close();
  }
};

// 3. 直接导出主实例 seq
// 让初始化逻辑和实例本身分离
module.exports = {
  seq,
  initializeDatabase,
};
