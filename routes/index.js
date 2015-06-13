var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Bienvenido a Quiz', description: 'El portal d&oacute;nde podr&aacute;s crear tus propios juegos!' });
});

module.exports = router;
