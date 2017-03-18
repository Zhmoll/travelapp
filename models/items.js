var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  name: {                 // 项目名
    type: String,
    index: true
  },
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
  }],
  cityid: Schema.ObjectId // 关联的城市
});

itemSchema.virtual('score').get(function () {
  var Reply = require('./item-replies');

  Reply.find({ itemid: this.id, display: true }, "score", function (err, replies) {
    if (err) return 0;

    if (replies.length == 0) return 5;
    var sum = 0;
    replies.forEach(function (reply) {
      sum += reply.score / replies.length
    });
    return sum;
  });
});

// itemSchema.set('toJSON', { virtuals: true });
// itemSchema.set('toObject', { virtuals: true });

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;