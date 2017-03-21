# 云游 app 开发者文档 

## 一、全局事项

### 1、api统一请求方法

以下方法二选一即可。

#### 1）Authorization字段法（推荐）

在发送的请求头部添加Authorization字段，值为登录后返回的token值。

#### 2）查询字符串

在url路径末尾添加查询字符串?accesstoken={token}，值为登陆后返回的token值。

### 2、统一api返回信息

为了开发者便利，且便于构造app端和web端相似的消息响应机制，采用统一的api返回信息。访问所有接口均返回统一json对象，根据对象进行业务逻辑的处理。

#### 1）返回的json对象

访问api统一的回复格式如下。其中`type`包含两种结果`success`和`error`，分别对应着操作的成功与否。`code`是操作结果，与其对应的`message`则是操作结果的解释。另外，并不是每一个操作都会产生`result`键，具体查阅下方的各api解释。

```javascript
{
	"type": "success",
	"code": "41000",
	"message": "登录成功",
 	"result": { body }
}
```

#### 2）`code`与相应`message`表

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
| 43000 | success | 用户信息修改成功               |                              |
| 44000 | success | 评论成功                   |                              |
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

## 二、api内容

### 1、登录机制

#### 1）登录

`post` `/api/signup`

发送

```json
{
  "credential":{
    "username":"Zhmoll",
    "password":"THISISPASSWORD"
  },
  "profile":{
    "nickname": "抱朴守拙的小小薇",
    "gender": "男"
  }
}
```

返回

```json
{
	"type": "success",
	"code": "41000",
	"message": "登录成功"
  	"result": {
    	"token": "xBZeLCRNrzUeWfHz6WO4Bk9l1HZeopqlnG4EMNx0C3ewCHlmUdtNzcCdnisOJoZTvtglq9agFuzvZL3rZEKoWw==",
         "user": {
              "_id": "58caa76ae59225396c3122ad",
              "username": "Zhmoll",
              "nickname": "抱朴守拙的小小薇",
              "gender": "男",
         }
  	}
}
```

请用合适的字段填充发送中看起来该填充的内容。其中`profile`字段可选，如果不在注册时发送，那么也不会在返回时出现`profile`字段中的内容。

如果已经是登录的状态下，即1、有`Authorization`字段或者附加了`accesstoken`querystring，2、其值有效，那么会返回一个简单json对象42002。

注意，要将该`result`中的内容持久化到本地，在web端是`localStorage`，在安卓端是`Sqlite`，并且在其他页面时显示应有的头像、昵称等信息，在发送其他api时附加`token`内容至`Authorization`。

#### 2）注销

`get` `/api/signout`

返回

```json
{
	"type": "success,
	"code": "42000",
	"message": "注销成功"
}
```

如果已经是未登录的状态下，即没有`Authorization`字段并且没附加`accesstoken`querystring，那么会返回一个简单json对象42001。

### 3）登录

`post` `/api/signin`

发送

```json
{
    "username": "Zhmoll",
    "password": "THISISPASSWORD"
}
```

返回

```json
{
    "type": "success",
    "code": "41000",
    "message": "登录成功",
    "result": {
        "token": "xBZeLCRNrzUeWfHz6WO4Bk9l1HZeopqlnG4EMNx0C3ewCHlmUdtNzcCdnisOJoZTvtglq9agFuzvZL3rZEKoWw==",
        "user": {
              "_id": "58caa76ae59225396c3122ad",
              "username": "Zhmoll",
              "nickname": "抱朴守拙的小小薇",
              "gender": "男",
         }
    }
}
```

当然了，包括注册，每次登录获取到的token值都不一样。且token有使用期限，目前定为一周。超时会要求重新登录。

如果密码错误，那么自然会出现41001的情况。

### 4）修改个人信息

`put` `/api/profile`

发送（只接受以下内容，可以缺少部分键）

```json
{
    "password":"zhmolldasuaibi",
    "gender":"男",
    "avatar":"http://cdn.etuan.org/img/wx-etuan.jpg",
    "nickname":"抱朴守拙的大大薇"
}
```

返回

```
{
    {
    "type": "success",
    "code": "43000",
    "message": "用户信息修改成功",
    "result": {
        "user": {
              "_id": "58caa76ae59225396c3122ad",
              "username": "Zhmoll",
              "nickname": "抱朴守拙的大大薇",
              "gender": "男",
              "avatar":"http://cdn.etuan.org/img/wx-etuan.jpg"
         }
    }
}
```

当然啦，没有错误的返回情况。

### 2、城市模型