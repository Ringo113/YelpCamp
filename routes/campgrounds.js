const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');
const isLoggedIn = require('../middleware/isLoggedIn');
const isAuthor = require('../middleware/isAuthor');

// INDEX: view all campgrounds
router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
});

// NEW: show form to create campground (only if logged in)
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new');
});

// CREATE: save new campground to DB (only if logged in)
router.post('/', isLoggedIn, upload.single('image'), async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.image = req.file.path;
  campground.author = req.user._id;
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// SHOW: view one campground with populated reviews + authors
router.get('/:id', async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: { path: 'author' }
    })
    .populate('author');

  res.render('campgrounds/show', { campground });
});

// EDIT: show edit form (only if logged in AND is author)
router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
});

// UPDATE: save changes (only if logged in AND is author)
router.put('/:id', isLoggedIn, isAuthor, upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

  if (req.file) {
    campground.image = req.file.path;
  }

  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

// DELETE: remove campground (only if logged in AND is author)
router.delete('/:id', isLoggedIn, isAuthor, async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  res.redirect('/campgrounds');
});

module.exports = router;
