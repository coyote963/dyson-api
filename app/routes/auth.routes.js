var express = require('express');
var router = express.Router();
const dbConfig = require('../../config/database.config');

router.get('/steam',
  passport.authenticate('steam'),
  function(req, res) {
});

router.get('/steam/return',
  passport.authenticate('steam', { session: false}),
  function(req, res) {
    const token = jwt.sign({ user: req.user }, dbConfig.secretkey, {
      expiresIn: "2h",
    });
    res.render("authenticated", {
      jwtToken: token,
      clientUrl: dbConfig.frontendUri ,
    });
  }
);

module.exports = router