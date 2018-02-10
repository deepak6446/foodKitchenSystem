var express = require('express');
var router = express.Router();
var processRequest = require('../routes/processRequest')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/getOrders', processRequest.getOrders);
router.post('/api/orderCreated', processRequest.orderCreated);
router.post('/api/createOrder', processRequest.createOrder);
router.post('/api/setPredicted', processRequest.setPredicted);

module.exports = router;
