var CarsDAO = require('../controllers/cars').CarsDAO;
var sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    var cars = new CarsDAO(db);

    this.displayMainPage = function(req, res, next) {
        "use strict";
        res.render('landing_page', {
            title: 'blog homepage',
        });
    }

    this.addPhoto = function(req, res, next) {
        "use strict";

        console.log("add photo called");

        var imageURL = req.body.name;
        //var image = req.body.image;

        console.log(imageURL);

        cars.insertEntry(imageURL, function(err, permalink) {
            "use strict";
            if (err) return next(err);

            cars.getCars(function(err, results) {
                if (err) return next(err);
                return res.render('landing_page', {
                    mycars: results
                });
            });
        });
    }
}

module.exports = ContentHandler;
