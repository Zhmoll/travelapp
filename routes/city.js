const router = require('express').Router();
const City = require('../models/cities');
const Item = require('../models/items');

router.get('/:cityname', function (req, res, next) {
  const cityname = req.params.cityname;

  City.findOne({ name: cityname }, null, { lean: true }, function (err, city) {
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
      .where('cityid').equals(city._id)
      .where('enable').equals(true)
      .select('name type intros')
      .sort('type')
      .exec(function (err, items) {
        if (err) return next(err);
        city.items = items;
        console.log(items)
        return res.json({
          type: 'success',
          code: 50000,
          message: '获取城市成功',
          result: city
        });
      });
  });
});

module.exports = router;