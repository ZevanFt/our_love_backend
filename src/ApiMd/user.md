# 用户模块 API 文档

## 1. 用户注册

- **URL**: `/user/register`
- **Method**: `POST`
- **Description**: 创建一个新用户账户。
- **Request Body**:
  ```json
  {
    "yier_number": "your_account_id",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "code": "0",
    "message": "用户注册成功",
    "result": {
      "id": 1,
      "yier_number": "your_account_id"
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "code": 400,
    "msg": "账号、密码不能为空"
  }
  ```
  ```json
  {
    "code": 10002,
    "message": "用户已存在",
    "result": ""
  }
  ```

## 2. 用户登录

- **URL**: `/user/login`
- **Method**: `POST`
- **Description**: 用户登录以获取认证令牌。
- **Request Body**:
  ```json
  {
    "yier_number": "your_account_id",
    "password": "password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "code": 0,
    "message": "用户登录成功",
    "result": {
      "token": "jwt_token",
      "user": {
        "id": 1,
        "yier_number": "your_account_id",
        "name": "壹贰-新用户",
        "address": null,
        "sex": null,
        "birthday": null,
        "mate_id": null,
        "couple_link_id": null,
        "relationship": null,
        "together_date": null,
        "manifesto": null,
        "manifest_consistent_whether": false,
        "couple_nickname": null,
        "is_admin": false,
        "avatar_url": null,
        "point": 0,
        "coupleRequestRequesterId": null,
        "coupleRequestTargetId": null,
        "coupleRequestStatus": null,
        "adcode": null,
        "location": null
      }
    }
  }
  ```
- **Error Response**:
  ```json
  {
    "code": 10004,
    "message": "用户不存在",
    "result": ""
  }
  ```
  ```json
  {
    "code": 10005,
    "message": "密码错误",
    "result": ""
  }
  ```

## 3. 退出登录

- **URL**: `/user/logout`
- **Method**: `POST`
- **Description**: 用户退出登录，使当前令牌失效。
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Success Response**:
  ```json
  {
    "code": 0,
    "message": "用户退出登录成功",
    "result": {}
  }
  ```

## 4. 获取个人信息

- **URL**: `/user/info`
- **Method**: `GET`
- **Description**: 获取当前登录用户的个人信息。
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Success Response**:
  ```json
  {
    "code": "0",
    "message": "获取用户信息成功",
    "result": {
      "id": 1,
      "yier_number": "your_account_id",
      "name": "壹贰-新用户",
      "address": null,
      "sex": null,
      "birthday": null,
      "mate_id": null,
      "couple_link_id": null,
      "relationship": null,
      "together_date": null,
      "manifesto": null,
      "manifest_consistent_whether": false,
      "couple_nickname": null,
      "is_admin": false,
      "avatar_url": null,
      "point": 0,
      "coupleRequestRequesterId": null,
      "coupleRequestTargetId": null,
      "coupleRequestStatus": null,
      "adcode": null,
      "location": null,
      "createdAt": "2025-08-18T14:41:00.000Z",
      "updatedAt": "2025-08-18T14:41:00.000Z",
      "deletedAt": null
    }
  }
  ```

## 5. 修改密码

- **URL**: `/user/reset-pwd`
- **Method**: `POST`
- **Description**: 修改当前登录用户的密码。
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Request Body**:
  ```json
  {
    "yier_number": "your_account_id",
    "password": "old_password123"
  }
  ```
- **Success Response**:
  ```json
  {
    "code": 0,
    "message": "修改密码成功",
    "result": ""
  }
  ```
- **Error Response**:
  ```json
  {
    "code": 10007,
    "message": "密码错误",
    "result": ""
  }
  ```

## 6. 检查情侣请求

- **URL**: `/user/check-couple-request`
- **Method**: `GET`
- **Description**: 检查当前用户是否有未处理的情侣绑定请求。
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Success Response**:
  ```json
  {
    "code": 0,
    "message": "检查请求成功",
    "result": {
      "hasRequest": true,
      "requesterId": 2
    }
  }
  ```

## 7. 链接情侣关系

- **URL**: `/user/link-couple`
- **Method**: `POST`
- **Description**: 发送或接受情侣绑定请求。
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Request Body**:
  ```json
  {
    "targetUserId": 2,
    "action": "send"
  }
  ```
  或者
  ```json
  {
    "targetUserId": 2,
    "action": "accept"
  }
  ```
- **Success Response**:
  ```json
  {
    "code": 0,
    "message": "情侣请求已发送，等待对方确认",
    "result": {}
  }
  ```
  或者
  ```json
  {
    "code": 0,
    "message": "已成功建立情侣关系",
    "result": {}
  }
  ```
- **Error Response**:
  ```json
  {
    "code": 400,
    "message": "缺少必要参数"
  }
  ```
  ```json
  {
    "code": 400,
    "message": "无效的操作类型"
  }
  ```

## 8. 解除情侣关系

- **URL**: `/user/unlink-couple`
- **Method**: `POST`
- **Description**: 发送或接受解除情侣关系请求。
- **Headers**:
  - `Authorization`: `Bearer jwt_token`
- **Request Body for sending**:
  ```json
  {
    "action": "send_breakup"
  }
  ```
- **Request Body for accepting**:
  ```json
  {
    "action": "accept_breakup",
    "notificationId": 1,
    "requesterId": 2
  }
  ```
- **Success Response**:
  ```json
  {
    "code": 0,
    "message": "解除关系请求已发送，等待对方确认",
    "result": {}
  }
  ```
  或者
  ```json
  {
    "code": 0,
    "message": "已成功解除情侣关系",
    "result": {}
  }
  ```
