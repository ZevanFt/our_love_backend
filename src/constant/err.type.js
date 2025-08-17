module.exports = {
  // ================== 10000: 用户 & 认证相关错误 ==================
  userFormatError: { code: '10001', message: '用户名或密码为空' },
  userAlreadyExited: { code: '10002', message: '用户已存在' },
  userRegisterError: { code: '10003', message: '用户注册错误' },
  userDoesNotExist: { code: '10004', message: '用户不存在' },
  userLoginError: { code: '10005', message: '用户登录失败' },
  invalidPassword: { code: '10006', message: '密码不匹配' },
  tokenExpiredError: { code: '10101', message: 'token已过期' },
  invalidToken: { code: '10102', message: '无效的token' },
  hadNotAdminPermission: { code: '10103', message: '无管理员权限' },
  noCoupleRelationshipError: { code: '10104', message: '尚无情侣关系' },

  // ================== 20000: 商品模块相关错误 ==================
  fileUploadError: { code: '20001', message: '商品图片上传失败' },
  unSupportedFileType: { code: '20002', message: '不支持的文件格式' },
  productFormatError: { code: '20003', message: '商品参数格式错误' },
  productCreateError: { code: '20004', message: '发布商品失败' },
  invalidProductID: { code: '20005', message: '无效的商品ID' },
  productUpdateError: { code: '20006', message: '更新商品失败' },
  productRemoveError: { code: '20007', message: '下架商品失败' },
  productRestoreError: { code: '20008', message: '上架商品失败' },
  productFindError: { code: '20009', message: '查找商品失败' },
  exchangeError: {
    stockNotEnough: { code: '20101', message: '商品库存不足' },
    pointsNotEnough: { code: '20102', message: '用户积分不足' },
    notPartnerProduct: { code: '20103', message: '只能兑换对方发布的商品' },
    exchangeFailed: { code: '20104', message: '兑换失败' },
  },

  // ================== 30000: 卡券模块相关错误 ==================
  couponError: {
    notFound: { code: '30001', message: '卡券不存在' },
    permissionDenied: { code: '30002', message: '无权操作此卡券' },
    statusError: { code: '30003', message: '卡券状态异常，无法操作' },
    expired: { code: '30004', message: '卡券已过期' },
    useFailed: { code: '30005', message: '发起核销失败' },
    confirmFailed: { code: '30006', message: '确认核销失败' },
  },

  // ================== 40000: 任务模块相关错误 ==================
  taskError: {
    notFound: { code: '40001', message: '任务不存在' },
    permissionDenied: { code: '40002', message: '无权操作此任务' },
    statusError: { code: '40003', message: '任务状态异常，无法操作' },
    createFailed: { code: '40004', message: '创建任务失败' },
    updateFailed: { code: '40005', message: '更新任务失败' },
    deleteFailed: { code: '40006', message: '删除任务失败' },
    completeFailed: { code: '40007', message: '提交任务失败' },
    confirmFailed: { code: '40008', message: '确认任务失败' },
  },

  // ================== 50000: 积分模块相关错误 ==================
  pointError: {
    findError: { code: '50001', message: '查询积分记录失败' },
  },

  // ================== 60000: 通知模块相关错误 ==================
  notificationError: {
    findError: { code: '60001', message: '获取通知失败' },
    updateError: { code: '60002', message: '更新通知失败' },
  },

  // ================== 70000: 记账模块相关错误 ==================
  bookkeepingError: {
    accountCreateError: { code: '70101', message: '创建账户失败' },
    accountGetError: { code: '70102', message: '获取账户列表失败' },
    accountUpdateError: { code: '70103', message: '更新账户失败' },
    accountDeleteError: { code: '70104', message: '删除账户失败' },
    // ... 可以在此基础上扩展 category, transaction, financial_goal 的错误
  },

  // ================== 80000: 天气模块相关错误 ==================
  weatherGetFail: { code: '80001', message: '获取天气信息失败' },
  updateLocationFail: { code: '80002', message: '更新位置失败' },
  getClothingSuggestionFail: { code: '80003', message: '获取穿衣建议失败' },
};
