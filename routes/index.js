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
 *  URL: /
 *  Desc.: Root route (Just wanted to write something like this. Funny, isn't it ?)
 */
router.get('/', function(req, res, next) {

    var query = req.query;

    if(req.query.error) {
        res.render("index", {error: query});
    } else {
        res.render("index", {});
    }
});

/*
 *  Method: GET
 *  URL: /summoner/{region}/{summonerName}
 *  Params:
 *      ->  summonerName  | Name of the summoner
 *      ->  region        | Region of the summoner
 *  Sample request: /summoner/euw/No%20TT
 *  Desc.: Render template and basic details about a summoner based on its name and its region
 */
router.get('/summoner/:region/:summonerName', function(req, res, next) {
    var summonerName = req.params.summonerName;
    var region = req.params.region;

    req.sanitizeParams('summonerName').blacklist(" ");
    req.checkParams('summonerName', '').isLength(3, 16);

    req.params.region = req.params.region.toUpperCase();
    req.checkParams('region', '').notEmpty().isAlpha().isIn(all_regions);

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.redirect("/?error=400&summonerName=" + summonerName + "&region=" + region );
    } else {

		summonerName = decodeURIComponent(summonerName);
		
        var params = {
            "names": summonerName,
            "region": region
        };

        api.getSummonersByNames(params, function (err, data) {
            if(err) {
                res.redirect("/?error=404&summonerName=" + summonerName + "&region=" + region );
                return;
            }

            var out = data[Object.keys(data)[0]];
            out.region = region;

            res.render('summoner', out);
        });
    }
});

module.exports = router;