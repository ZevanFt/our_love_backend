// 在你的 main.js 或 app.js 的顶部
// ... 其他 require ...
const { seq, initializeDatabase } = require('./db/seq.js'); // 修改这里的导入
const app = require('./app'); // 假设你的 Express app 在这里
const config = require('./config/config.default.js');

// 使用 async/await 来包装启动过程
const startServer = async () => {
  try {
    // 1. 首先执行数据库初始化检查
    await initializeDatabase();

    // 2. 数据库检查通过后，再测试主连接 (可选，因为 initializeDatabase 已保证连通性)
    await seq.authenticate();
    console.log('✅ 主数据库连接 (seq) 已成功认证！');

    // 3. 最后启动你的 Express 服务器
    const port = config.APP_PORT || 8100;
    app.listen(port, () => {
      console.log(`✅ 服务器已启动，运行在 http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 调用启动函数
startServer();
