var summoners 	= 	 new Array(100000000);
var ranks		=	 {};

var schedule    =    require('node-schedule');
var riot		=    require('lol-riot-api-module');

var config 		= 	 require('../data-test.json');
var models      =    require('../models');

var maxPlayers  = 	 1000;
var currentPlayers = 0;
var intervalId = null;

var api = new riot({
    key: config.API_KEY,
    region: config.region
});

var rule = new schedule.RecurrenceRule();
rule.hour = 0;

var start = null;

var j = schedule.scheduleJob(rule, function(){
    
	start = new Date().getTime();
	
	intervalId = setInterval(checkEnd, 5000);
	
	lookForSummoner(32669392);
	
});

function checkEnd()
{
	if (currentPlayers > maxPlayers)
	{
		console.log(ranks);
		console.log( ((new Date().getTime()) - start) + 'ms');
		clearInterval(intervalId);
	}	
}


function lookForSummoner(summonerId) {
	
	if (currentPlayers > maxPlayers)
		return;
				
	// Summoner already treated
	if (summoners[summonerId] != undefined && summoners[summonerId] != null && summoners[summonerId] == true)
		return;
	
	// We tag summoner is treated
	summoners[summonerId] = true;
	currentPlayers++;

	var params = {
		"id": summonerId,
		"region": api.region
    };
	
    api.getChampionMastery(params, function (err, data) {
		
		if(err)	
			return;

		// Update top player for each champion
		for (var i = 0, dataLen = data.length; i < dataLen; i++) {
		
			var champion = data[i];
			var championId = champion.championId;
			var championPoints = champion.championPoints;
			
			if ( (ranks[championId] == undefined) || (ranks[championId] == null) ) {
				
				ranks[championId] = {
					'summonerId' : summonerId,
					'championPoints' : championPoints
				};
				
			} else if (championPoints > ranks[championId].championPoints) {
			
				ranks[championId].summonerId = summonerId;
				ranks[championId].championPoints = championPoints;
				
			}
			
		}
		
		var opts = {
			"id": summonerId,
			"region": api.region,
			"beginIndex": "0",
			"endIndex": "2"
		};
		
		// Get 10 matches from summoner
		api.getMatchListBySummonerId(opts, function(error, result) {
			
			if (error)
				return;
			
			var matches = result.matches;
			
			for (var j = 0, matchesLen = matches.length; j < matchesLen; j++)
			{
				var match = matches[j];
				
				var matchParams = {
					"id": match.matchId,
					"region": api.region
				};
				
				api.getMatchById(matchParams, function(matchError, matchResult) {
					
					if (matchError)
					{
						console.log(matchError);
						return;
					}
					
					var players = matchResult.participantIdentities;
					
					for (var k = 0, playersLen = players.length; k < playersLen; k++)
					{
						var player = players[k].player;
						var newSummonerId = player.summonerId;
						lookForSummoner(newSummonerId);
					}
					
				});
				
			}
			
		});
		
	});
	
}