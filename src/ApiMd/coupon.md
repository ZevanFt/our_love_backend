# API 文档 - 卡券 (Coupons)

### 获取我的/TA的卡券列表

- **Method:** `GET`
- **Path:** `/coupons` 或 `/coupons/user/:userId`
- **Auth:** 需要登录认证
- **Success Response (200):**
  ```json
  {
    "code": 200,
    "msg": "获取优惠券列表成功",
    "data": [ ... ]
  }
  ```
- **Error Response:**
  ```json
  { "code": "30001", "msg": "查找卡券失败" }
  ```

### 发起核销（持券方）

- **Method:** `POST`
- **Path:** `/coupons/use`
- **Auth:** 需要登录认证
- **Body:**
  ```json
  {
    "card_id": "unique-card-id-string"
  }
  ```
- **Error Responses:**
  ```json
  { "code": "30001", "msg": "卡券不存在" }
  ```
  ```json
  { "code": "30002", "msg": "无权操作此卡券" }
  ```
  ```json
  { "code": "30003", "msg": "卡券状态异常，无法操作" }
  ```
  ```json
  { "code": "30004", "msg": "卡券已过期" }
  ```
  ```json
  { "code": "30005", "msg": "发起核销失败" }
  ```

### 确认核销（发行方）

- **Method:** `POST`
- **Path:** `/coupons/confirm`
- **Auth:** 需要登录认证
- **Body:**
  ```json
  {
    "card_id": "unique-card-id-string"
  }
  ```
- **Error Responses:**
  ```json
  { "code": "30001", "msg": "卡券不存在" }
  ```
  ```json
  { "code": "30002", "msg": "无权操作此卡券" }
  ```
  ```json
  { "code": "30003", "msg": "卡券状态异常，无法操作" }
  ```
  ```json
  { "code": "30006", "msg": "确认核销失败" }
  ```
