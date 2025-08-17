# API 文档 - 任务 (Tasks)

### 获取分配给我的/我发布的任务

- **Method:** `GET`
- **Path:** `/tasks/assigned-to-me` 或 `/tasks/created-by-me`
- **Auth:** 需要登录认证
- **Success Response (200):**
  ```json
  {
    "code": 200,
    "msg": "获取任务成功",
    "result": [ ... ]
  }
  ```
- **Error Response:**
  ```json
  { "code": "40002", "msg": "查找任务失败" }
  ```

### 发布任务

- **Method:** `POST`
- **Path:** `/tasks`
- **Auth:** 需要登录认证
- **Body:**
  ```json
  {
    "title": "一个新的任务",
    "description": "任务的详细描述",
    "points_reward": 50
  }
  ```
- **Error Responses:**
  ```json
  { "code": "10104", "msg": "尚无情侣关系" }
  ```
  ```json
  { "code": "40004", "msg": "创建任务失败" }
  ```

### 修改任务信息

- **Method:** `PUT`
- **Path:** `/tasks/:id`
- **Auth:** 需要登录认证 (仅限发布者)
- **Error Responses:**
  ```json
  { "code": "40002", "msg": "无权操作此任务" }
  ```
  ```json
  { "code": "40005", "msg": "更新任务失败" }
  ```

### 提交任务完成

- **Method:** `PUT`
- **Path:** `/tasks/:id/complete`
- **Auth:** 需要登录认证 (仅限执行人)
- **Error Responses:**
  ```json
  { "code": "40002", "msg": "无权操作此任务" }
  ```
  ```json
  { "code": "40003", "msg": "任务状态异常，无法操作" }
  ```
  ```json
  { "code": "40007", "msg": "提交任务失败" }
  ```

### 确认任务完成

- **Method:** `PUT`
- **Path:** `/tasks/:id/confirm`
- **Auth:** 需要登录认证 (仅限发布者)
- **Error Responses:**
  ```json
  { "code": "40002", "msg": "无权操作此任务" }
  ```
  ```json
  { "code": "40003", "msg": "任务状态异常，无法操作" }
  ```
  ```json
  { "code": "40008", "msg": "确认任务失败" }
  ```

### 删除任务

- **Method:** `DELETE`
- **Path:** `/tasks/:id`
- **Auth:** 需要登录认证 (仅限发布者)
- **Error Responses:**
  ```json
  { "code": "40002", "msg": "无权操作此任务" }
  ```
  ```json
  { "code": "40006", "msg": "删除任务失败" }
  ```
