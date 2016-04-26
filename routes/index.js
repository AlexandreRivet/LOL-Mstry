var express =   require('express'),
    riot    =   require('lol-riot-api-module');

var test = require("../data-test.json");

var api = new riot({
    key: test.API_KEY,
    region: test.region
});

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("index", {});
});

/*
 *  Method: POST
 *  URL: /data/summoner/name
 *  Params:
 *      ->  summonerName  | Name of the summoner
 *      ->  region        | Region of the summoner
 *  Desc.: Returns basic details about a summoner based on its name and its region
 */
router.post('/data/summoner/name', function(req, res, next) {

    var params = {
        "names": req.body.summonerName,
        "region": req.body.region
    };

    api.getSummonersByNames(params).then(function(data){
        var out = data[Object.keys(data)[0]];
        console.log(out);
        res.status(200).send(out);
    });
});

module.exports = router;