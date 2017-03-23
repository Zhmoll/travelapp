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
| 41002 | error   | 凭据数据格式不正确              |                              |
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
| 80007 | eerror  | 添加城市信息为空               |                              |
| 81000 | success | 添加项目成功                 |                              |
| 81001 | error   | 未找到该项目                 |                              |
| 81002 | success | 修改项目成功                 |                              |
| 81003 | error   | 该项目正在使用当中，请先关闭该项目的公开访问 |                              |
| 81004 | success | 获得项目成功                 |                              |
| 81005 | success | 删除该项目成功                |                              |
| 90001 | error   | 您没有权限执行该操作             |                              |

## 二、api内容

### 1、登录机制与用户模型
一个`User`模型是这样的，下面就不再重复了，其中`password`字段和`authority`字段不返回给客户端，`authority`不接受修改。

```javascript
{
    username: String,
    password: String,
    avatar: String,
    gender: String,
    nickname: String,
    authority: Number
}
```

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

请用合适的字段填充发送中看起来该填充的内容。其中`profile`字段可选，如果不在注册时发送，那么也不会在返回时出现`profile`字段中的内容。

如果已经是登录的状态下，即1、有`Authorization`字段或者附加了`accesstoken`querystring，2、其值有效，那么会返回一个简单json对象42002。

注意，要将该`result`中的内容持久化到本地，在web端是`localStorage`，在安卓端是`Sqlite`，并且在其他页面时显示应有的头像、昵称等信息，在发送其他api时附加`token`内容至`Authorization`。

#### 2）注销

`get` `/api/signout`

返回

```json
{
	"type": "success",
	"code": "42000",
	"message": "注销成功"
}
```

如果已经是未登录的状态下，即没有`Authorization`字段并且没附加`accesstoken`querystring，那么会返回一个简单json对象42001。

#### 3）登录

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

#### 4）修改个人信息

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

