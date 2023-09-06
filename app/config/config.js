const mongoose = require('mongoose');

let db;
mongoose.set("strictQuery", false);

try {
    db = mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    });
} catch (error) {
    return console.log(`Unable to connect \n\n ${error}`);
}

module.exports = db;