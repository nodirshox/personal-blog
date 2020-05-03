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
router.get('/', (req, res) => {
  try {
    // Get all posts and display in homepage
    Post.find({}).sort('-date').exec((err, post) => {
      if(err) {
        res.send('Error')
      } else {
        res.render('home', { post })
      }
    })
  } catch(err) {
    res.render('error-page', { err })
  }
})

// Add a new post
router.get('/new-post', function(req, res) {
  res.render('new-post')
})
router.post('/new-post', async (req, res) => {
      if(req.body.title !== undefined && req.body.body !== undefined && req.body.thumbnail !== undefined) {
        var body = sanitizeHtml(req.body.body, {
          allowedTags: tags,
          allowedAttributes: {
            'a': [ 'href' ]
          }
        }); // sanitize req.body
        
        const post = new Post({
          title: sanitizeHtml(req.body.title),
          body: body,
          thumbnail: sanitizeHtml(req.body.thumbnail)
        })
        try {
          await post.save()
          res.redirect('/')
        } catch(err) {
          console.log(err)
          res.render('error-page', { err })
        }
      } else {
        res.render('404')
      }
        
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


// API

// Getting all posts
router.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find()
    res.json(posts)
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Get one post
router.get('/api/post/:id', getPost, (req, res) => {
  res.json(res.post)
})

// Error handler
router.get('*', function(req, res) {  
    res.render('404');
});

async function getPost(req, res, next) {
  let post
  try {
      post = await Post.findById(req.params.id)
      if(post == null) {
          return res.status(404).json({ message: 'Can not find post.' })
      }
  } catch(err) {
      res.status(500).json({ message: err.message })
  }
  res.post = post
  next()
}

module.exports = router