```json
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

### 2、城市模型与项目模型

在城市模型中，`province`的取值被限制在这些内容之内。`enable`是管理员是否在添加城市之后将城市上线的标志位。

```javascript
{
	name: String,
    province: {
    	type: String,
    	enum: ['北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川', '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '西藏', '广西', '宁夏', '新疆', '香港', '澳门']
    },
	enable: Boolean
}
```

#### 1）获取城市

`get` `/api/city/{cityname}`

要获取城市所拥有的特色景观、特产等项目，首先就需要获取城市id。而城市id的获取则需要请求这样的api。

返回

```json
{
  	"type":"success",
  	"code":50000,
  	"message":"获取城市成功",
  	"result":{
      	"_id":"58ccf2c8f92e71212032f03c",
      	"name":"呼和浩特",
      	"province":"内蒙古",
      	"enable":true,
      	"items":[
          	{
              	"_id":"58ccf522f92e71212032f03d",
              	"name":"希拉穆仁大草原",
              	"type":"景点",
              	"intros":"蜚声海内外的旅游避暑胜地,有独特浓郁的蒙古民族文化风情。"
            },
            {
      			"_id":"58ccf522f92e71212032f03e",
      			"name":"响沙湾",
      			"type":"景点",
      			"intros":"集观光与休闲度假为一体的特大型综合型的沙漠休闲景区。"
    		},
        	{
      			"_id":"58ccf522f92e71212032f03f",
      			"name":"烤全羊",
      			"type":"美食",
      			"intros":"蒙古族招待贵客的传统佳肴。"
    		}
        ]	
    }
}
```
当然，也有可能返回50001和50002情况。其中，50002情况是该城市的`enable`被设置为`false`。客户端需要正确地渲染该页面，显示该城市尚未启用。

同时，会查询所有该城市的特色项目并安放在`items`之中，这些项目只有一个比较缩略的内容，仅仅返回`_id`、`name`、`type`和`intros`。如果需要进一步查询，请使用itemid使用相应api检索。

#### 2）获取项目详情

项目模型如下：

```javascript
{
  	name: String,           // 项目名
  	type: {                 // 类别
    	type: String,
    	enum: ['景点', '美食', '特产', '民宿', '文化']
  	},
  	enable: Boolean,        // 启用状态
  	intros: String,         // 简介
  	details: String,        // 详细介绍
  	address: String,        // 地理位置 - 文字描述
  	location: [Number],     // 地理位置 - 经纬度
  	traffic: String,        // 交通方式
  	recommend: [{           // 推荐的事物
    	title: String,
    	content: String
  	}],
  	cost: String,
  	opentime: String,       // 运营时间
  	tips: [String],         // 提示
  	contact: [{             // 联系方式
    	method: {
      		type: String,
      		enum: ['email', 'phone', 'wechat', 'QQ']
    	},
    	content: String
  	}]
}
```

项目模型比较复杂，也遵循着这样的一个原则——没有数据就不返回，不需要的数据就不用提交。

在启用状态`enable`中，事实上，普通注册用户不会返回该值为`false`的内容。`name``type``intros`在上一个接口中予以展示，所以建议在后面管理员添加项目时必填，虽然并未在数据库端加以限制。`location`是一个包含经纬度的二元数值。第一项为经度，第二项为纬度，例如`[40.8474610000,111.7585180000]`。在推荐`recomend`数组中，需要填写`title`和`content`才能作为完整的一项内容。在`tips`中，注意它也是一个数组，需要多少项内容，放进去多少个内容。联系方式`contact`也是一个数组，每一项内容需要包含`method`和`content`。例如一个合适的联系方式：

```json
{
	[
      	"method":"phone",
  		"content":"18888888888"
	],
  	[
      	"method":"wechat",
  		"content":"Zhmoll"
  	]
}
```

那么，接下来是获取项目的api

`get` `/api/item/{itemid}`

返回

```json
{
  	"type":"success",
  	"code":51000,
  	"message":"项目获取成功",
  	"result":{
      	"_id":"58ccf522f92e71212032f03d",
      	"name":"希拉穆仁大草原",
      	"type":"景点",
      	"intros":"蜚声海内外的旅游避暑胜地,有独特浓郁的蒙古民族文化风情。",
      	"details":"希拉穆仁草原位于内蒙古自治区达尔罕茂明安联合旗，是蜚声海内外的旅游避暑胜地。希拉穆仁蒙古语意为“黄河”希拉穆仁草原旅游俗称“召河”，因在希拉穆仁河畔有一座清代喇嘛召庙“普会寺”而得名。\n希拉穆仁草原是内蒙最早开壁的草原旅游点，在呼和浩特以北100公里处，海拔1700米，丘陵起伏，芳草萋萋，空气清新，一派草原风光。昼夜温较大，盛夏之夜，也凉爽似秋。\n在希拉穆仁草原，每年都要举行盛大的草原那达慕活动，其中的赛马、摔跤和射箭三项竞技是蒙古族“男儿三艺”。在这里，游客既可以看到勇敢剽悍的草原健儿的精湛表演，也可以亲自披挂上阵，大显身手，一抒豪情。还可以参与隆重的“祭敖包”仪式，享用草原民族典型的风味餐饮，体会独特浓郁的蒙古民族文化风情。",
      	"traffic":"呼和浩特距离希拉穆仁草原大约75公里，车程大概1个多小时，包车和自驾前往都很方便；如果选择乘车，可以从呼市长途汽车站乘坐去往召河的长途车；或者搭乘前往达茂旗方向的车，在召河下车即可。用时5小时。",
      	"cost":"成人80元，儿童40元",
      	"opentime":"8:00-20:00",
      	"cityid":"58ccf2c8f92e71212032f03c",
      	"contact":[],
      	"tips":[
          	"草原昼夜温差大,到草原旅游一定要带外套和长裤。同时,由于天气变化无常,要准备防雨衣物。",
          	"内蒙古地区地处高原,日照时间长,光线较强,需要准备遮阳帽、太阳镜、防晒霜。","在草原上住宿,夜晚难以辨别方向,带上手电筒是必要的。草原面积很大,外出要结伴同行,小心迷路。","在草原上住宿,一般不配备洗漱用品、拖鞋,请提前自备。",
          	"参加草原各项活动时,要特别注意安全,尤其是骑马等活动要十分注意安全。","初来乍到者有时难以适应草原上的饮用水,有必要准备一些矿泉水。",
          	"有大片沼泽地的草原,游客要特别注意,不要随便进入,以免发生危险。","在草原上开车、骑马要在指定范围内活动,以免迷失方向或破坏草场。"
        ],
      "recommend":[],
      "location":[40.847461,111.758518]
    }
}
```

注意其中的内容的表达方式。不存在的字符串内容不返回，不存在的数组内容的数组为空。可能你需要对`details`的显示方式加以处理，我们可以认为`details`是一个富文本的表达方式，里面可以存在图片。具体内容等设置出来再说。

当找不到项目时，返回51001。

###3、管理员api

所有管理员api都是需要用管理员账户登录后，获取管理员token进行操作的。管理员token也和普通用户的token一样添加到相应位置即可使用。非管理员token或者无token会产生90001结果。

#### 1）获取所有城市

`get` `/api/manage/city`

返回

```json
{
    "type": "success",
    "code": 80004,
    "message": "获得城市成功",
    "result": [
    {
        "_id": "58ccf2c8f92e71212032f03c",
        "name": "呼和浩特",
        "province": "内蒙古",
        "enable": true
    }
  ]
}
```

注意`result`是一个数组，也就是说，有多少个城市被创建出来，就会返回多少个城市。当然，一开始是没有任何城市的话，那么`result`是空数组。怎么判断呢？`result.length()==0`。

这个api只返回城市列表，并不会把该城市所有项目内容都返回。需要获取该城市所有项目内容或修改该城市，则需要拿到`_id`访问以下接口进行。

#### 2）获得某指定城市

`get`  `/api/manage/city/{cityid}`

返回

```json
{
    "type": "success",
    "code": 80006,
    "message": "获得城市成功",
    "result": {
        "_id": "58ccf2c8f92e71212032f03c",
        "name": "呼和浩特",
        "province": "内蒙古",
        "enable": true,
        "items":[{
       		"_id": "58ccf522f92e71212032f03d",
        	"name": "希拉穆仁大草原",
        	"type": "景点",
        	"intros": "蜚声海内外的旅游避暑胜地,有独特浓郁的蒙古民族文化风情。"
		    "enable": true
      	}]
    }
}
```

与上面的接口对比，这个接口返回的result是一个对象而不是数组。这个城市会自动附上简练的项目信息，这些项目信息同样是一个数组。

如果获取失败（没有这个id的城市），那么就会返回80001。

#### 3）添加一个城市

`post` `/api/manage/city`

发送

```json
{
  	"name":"呼和浩特",
  	"province":"内蒙古"
}
```

返回

```
{
    "type": "success",
    "code": 80000,
    "message": "添加城市成功",
    "result": {
        "_id": "58ccf2c8f92e71212032f03c",
        "name": "呼和浩特",
        "province": "内蒙古",
        "enable": false
    }
}
```

如果上面发送的信息字段不正确，会获得80007结果。

#### 4）修改一个城市

`put` `/api/manage/city/{cityid}`

发送

```json
{
  	"name":"呼和浩特",
  	"province":"内蒙古",
  	"enable": true
}
```

返回

```json
{
    "type": "success",
    "code": 80002,
    "message": "修改城市成功",
    "result": {
        "_id": "58ccf2c8f92e71212032f03c",
        "name": "呼和浩特",
        "province": "内蒙古",
        "enable": true
    }
}
```

发送的内容中，如果不需要修改的就不要发送了，只把需要修改的地方发过来就行

#### 5）删除一个城市

`delete` `/api/manage/city/{cityid}`

返回

```json
{
      "type": success",
      "code": 80005,
      "message": "删除该城市成功"
}
```

值得注意的是，当选择的城市的`enable`为`true`，即城市启用的时候，这个城市是不允许删除的，返回80003结果。

#### 6）添加一个项目

`post` `/api/manage/item`

发送

```
name、type、intros、details、address、location、traffic、recommend、opentime、tips、contact、.contact、cityid中任意项目即可。请参照前面的项目格式发送。
```

返回

```
参照前面二、2、2）的格式。
```

注意，在添加项目的时候不能立刻就让`enable`为`true`。需要在修改项目时修改。

#### 7）获得一个项目

`get` `/api/manage/item/{itemid}`

返回

```
参照前面二、2、2）的格式。
```

与前面二、2、2）不同的是，这个多返回了一个`enable`键，毕竟是管理员方法嘛。

#### 8）修改一个项目

`put` `/api/manage/item/{itemid}`

发送

```
name、type、enalbe、intros、details、address、location、traffic、recommend、opentime、tips、contact、.contact、cityid中任意项目即可。请参照前面的项目格式发送。
```

返回

```
参照前面二、2、2）的格式。
```

与前面二、2、2）不同的是，这个多返回了一个`enable`键，毕竟是管理员方法嘛。

#### 9）删除一个项目

`delete` `/api/manage/item/{itemid}`

返回

```json
{
      "type": "success",
      "code": 81005,
      "message": "删除该项目成功"
}
```

与删除一个城市雷同。