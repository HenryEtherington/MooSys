const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const _buildLocationList = function(req, res, results, stats) {
  let locations = [];
  results.forEach((doc) => {
    locations.push({
      distance: doc.dis,
      title: doc.obj.title,
      youtubeLink: doc.obj.youtubeLink,
      movie: doc.obj.movie,
      synopsis: doc.obj.synopsis,
      rating: doc.obj.rating,
      _id: doc.obj._id
    });
  });
  return locations;
};

const locationsListByDistance = function (req, res) {
  const lng = parseFloat(req.query.lng);
  const lat = parseFloat(req.query.lat);
  const maxDistance = parseFloat(req.query.maxDistance);
  const point = {
    type: "Point",
    coordinates: [lng, lat]
  };
  const geoOptions = {
    spherical: true,
    maxDistance : 8200000,
    num: 10
  };
  if ((!lng && lng !==0 ) || (!lat && lat !== 0) || !maxDistance) {
    console.log('locationsListByDistance missing params');
    res
      .status(404)
      .json({
        message : 'lng, lat and maxDistance query parameters are all required'
      });
    return;
  }
  Loc.geoNear(point, geoOptions, (err, results, stats) => {
    const locations = _buildLocationList(req, res, results, stats);
    console.log('Geo Results', results);
    console.log('Geo stats', stats);
    res
      .status(200)
      .json(locations);
  });
};

const locationsCreate = function (req, res) {
  Loc.create({
    movie: req.body.movie,
    youtubeLink: req.body.youtubeLink,
    title: req.body.title,
    synopsis: req.body.synopsis,
    coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],

  }, (err, location) => {
    if (err) {
      res
        .status(400)
        .json(err);
    } else {
      res
        .status(201)
        .json(location);
    }
  });
};

const locationsReadOne = function (req, res) {
  if (req.params && req.params.locationid) {
    Loc
      .findById(req.params.locationid)
      .exec((err, location) => {
        if (!location) {
          res
            .status(404)
            .json({
              "message": "locationid not found"
            });
          return;
        } else if (err) {
          res
            .status(404)
            .json(err);
          return;
        }
        res
          .status(200)
          .json(location);
      });
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid in request"
      });
  }
};

const locationsUpdateOne = function (req, res) {
  if (!req.params.locationid) {
    res
      .status(404)
      .json({
        "message": "Not found, locationid is required"
      });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('-reviews -rating')
    .exec((err, location) => {
      if (!location) {
        res
          .json(404)
          .status({
            "message": "locationid not found"
          });
        return;
      } else if (err) {
        res
          .status(400)
          .json(err);
        return;
      }
      location.movie = req.body.movie;

      location.title = req.body.title;
      location.synopsis= req.body.synopsis;
      location.youtubeLink=req.body.synopsis;
        location.coords = [
        parseFloat(req.body.lng),
        parseFloat(req.body.lat)
      ];

      location.save((err, location) => {
        if (err) {
          res
            .status(404)
            .json(err);
        } else {
          res
            .status(200)
            .json(location);
        }
      });
    }
  );
};

const locationsDeleteOne = function (req, res) {
  const locationid = req.params.locationid;
  if (locationid) {
    Loc
      .findByIdAndRemove(locationid)
      .exec((err, location) => {
          if (err) {
            res
              .status(404)
              .json(err);
            return;
          }
          res
            .status(204)
            .json(null);
        }
    );
  } else {
    res
      .status(404)
      .json({
        "message": "No locationid"
      });
  }
};

module.exports = {
  locationsListByDistance,
  locationsCreate,
  locationsReadOne,
  locationsUpdateOne,
  locationsDeleteOne
};
