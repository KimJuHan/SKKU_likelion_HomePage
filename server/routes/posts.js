var express = require('express');
var router = express.Router();
var db = require('../models');
var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true });

var loginCheck = function(req, res, next){
    if(req.user){
        next();
    }else{
        res.redirect('/users/login');
    }
}

router.get('/:page', csrfProtection, (req, res) => {
    let limit = 4;   // number of records per page
    let offset = 0;
    db.posts.findAndCountAll()
    .then((data) => {
      let page = req.params.page;      // page number
      let pages = Math.ceil(data.count / limit);
          offset = limit * (page - 1);
      db.posts.findAll({
        limit: limit,
        offset: offset
      })
      .then(function(posts){
        res.render('posts', {
            posts: posts,
            current: page,
            pages: pages,
            csrfToken : req.csrfToken()
        })
      })
    })
});

router.post('/write', loginCheck, csrfProtection, function(req, res){
    db.posts.create({
        headerName : req.body.headerName,
        content : req.body.content,
        userId : req.user.displayName
    })
    .then(function(){
        res.redirect('/posts/1');
    })
})

router.post('/comments', loginCheck, function(req, res){
    db.posts.update({
        comment : req.body.comment
    }, { where : { id : req.body.post_id }})
    .then(function(){
        res.redirect('/posts/1');
    })
})

module.exports = router;