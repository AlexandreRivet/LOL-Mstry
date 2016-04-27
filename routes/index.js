var express =   require('express'),
    riot    =   require('lol-riot-api-module'),
    util    =   require('util');

var test = require("../data-test.json");

var api = new riot({
    key: test.API_KEY,
    region: test.region
});

var all_regions = ["BR", "EUNE", "EUW", "JP", "KR", "LAN", "LAS", "NA", "OCE", "RU", "TR"];

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render("index", {});
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
    /*var params = {
        "id": req.query.summonerId,
        "region": req.query.region
    };

    api.getChampionMastery(params).then(function(data){
        var out = data;
        res.status(200).send(out);
    });*/
});

/*
 *  Method: GET
 *  URL: /data/ranked-stats
 *  Params:
 *      ->  summonerId    | ID of the summoner
 *      ->  region        | Region of the summoner
 *  Sample request: /data/ranked-stats?summonerId=36522458&region=EUW
 *  Desc.: Returns all ranked stats about a summoner based on his id and his region
 */
router.get('/data/ranked-stats', function(req, res, next) {

    var params = {
        "id": req.query.summonerId,
        "region": req.query.region
    };

    api.getRankedStatsBySummonerId(params).then(function(data){
        var out = data;
        res.status(200).send(out);
    });
});


/*
 *  Method: GET
 *  URL: /summoner/{region}/{summonerName}
 *  Params:
 *      ->  summonerName  | Name of the summoner
 *      ->  region        | Region of the summoner
 *  Sample request: /data/summoner?summonerName=No%20TT&region=EUW
 *  Desc.: Returns basic details about a summoner based on its name and its region
 */
router.get('/summoner/:region/:summonerName', function(req, res, next) {
    var summonerName = req.params.summonerName;
    var region = req.params.region;

    req.sanitizeParams('summonerName').blacklist(" ");
    req.checkParams('summonerName', 'Length of summoner name must be between 3 and 16 characters').notEmpty().isLength(3, 16);

    req.params.region = req.params.region.toUpperCase();
    req.checkParams('region', 'Region is invalid').notEmpty().isAlpha().isIn(all_regions);

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(util.inspect(errors));
    } else {

        var params = {
            "names": summonerName,
            "region": region
        };

        api.getSummonersByNames(params, function (err, data) {
            if(err) {
                res.status(err.error).send(err);
            }

            var out = data[Object.keys(data)[0]];
            out.region = region;

            res.render('summoner', out);
        });
    }
});

module.exports = router;