# API 文档 - 商品 (Products)

### 获取可兑换的商品列表 (对方发布的商品)

- **Method:** `GET`
- **Path:** `/products`
- **Auth:** 需要登录认证
- **Query Params:**
  - `pageNum` (integer, optional): 页码, 默认 1.
  - `pageSize` (integer, optional): 每页数量, 默认 10.
- **Success Response (200):**
  ```json
  {
    "code": 200,
    "msg": "获取可兑换的商品列表成功",
    "result": { ... }
  }
  ```
- **Error Response:**
  ```json
  { "code": "20009", "msg": "查找商品失败" }
  ```

### 获取我发布的商品 (用于管理)

- **Method:** `GET`
- **Path:** `/products/me`
- **Auth:** 需要登录认证
- **Success Response (200):** (结构同上)

### 获取单个商品信息

- **Method:** `GET`
- **Path:** `/products/:id`
- **Auth:** 无需认证
- **URL Params:** `id` (integer, required): 商品ID.

### 发布商品

- **Method:** `POST`
- **Path:** `/products`
- **Auth:** 需要登录认证
- **Body:**
  ```json
  {
    "name": "新商品",
    "description": "这是描述",
    "points_cost": 150,
    "stock": 20
  }
  ```
- **Error Response:**
  ```json
  { "code": "20004", "msg": "发布商品失败" }
  ```

### 修改商品信息

- **Method:** `PUT`
- **Path:** `/products/:id`
- **Auth:** 需要登录认证
- **URL Params:** `id` (integer, required): 商品ID.
- **Error Response:**
  ```json
  { "code": "20006", "msg": "更新商品失败" }
  ```

### 下架/上架商品

- **Method:** `POST`
- **Path:** `/products/:id/off` 或 `/products/:id/on`
- **Auth:** 需要登录认证
- **URL Params:** `id` (integer, required): 商品ID.

### 兑换商品

- **Method:** `POST`
- **Path:** `/products/exchange`
- **Auth:** 需要登录认证
- **Body:**
  ```json
  {
    "productId": 1
  }
  ```
- **Success Response (200):** (返回新生成的优惠券信息)
- **Error Responses:**
  ```json
  { "code": "20101", "msg": "商品库存不足" }
  ```
  ```json
  { "code": "20102", "msg": "用户积分不足" }
  ```
  ```json
  { "code": "20103", "msg": "只能兑换对方发布的商品" }
  ```
  ```json
  { "code": "20104", "msg": "兑换失败" }
  ```
