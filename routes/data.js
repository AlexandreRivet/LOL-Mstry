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

/*
 *  Method: GET
 *  URL: /data/champion-mastery/all
 *  Params:
 *      ->  summonerId    | ID of the summoner
 *      ->  region        | Region of the summoner
 *  Sample request: /data/champion-mastery/all?summonerId=36522458&region=EUW
 *  Desc.: Returns all champion masteries earned by a summoner based on his ID and his region
 */
router.get('/champion-mastery/all', function(req, res, next) {
    var summonerId = req.query.summonerId;
    var region = req.query.region;

    req.checkQuery('summonerId', 'Summoner ID must contain only numbers').isNumeric();

    req.query.region = req.query.region.toUpperCase();
    req.checkQuery('region', 'Region is invalid').notEmpty().isAlpha().isIn(all_regions);

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(util.inspect(errors));
    } else {

        var params = {
            "id": req.query.summonerId,
            "region": req.query.region
        };

        api.getChampionMastery(params, function (err, data) {
            if(err) {
                res.status(err.error).send(err);
                return;
            }

            var out = data;
            res.status(200).send(out);
        });
    }
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
router.get('/ranked-stats', function(req, res, next) {

    var summonerId = req.query.summonerId;
    var region = req.query.region;

    req.checkQuery('summonerId', 'Summoner ID must contain only numbers').isNumeric();

    req.query.region = req.query.region.toUpperCase();
    req.checkQuery('region', 'Region is invalid').notEmpty().isAlpha().isIn(all_regions);

    var errors = req.validationErrors();
    if (errors) {
        res.status(400).send(util.inspect(errors));
    } else {
        var params = {
            "id": req.query.summonerId,
            "region": req.query.region
        };

        api.getRankedStatsBySummonerId(params, function (err, data) {
            if (err) {
                res.status(err.error).send(err);
                return;
            }

            var out = data;
            res.status(200).send(out);
        });
    }
});

module.exports = router;