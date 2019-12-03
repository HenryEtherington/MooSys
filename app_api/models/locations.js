const mongoose = require('mongoose');


const reviewSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  reviewText: {
    type: String,
    required: true
  },
  createdOn: {
    type: Date,
    'default': Date.now
  }
});

const locationSchema = new mongoose.Schema({
  movie: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  synopsis: String,
  rating: {
    type: Number,
    'default': 0,
    min: 0,
    max: 5
  },

  youtubeLink: {
    type: String,
  },


  coords: {
    type: [Number],
    index: '2dsphere'
  },


  reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);
