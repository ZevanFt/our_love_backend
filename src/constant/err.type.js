// 10000 - 10099 用户相关错误
module.exports = {
  userFormatError: {
    code: '10001',
    message: '用户名或密码为空',
    result: '',
  },
  userAlreadyExited: {
    code: '10002',
    message: '用户已存在',
    result: '',
  },
  userRegisterError: {
    code: '10003',
    message: '用户注册错误',
    result: '',
  },
  userDoesNotExist: {
    code: '10004',
    message: '用户不存在',
    result: '',
  },
  userLoginError: {
    code: '10005',
    message: '用户登录失败',
    result: '',
  },
  invalidPassword: {
    code: '10006',
    message: '密码不匹配',
    result: '',
  },

  // 10100 - 10199 token相关错误
  tokenExpiredError: {
    code: '10101',
    message: 'token已过期',
    result: '',
  },
  invalidToken: {
    code: '10102',
    message: '无效的token',
    result: '',
  },
  hadNotAdminPermission: {
    code: '10103',
    message: '无管理员权限',
    result: '',
  },

  // 10200 - 10299 商品相关错误
  fileUploadError: {
    code: '10201',
    message: '商品图片上传失败',
    result: '',
  },
  unSupportedFileType: {
    code: '10202',
    message: '不支持的文件格式',
    result: '',
  },
  skusFormatError: {
    code: '10203',
    message: '商品参数格式错误',
    result: '',
  },
  publishSkusError: {
    code: '10204',
    message: '发布商品失败',
    result: '',
  },
  invalidSkusID: {
    code: '10205',
    message: '无效商品ID',
    result: '',
  },
  productCreateError: {
    code: '10206',
    message: '创建商品失败',
    result: '',
  },
  productUpdateError: {
    code: '10207',
    message: '更新商品失败',
    result: '',
  },
  productRemoveError: {
    code: '10208',
    message: '下架商品失败',
    result: '',
  },
  productRestoreError: {
    code: '10209',
    message: '上架商品失败',
    result: '',
  },
  productFindError: {
    code: '10210',
    message: '查找商品失败',
    result: '',
  },

  // 10300 - 10399 购物车相关错误
  cartFormatError: {
    code: '10301',
    message: '购物车格式错误',
    result: '',
  },

  // 10400 - 10499 地址相关错误
  addrFormatError: {
    code: '10401',
    message: '地址数据格式错误',
    result: '',
  },

  // 10500 - 10599 订单相关错误
  orderFormatError: {
    code: '10501',
    message: '订单数据格式错误',
    result: '',
  },

  // 10600 - 10699 品牌相关错误
  brandFormatError: {
    code: '10601',
    message: '品牌数据格式错误',
    result: '',
  },
  publishBrandError: {
    code: '10602',
    message: '发布品牌失败',
    result: '',
  },

  // 10700 - 10799 积分相关错误
  pointRecordCreateError: {
    code: '10701',
    message: '创建积分记录失败',
    result: '',
  },
  pointRecordFindError: {
    code: '10702',
    message: '查询积分记录失败',
    result: '',
  },
  productExchangeError: {
    code: '10703',
    message: '商品兑换失败',
    result: '',
  },

  // 10800 - 10899 记账相关错误
  bookkeepingAccountError: {
    createAccountError: {
      code: '10801',
      message: '创建账户失败',
      result: '',
    },
    getAllAccountsError: {
      code: '10802',
      message: '获取账户列表失败',
      result: '',
    },
    updateAccountError: {
      code: '10803',
      message: '更新账户失败',
      result: '',
    },
    deleteAccountError: {
      code: '10804',
      message: '删除账户失败',
      result: '',
    },
  },
};
