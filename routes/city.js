var express = require('express');
var router = express.Router();

var City = require('../models/cities');
var Item = require('../models/items');

router.get('/:cityname', function (req, res, next) {
  var cityname = req.params.cityname;

  City.findOne({
    name: cityname
  }, function (err, city) {
    if (err) return next(err);

    if (!city) {
      return res.json({
        type: 'error',
        code: 50001,
        message: '该城市尚未录库'
      });
    }

    if (!city.enable) {
      return res.json({
        type: 'error',
        code: 50002,
        message: '该城市正在准备中'
      });
    }

    Item
      .where('cityid').equals(city.id)
      .where('enable').equals(true)
      .select('name type intros')
      .sort('type')
      .exec(function (err, items) {
        if (err) return next(err);
        return res.json({
          type: 'success',
          code: 50000,
          message: '获取城市成功',
          result: items
        });
      });
  });
});

module.exports = router;