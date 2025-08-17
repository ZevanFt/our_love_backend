# 天气服务 API 文档

本文档详细说明了天气服务提供的所有 API 接口。

---

## 1. 获取自己的当天天气

根据城市编码（adcode）获取用户自己的当天天气情况。

- **路径**: `/weather/today`
- **方法**: `GET`
- **认证**: **需要**。
- **Query 参数**:
  - `adcode` (string, **必需**): 城市编码。例如: `"440106"`。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取天气成功",
  "result": {
    "date": "2025-08-17",
    "week": "7",
    "dayweather": "雷阵雨",
    "nightweather": "中雨-大雨",
    "daytemp": "33",
    "nighttemp": "25",
    "weather_icon": "weather-unknown"
  }
}
```

---

## 2. 获取自己的天气预报

根据经纬度获取用户自己的未来几天的天气预报。

- **路径**: `/weather/foresee`
- **方法**: `GET`
- **认证**: **需要**。
- **Query 参数**:
  - `geography` (string, **必需**): 用户的经纬度，格式为 `"经度,纬度"`。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取天气成功",
  "result": {
    "city": "天河区",
    "adcode": "440106",
    "casts": [
      {
        "date": "2025-08-17",
        "week": "7",
        "dayweather": "雷阵雨",
        "nightweather": "中雨-大雨",
        "weather_icon": "weather-unknown"
      }
    ]
  }
}
```

---

## 3. 更新自己的位置信息

更新用户在数据库中存储的地理位置信息。

- **路径**: `/weather/location`
- **方法**: `POST`
- **认证**: **需要**。
- **Query 参数**:
  - `geography` (string, **必需**): 用户的经纬度，格式为 `"经度,纬度"`。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "更新位置成功",
  "result": {
    "addressComponent": {
      "city": "武汉市",
      "province": "湖北省",
      "adcode": "420111",
      "district": "洪山区"
    },
    "formatted_address": "湖北省武汉市洪山区九峰街道光谷三路辅路光谷澎湃城奥山府"
  }
}
```

---

## 4. 获取情侣对象的当天天气

获取情侣对象所在位置的当天天气情况。

- **路径**: `/weather/today/partner`
- **方法**: `GET`
- **认证**: **需要**。
- **Query 参数**: 无。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取天气成功",
  "result": {
    "date": "2025-08-17",
    "week": "7",
    "dayweather": "晴",
    "nightweather": "晴",
    "daytemp": "37",
    "nighttemp": "27",
    "weather_icon": "weather-unknown"
  }
}
```

---

## 5. 获取情侣对象的天气预报

获取情侣对象所在位置的未来几天的天气预报。

- **路径**: `/weather/foresee/partner`
- **方法**: `GET`
- **认证**: **需要**。
- **Query 参数**: 无。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取天气成功",
  "result": {
    "city": "洪山区",
    "adcode": "420111",
    "casts": [
      {
        "date": "2025-08-17",
        "week": "7",
        "dayweather": "晴",
        "nightweather": "晴",
        "weather_icon": "weather-unknown"
      }
    ]
  }
}
```

---

## 6. 获取情侣对象的地理位置信息

获取情侣对象所在位置的详细地理编码信息。

- **路径**: `/weather/location/partner`
- **方法**: `GET`
- **认证**: **需要**。
- **Query 参数**: 无。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取位置成功",
  "result": {
    "addressComponent": {
      "city": "武汉市",
      "province": "湖北省",
      "adcode": "420111",
      "district": "洪山区"
    },
    "formatted_address": "湖北省武汉市洪山区九峰街道光谷三路辅路光谷澎湃城奥山府"
  }
}
```

---

## 7. 获取穿衣建议

根据用户当前位置的实时天气，通过 AI 生成个性化的穿衣建议。

- **路径**: `/weather/clothing`
- **方法**: `POST`
- **认证**: **需要**。
- **Query 参数**:
  - `location` (string, **必需**): 用户的经纬度，格式为 `"经度,纬度"`。

#### 成功响应 (200 OK)

```json
{
  "code": 200,
  "msg": "获取穿衣建议成功",
  "result": "今天天气晴朗，温度适中，建议穿着轻薄透气的衣物，如T恤、衬衫搭配休闲裤或裙子。早晚温差可能较大，可随身携带一件薄外套。"
}
```
