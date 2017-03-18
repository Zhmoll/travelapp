var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var citySchema = new Schema({
  name: { type: String, index: true },
  province: {
    type: String,
    enum: ['北京', '上海', '天津', '重庆', '河北', '山西', '辽宁', '吉林', '黑龙江', '江苏',
      '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川',
      '贵州', '云南', '陕西', '甘肃', '青海', '台湾', '内蒙古', '西藏', '广西', '宁夏', '新疆',
      '香港', '澳门']
  },
  enable: Boolean
});

var City = mongoose.model('City', citySchema);

module.exports = City;