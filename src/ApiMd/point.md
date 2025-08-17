# 积分服务 API 文档

本文档详细说明了积分服务提供的所有 API 接口。

---

## 1. 查询当前用户总积分

获取当前登录用户的总积分余额。

- **路径**: `/points/`
- **方法**: `GET`
- **认证**: **需要**。必须在请求头中提供 `Authorization: Bearer <token>`。
- **参数**: 无。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取用户总积分成功",
  "result": {
    "total_points": 1500
  }
}
```

#### 失败响应 (500 Internal Server Error)

```json
{
  "code": 500,
  "msg": "获取用户总积分失败",
  "error": "具体的错误信息"
}
```

---

## 2. 查询个人积分记录

获取当前登录用户的积分变动历史记录。

- **路径**: `/points/records`
- **方法**: `GET`
- **认证**: **需要**。必须在请求头中提供 `Authorization: Bearer <token>`。
- **参数**: 无。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "查询积分记录成功",
  "result": [
    {
      "id": 1,
      "user_id": 1,
      "points_change": 100,
      "description": "完成每日任务：签到",
      "created_at": "2025-08-17T12:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "points_change": -50,
      "description": "兑换商品：一杯奶茶",
      "created_at": "2025-08-17T15:30:00.000Z"
    }
  ]
}
```

#### 失败响应 (500 Internal Server Error)

```json
{
  "code": 500,
  "msg": "查询积分记录失败",
  "error": "具体的错误信息"
}
```
