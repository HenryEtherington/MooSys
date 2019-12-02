const request = require('request');
const apiOptions = {
  server : 'http://localhost:3000'
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = '';
}

// PUBLIC EXPOSED METHODS

/* GET 'home' page */
const homelist = function(req, res){
  const path = '/api/locations';
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
    qs : {
      lng : 9.6999,
      lat : 52.2713,
      maxDistance : 8200000
    }
  };


  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      if (response.statusCode === 200 && data.length) {
        for (let i = 0; i < data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      _renderHomepage(req, res, data);
    }
  );
};

/* GET 'home' page */
const informationlist = function(req, res){
  const path = '/api/locations';
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {},
    qs : {
      lng : 9.6999,
      lat : 52.2713,
      maxDistance : 8200000
    }
  };


  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      if (response.statusCode === 200 && data.length) {
        for (let i = 0; i < data.length; i++) {
          data[i].distance = _formatDistance(data[i].distance);
        }
      }
      _renderInformationPage(req, res, data);
    }
  );
};

/* GET 'Location info' page */
const locationInfo = function(req, res){
  _getLocationInfo(req, res, (req, res, responseData) => {
    console.log(responseData);
    _renderDetailPage(req, res, responseData);
  });
};


  /* GET 'Add review' page */
  const addReview = function(req, res){
    res.render('location-review-form', {
      title: 'Review Starcups on MooSys',
      pageHeader: { title: 'Review movie' }
    });
  };

const doAddReview = function(req, res) {
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: req.body.movie,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postdata
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
    res.redirect(`/location/${locationid}/review/new?err=val`);
  } else {
    request(
      requestOptions,
      (err, response, body) => {
        if (response.statusCode === 201) {
          res.redirect(`/location/${locationid}`);
        } else if (response.statusCode === 400 && body.movie && body.movie === 'ValidationError' ) {
          res.redirect(`/location/${locationid}/review/new?err=val`);
        } else {
          _showError(req, res, response.statusCode);
        }
      }
    );
  }
};

// PRIVATE METHODS
const _getLocationInfo = function(req, res, callback) {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {}
  };
  request(
    requestOptions,
    (err, response, body) => {
      let data = body;
      if (response.statusCode === 200) {
        data.coords = {
          lng : body.coords[0],
          lat : body.coords[1]
        };
        callback(req, res, data);
      } else {
        _showError(req, res, response.statusCode);
      }
    }
  );
};

const _renderHomepage = function(req, res, responseBody){
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render('locations-list', {
    title: 'MooSys - find new movies and review them',
    pageHeader: {
      title: 'MooSys',
      strapline: 'Find distance for main filming location'
    },
    locations: responseBody,
    message: message
  });
};

const _renderInformationPage = function(req, res, responseBody){
  let message = null;
  if (!(responseBody instanceof Array)) {
    message = 'API lookup error';
    responseBody = [];
  } else {
    if (!responseBody.length) {
      message = 'No places found nearby';
    }
  }
  res.render('information', {
    title: 'MooSys - find new movies and review them',
    pageHeader: {
      title: 'MooSys',
      strapline: 'Find reviews for latest films'
    },
    locations: responseBody,
    message: message
  });
};

const _renderDetailPage = function(req, res, locDetail) {
  res.render('location-info', {
    title: locDetail.movie,
    pageHeader: {
      title: locDetail.movie
    },
    sidebar: {
      context: 'is on MooSys because it is great for finding movie reviews.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
    },
    location: locDetail
  });
};

const _renderReviewForm = function(req, res, locDetail) {
  res.render('location-review-form', {
    title: `Review ${locDetail.movie} on MooSys`,
    pageHeader: { title: `Review ${locDetail.movie}` },
    error: req.query.err
  });
};

const _isNumeric = function (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const _formatDistance = function (distance) {
  if (distance && _isNumeric(distance)) {
    let thisDistance = 0;
    let unit = 'm';
    if (distance > 1000) {
      thisDistance = parseFloat(distance / 1000).toFixed(1);
      unit = 'km';
    } else {
      thisDistance = Math.floor(distance);
    }
    return thisDistance + unit;
  } else {
    return '?';
  }
};

const _showError = function (req, res, status) {
  let title = '';
  let content = '';
  if (status === 404) {
    title = '404, page not found';
    content = 'Oh dear. Looks like we can\'t find this page. Sorry.';
  } else {
    title = `${status}, something's gone wrong`;
    content = 'Something, somewhere, has gone just a little bit wrong.';
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};



module.exports = {
  homelist,
  informationlist,
  locationInfo,
  addReview,
  doAddReview
};
