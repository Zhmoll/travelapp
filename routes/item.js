const router = require('express').Router();
const Item = require('../models/items');
const Reply = require('../models/item-replies');

const checkLogin = require('../middlewares/checkLogin');

router.use('/:itemid', function (req, res, next) {
  const itemid = req.params.itemid;

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
  const item = res.locals.item;
  item.enable = undefined;
  return res.json({
    type: "success",
    code: 51000,
    message: "项目获取成功",
    result: item
  });
});

router.get('/:itemid/feedback', checkLogin, function (req, res, next) {
  const itemid = req.params.itemid;
  const userid = res.locals.userid;
  const body = req.body;

  const reply = {
    userid: userid,
    itemid: itemid,
    content: body.content,
    score: body.score
  }

  Reply.create(reply, function (err, reply) {
    if (err) return next(err);

    return res.json({
      type: "success",
      code: 44000,
      message: "评论成功"
    });
  });
});

module.exports = router;