const request = require('request');
const apiOptions = {
  server : 'http://localhost:3000'};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = 'https://moo-reviews.herokuapp.com/';
}

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
    try {
      _renderHomepage(req, res, data);
    }
          catch {
            _showError(req, res, response.statusCode);
          }
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
    try {
       _renderInformationPage(req, res, data);7
    }
          catch {
            _showError(req, res, response.statusCode);
          }
    }
  );
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

/*const locationInfo = function(req, res){
  const path = `/api/locations/${req.params.locationid}`;
  requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {}
  };
  request(requestOptions,(err, response, body) => {
    let data = body;
    data.coords = {
      lng : body.coords[0],
      lat : body.coords[1]
    };

        _renderDetailPage(req, res, data);
      }
  );
};*/
const doAddReview = function(req, res){
  const locationid = req.params.locationid;
  const path = `/api/locations/${locationid}/reviews`;
  const postdata = {
    author: req.body.name,
    rating: req.body.rating,
    reviewText: req.body.review
  };
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'POST',
    json : postdata
  };
  request( requestOptions,(err, response, body) => {
        if (response.statusCode === 201) {
          res.redirect(`/location/${locationid}`);
        } else {
          _showError(req, res, response.statusCode);
        }
      }
  );
};



const _renderReviewForm = function (req, res, locDetail) {
  try {res.render('location-review-form', {
    title: `Review ${locDetail.movie} on Loc8r`,
    pageHeader: { title: `Review ${locDetail.movie}` }
  });
} catch{
    _showError(req, res, response.statusCode);
  }
};

/* GET 'Add review' page */

const _getLocationInfo = function (req, res, callback) {
  const path = `/api/locations/${req.params.locationid}`;
  const requestOptions = {
    url : apiOptions.server + path,
    method : 'GET',
    json : {}
  };
  request(requestOptions,(err, response, body) => {
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
const locationInfo = function(req, res){
  _getLocationInfo(req, res, (req, res, responseData) => {
    try {
      _renderDetailPage(req, res, responseData);
    }

    catch {
      _showError(req, res, response.statusCode);
    }
  });
};
const addReview = function(req, res){
  res.render('location-review-form', {
    title: 'Review Starcups on MooSys',
    pageHeader: { title: 'Review movie' }
  });
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




/* GET 'Add review' page */
module.exports = {
  homelist,
  informationlist,
  locationInfo,
  doAddReview,
  addReview,
  _showError
};
