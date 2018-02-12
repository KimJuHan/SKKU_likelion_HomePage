var express = require('express');
var router = express.Router();
var db = require('../models');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require('crypto');
var salt = "skkuLikeLion"

//crypt-password
var passwordCrypt = function(password){
  return crypto.createHash('sha512').update( password + salt).digest('base64');
}

//passport
passport.serializeUser(function(userInfo, done){
  console.log('serializeUser');
  done(null, userInfo);
})

passport.deserializeUser(function(userInfo, done){
  console.log('deserializeUser');
  done(null, userInfo);
  
})  

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done){
  db.users.findOne({
      where: {
          email : email,
          password : passwordCrypt(password)
      }
  }).then(function(user){
      if(!user){
          return done(null, false, {message: '아이디 또는 비밀번호 오류입니다.'});
      } else {
          var userInfo = {};
          userInfo["id"] = user.dataValues.id;
          userInfo["displayName"] = user.dataValues.displayName;
          return done(null, userInfo);
      }
  })
  }
))

/* GET users listing. */
router.get('/join', function(req, res, next) {
  res.render('join');
});

router.post('/join', function(req, res){
  db.users.create({
    displayName : req.body.displayName,
    email : req.body.email,
    password : passwordCrypt(req.body.password),
    knowHow : req.body.content
  })
  .then(function(){
    res.redirect('/users/login');
  })
})

router.get('/idCheck', function(req, res){
  db.users.findOne({
    where : { email : Object.keys(req.query)[0] }
  })
  .then(function(user){
    if(user){
      res.send("이미 존재하는 아이디입니다.");
    }else{
      res.send("사용가능한 아이디입니다.")
    }
  })
})

router.get('/login', function(req, res){
  var flash = req.flash().error
  console.log(flash);
  res.render('login', { flashMessage : flash });
})

router.post('/login', passport.authenticate('local', {
  failureRedirect : '/users/login',
  failureFlash : true
}), function(req, res){
  res.redirect('/posts/1');
})

router.get('/logout', function(req, res){
  req.logout();
  res.send('<script>alert("로그아웃 되셨습니다");location.href="/"</script>')
})


module.exports = router;
