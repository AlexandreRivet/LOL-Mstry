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
 *  Method: GET
 *  URL: /data/summoner
 *  Params:
 *      ->  summonerName  | Name of the summoner
 *      ->  region        | Region of the summoner
 *  Sample request: /data/summoner?summonerName=No%20TT&region=EUW
 *  Desc.: Returns basic details about a summoner based on its name and its region
 */
router.get('/data/summoner', function(req, res, next) {

    var params = {
        "names": req.query.summonerName,
        "region": req.query.region
    };

    api.getSummonersByNames(params).then(function(data){
        var out = data[Object.keys(data)[0]];
        res.status(200).send(out);
    });
});

/*
 *  Method: GET
 *  URL: /data/champion-mastery/all
 *  Params:
 *      ->  summonerId    | ID of the summoner
 *      ->  region        | Region of the summoner
 *  Sample request: /data/champion-mastery/all?summonerId=36522458&region=EUW
 *  Desc.: Returns all champion masteries earned by a summoner based on his ID and his region
 */
router.get('/data/champion-mastery/all', function(req, res, next) {

    var params = {
        "id": req.query.summonerId,
        "region": req.query.region
    };

    api.getChampionMastery(params).then(function(data){
        var out = data;
        res.status(200).send(out);
    });
});
module.exports = router;