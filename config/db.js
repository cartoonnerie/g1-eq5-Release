const mongoose = require('mongoose');
let config = require('config'); //we load the db location from the JSON files

function connectToDB(){
    const url = config.DBUrl + ':' + config.DBPort + '/' + config.DBHost;
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true,  useCreateIndex: true});
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        console.log("MongoDB database connection established successfully");
    });
}
module.exports = {
    connectToDB
};
