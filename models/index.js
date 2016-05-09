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
        'tags'              :   [String],
        'status'            : {
            'rankedPlayEnabled': Boolean,
            'botEnabled': Boolean,
            'active': Boolean,
            'freeToPlay': Boolean,
            'botMmEnabled': Boolean
        }
    });
	
	var score = new Schema({
		'id'				:	Number,
		'summonerName'		:	String,
		'region'			:	String,
		'score'				:	Number
	});
    
    var models = {
        Champion : db.model('Champion', champion, 'champions'),
		Score : db.model('Score', score, 'scores')
    };

    return models;
}