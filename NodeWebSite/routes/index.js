var ContentHandler = require('./content');
var ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var contentHandler = new ContentHandler(db);

    // The main page of the blog
    app.get('/', contentHandler.displayMainPage);
    app.post('/', contentHandler.addPhoto);
    
    app.get('/ss', contentHandler.displaySS);

    app.use(ErrorHandler);
}
