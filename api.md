## api统一请求方法

### 1、Authorization字段

在请求头部添加Authorization字段

### 2、查询字符串

在url路径末尾添加查询字符串?accesstoken={token}

## api统一回复内容

### 1、json对象

访问api统一的回复格式如下，其中，并不是每一个操作都会产生result键，且可能产生的result值也因不同api而不同，具体请见下方对于各api的解释。

```javascript
{
	"type": "success",
	"code": "41000",
	"message": "登录成功",
    "result": { body }
}
```

### 2、code表

api统一回复的格式中，code用于标识服务器计算的状态，客户端应该根据不同的code做出不同的回应，如果没有特殊情况，直接将message返回给用户也是可以的。以下是code表。

| code  | 状态      | message                | 备注                           |
| ----- | ------- | ---------------------- | ---------------------------- |
| 20000 | success | 首页获取成功                 |                              |
| 40000 | success | 用户注册成功                 |                              |
| 40001 | error   | 用户已存在                  |                              |
| 41000 | success | 登录成功                   |                              |
| 41001 | error   | 用户名或密码错误               |                              |
| 42000 | success | 注销成功                   |                              |
| 42001 | error   | 您尚未登录或登录凭证无效           | 操作需要登录的api接口时，而未给予正确token时产生 |
| 42002 | error   | 您已经登录                  | 操作不需要登录的api接口时，而用户登录的状态下产生   |
| 50000 | success | 获取城市成功                 |                              |
| 50001 | error   | 该城市尚未录库                |                              |
| 50002 | error   | 该城市正在准备中               | 城市已经添加到数据库中，但是管理员并没有开启该城市    |
| 51000 | success | 项目获取成功                 |                              |
| 51001 | error   | 找不到该项目                 |                              |
| 80000 | success | 添加城市成功                 | 管理员方法                        |
| 80001 | error   | 未找到该城市                 |                              |
| 80002 | success | 修改城市成功                 |                              |
| 80003 | error   | 该城市正在使用当中，请先关闭该城市的公开访问 |                              |
| 80004 | success | 获得城市成功                 |                              |
| 80005 | success | 删除该城市成功                |                              |
| 80006 | success | 获得城市和其项目成功             |                              |
| 81000 | success | 添加项目成功                 |                              |
| 81001 | error   | 未找到该项目                 |                              |
| 81002 | success | 修改项目成功                 |                              |
| 81003 | error   | 该项目正在使用当中，请先关闭该项目的公开访问 |                              |
| 81004 | success | 获得项目成功                 |                              |
| 81005 | success | 删除该项目成功                |                              |
| 90001 | error   | 您没有权限执行该操作             |                              |

​	