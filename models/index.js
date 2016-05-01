var mongoose = require('mongoose');

var config = require('../data-test.json')

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var db = mongoose.createConnection(config.mongo_url);

module.exports = function(mongoose) {
    var champion = new Schema({
        'id'	            : 	Number,
        'name'	            : 	String,
        'title'             :   String,
        'key'               :   String,
        'status'            : {
            'rankedPlayEnabled': Boolean,
            'botEnabled': Boolean,
            'active': Boolean,
            'freeToPlay': Boolean,
            'botMmEnabled': Boolean
        }
    });
    
    var models = {
        Champion : db.model('Champion', champion, 'champions'),
    };

    return models;
}