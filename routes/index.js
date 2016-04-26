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
 *  URL: /data/region/{region}/summoner/{summonerName}
 *  Params:
 *      ->  summonerName  | Name of the summoner
 *      ->  region        | Region of the summoner
 *  Desc.: Returns basic details about a summoner based on its name and its region
 */
router.get('/data/region/:region/summoner/:summonerName', function(req, res, next) {

    var params = {
        "names": req.params.summonerName,
        "region": req.params.region
    };

    console.log(params);

    api.getSummonersByNames(params).then(function(data){
        var out = data[Object.keys(data)[0]];
        res.status(200).send(out);
    });

});

module.exports = router;