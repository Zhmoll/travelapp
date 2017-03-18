var express = require('express');
var router = express.Router();

var checkLogin = require('../middlewares/checkLogin');

var Item = require('../models/items');
var Reply = require('../models/item-replies');

router.use('/:itemid', function (req, res, next) {
  var itemid = req.params.itemid;

  Item.findById(itemid, function (err, item) {
    if (!item || !item.enable) {
      return res.json({
        type: "error",
        code: 51001,
        message: "找不到该项目"
      });
    }

    res.locals.item = item;
    next();
  });
});

router.get('/:itemid', function (req, res, next) {
  var item = res.locals.item;
  item.enable = undefined;
  return res.json({
    type: "success",
    code: 51000,
    message: "项目获取成功",
    result: item
  });
});

router.get('/:itemid/feedback', checkLogin, function (req, res, next) {
  var itemid = req.params.itemid;
  var userid = res.locals.userid;
  var body = req.body;

  var reply = {
    userid: userid,
    itemid: itemid,
    content: body.content,
    score: body.score
  }

  Reply.create(reply, function (err, reply) {
    if (err) return next(err);

    return res.json({
      type: "success",
      code: 43000,
      message: "评论成功"
    });
  });
});

module.exports = router;