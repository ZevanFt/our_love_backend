const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PWD, MYSQL_DB } = require('../config/config.default');

// 先创建一个不指定数据库的 Sequelize 实例
const tempSeq = new Sequelize({
    username: MYSQL_USER,
    password: MYSQL_PWD,
    host: MYSQL_HOST,
    port: MYSQL_PORT,
    dialect: 'mysql'
});

// 尝试创建数据库
async function createDatabaseIfNotExists() {
    try {
        await tempSeq.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DB}`);
        console.log(`✅ 数据库 ${MYSQL_DB} 创建成功`);
    } catch (error) {
        console.error(`❌ 创建数据库 ${MYSQL_DB} 失败:`, error);
    } finally {
        await tempSeq.close();
    }
}

// 创建一个 Promise 来处理 seq 实例的初始化
const initSeq = new Promise(async (resolve, reject) => {
    try {
        await createDatabaseIfNotExists();
        // 创建指定数据库的 Sequelize 实例
        const seq = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
            host: MYSQL_HOST,
            dialect: 'mysql'
        });

        // 测试是否连接
        await seq.authenticate();
        console.log('✅ MySQL 数据库连接成功');
        resolve(seq);
    } catch (err) {
        console.log('❌ MySQL 连接失败:', err);
        reject(err);
    }
});

module.exports = initSeq;