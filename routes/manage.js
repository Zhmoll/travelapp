const router = require('express').Router();
const City = require('../models/cities');
const Item = require('../models/items');

// 管理员ACL
router.use('/', require('../middlewares/checkAdmin'));

// 获得所有城市
router.get('/city', function (req, res, next) {
  City.find({}, function (err, cities) {
    if (err) return next(err);
    return res.json({
      type: 'success',
      code: 80004,
      message: '获得城市成功'
    });
  });
});

// 获得一个城市
router.get('/city/:id', function (req, res, next) {
  var cityid = req.params.id;

  City.findById(cityid, function (err, city) {
    if (err) return next(err);

    if (!city) {
      return res.json({
        type: 'error',
        code: 80001,
        message: '未找到该城市'
      });
    }

    return res.json({
      type: 'success',
      code: 80004,
      message: '获得城市成功',
      result: city
    });
  });
});

// 获得一个城市和其所有项目
router.get('/city/:id/items', function (req, res, next) {
  var cityid = req.params.id;

  City.findById(cityid, function (err, city) {
    if (err) return next(err);

    if (!city) {
      return res.json({
        type: 'error',
        code: 80001,
        message: '未找到该城市'
      });
    }

    Item.find({ cityid: cityid }, function (err, items) {
      if (err) return next(err);

      var completeCity = city;
      completeCity.items = items;

      return res.json({
        type: 'success',
        code: 80006,
        message: '获得城市和其项目成功',
        result: completeCity
      });
    });
  });
});

// 添加一个新城市
router.post('/city', function (req, res, next) {
  var body = req.body;

  var name = body.name;
  var province = body.province;

  City.create({
    name: name,
    province: province,
    enable: false
  }, function (err, city) {
    if (err) return next(err);

    return res.json({
      type: 'error',
      code: 80000,
      message: '添加城市成功',
      result: city
    });
  });
});

// 修改一个城市
router.put('/city/:id', function (req, res, next) {
  var cityid = req.params.id;
  var body = req.body;

  City.findById(cityid, function (err, city) {
    if (err) return next(err);

    if (!city) {
      return res.json({
        type: 'error',
        code: 80001,
        message: '未找到该城市'
      });
    }

    city.name = body.name || city.name;
    city.province = body.province || city.province;
    city.enable = body.enable || city.enable;
    city.save();
    return res.json({
      type: 'success',
      code: 80002,
      message: '修改城市成功',
      result: city
    });
  });
});

// 删除一个城市
router.delete('/city/:id', function (req, res, next) {
  var cityid = req.params.id;

  City.findById(cityid, function (err, city) {
    if (err) return next(err);

    if (!city) {
      return res.json({
        type: 'error',
        code: 80001,
        message: '未找到该城市'
      });
    }

    if (!city.enable) {
      return res.json({
        type: 'error',
        code: 80003,
        message: '该城市正在使用当中，请先关闭该城市的公开访问'
      });
    }

    city.remove();
    return res.json({
      type: 'success',
      code: 80005,
      message: '删除该城市成功'
    });
  });
});

// 添加一个项目
router.post('/item', function (req, res, next) {
  var body = req.body;

  var item = new Item();
  item.name = body.name;
  item.type = body.type;
  item.enable = false;
  item.intros = body.intros;
  item.details = body.details;
  item.address = body.address;
  item.location = body.location;
  item.traffic = body.traffic;
  item.recommend = body.recommend;
  item.opentime = body.opentime;
  item.tips = body.tips;
  item.contact = body.contact;
  item.cityid = body.cityid;

  item.save(function (err) {
    if (err) return next(err);

    return res.json({
      type: 'success',
      code: 80005,
      message: '添加项目成功',
      result: item
    })
  });
});

// 获得一个项目
router.get('/item/:id', function (req, res, next) {
  var itemid = req.params.id;
  Item.findById(itemid, function (err, item) {
    if (err) return next(err);

    if (!item) {
      return res.json({
        type: 'error',
        code: 81001,
        message: '未找到该项目'
      });
    }

    return res.json({
      type: 'success',
      code: 81004,
      message: '获得项目成功',
      result: item
    });
  });
});

// 修改一个项目
router.put('/item/:id', function (req, res, next) {
  var body = req.body;
  var itemid = req.params.id;

  Item.findById(itemid, function (err, item) {
    if (err) return next(err);

    if (!item) {
      return res.json({
        type: 'error',
        code: 81001,
        message: '未找到该项目'
      });
    }

    item.name = body.name;
    item.type = body.type;
    item.enable = body.enable;
    item.intros = body.intros;
    item.details = body.details;
    item.address = body.address;
    item.location = body.location;
    item.traffic = body.traffic;
    item.recommend = body.recommend;
    item.opentime = body.opentime;
    item.tips = body.tips;
    item.contact = body.contact;
    item.cityid = body.cityid;

    item.save(function (err) {
      if (err) return next(err);

      return res.json({
        type: 'success',
        code: 81002,
        message: '修改项目成功',
        result: item
      });
    });

  });

});

// 删除一个项目
router.delete('/item/:id', function (req, res, next) {
  var itemid = req.params.id;

  Item.findById(itemid, function (err, item) {
    if (err) return next(err);

    if (!item) {
      return res.json({
        type: 'error',
        code: 81001,
        message: '未找到该项目'
      });
    }

    if (!item.enable) {
      return res.json({
        type: 'error',
        code: 81003,
        message: '该项目正在使用当中，请先关闭该项目的公开访问'
      });
    }

    item.remove();
    return res.json({
      type: 'success',
      code: 81005,
      message: '删除该项目成功'
    });
  });
});

module.exports = router;