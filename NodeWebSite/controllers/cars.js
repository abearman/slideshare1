/* The PostsDAO must be constructed with a connected database object */
function CarsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof CarsDAO)) {
        console.log('Warning: CarsDAO constructor called without "new" operator');
        return new CarsDAO(db);
    }

    var cars = db.collection("vehicles");

    this.insertEntry = function (URL, callback) {
        "use strict";
        console.log("inserting vehicle entry " + URL);

        // fix up the permalink to not include whitespace
        var permalink = URL.replace( /\s/g, '_' );
        permalink = permalink.replace( /\W/g, '' );
    
        // Build a new car
        var car = {
            "URL": URL
        }

        // now insert the car
        // hw3.2 TODO
        cars.insert(car, function (err, result) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Inserted new car");
            callback(err);
        });
    }

    //hw4.3 TODO: blog front page
    this.getCars = function(callback) {
        "use strict";

        cars.find().toArray(function(err, items) {
            "use strict";
            if (err) return callback(err, null);
            console.log("Found " + items.length + " cars");
            callback(err, items);
        });
    }

    //hw 4.3 TODO: blog get posts by permalink (unique) 
    this.getCarByPermalink = function(permalink, callback) {
        "use strict";

	cars.ensureIndex({permalink : 1}, function(err) {
	  if (err) throw err;
	});

        cars.findOne({'permalink': permalink}, function(err, car) {
            "use strict";

            if (err) return callback(err, null);

            callback(err, car);
        });
    }

}

module.exports.CarsDAO = CarsDAO;
