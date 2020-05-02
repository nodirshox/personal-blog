const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const markdown = require('marked')
const sanitizeHtml = require('sanitize-html')
const dateFormat = require('dateformat')
//Models
const Post = require('./models/Post')
const tags = [ 'b', 'i', 'em', 'strong', 'a', 'u', 'h1', 'h2', 'h3', 'h4', 'br', 'ol', 'ul', 'li', 'img' ];

// Home page
router.get('/', function(req, res) {
  Post.find({}).sort('-date').exec((err, post) => {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      res.render('home', { post })
    }
  })
})

// Add post
router.get('/new-post', function(req, res) {
  res.render('new-post')
})
router.post('/new-post', function(req, res) {
  var body = sanitizeHtml(req.body.body, {
    allowedTags: tags,
    allowedAttributes: {
      'a': [ 'href' ]
    }
  }); // sanitize req.body
  var title = sanitizeHtml(req.body.title);
  var thumbnail = sanitizeHtml(req.body.thumbnail);

  Post.create({title: title, body: body, thumbnail: thumbnail}, function(err, product) {
      if(err) {
        console.log(err)
        res.send('Xatolik yuz berdi.')
      } else {
        res.redirect('/')
      }
  })
})


// Show post by id
router.get('/post/:id', function(req, res) {
  Post.findOne({ _id: req.params.id }).exec(function(err, post) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
      var time = dateFormat(post.date, "d-mmm, HH:MM")
      var newbody = markdown(post.body)
      res.render('post-by-id',{ post, time, newbody })
    }
  })
})

// Edit by post id
router.get('/edit-post/:id', function(req, res) {
  Post.findOne({ _id: req.params.id }).exec(function(err, post) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
        res.render('edit-post',{post})
    }
  })
})
router.post('/edit-post/:id', function(req, res) {
  var body = sanitizeHtml(req.body.body, {
    allowedTags: tags,
    allowedAttributes: {
      'a': [ 'href' ]
    }
  }); // sanitize req.body
  var title = sanitizeHtml(req.body.title);
  var thumbnail = sanitizeHtml(req.body.thumbnail);
  Post.findOneAndUpdate({ _id: req.params.id }, {$set: {title: title, body: body, thumbnail: thumbnail}}, function(err, result) {
    res.redirect(`/`)
  })
})

// Delete post by id
router.get('/delete-post/:id', function(req, res) {
  Post.findByIdAndRemove({_id: req.params.id}, function(err, result) {
    if(err) {
      res.send('Xatolik yuz berdi')
    } else {
        res.redirect('/')
    }
  })
})

// Error handler
router.get('*', function(req, res) {  
    res.render('404');
});

module.exports = router