var summonerRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "/data/summoner",
	done: function (response) {

		SUMMONER_INFO = response;
		console.log(SUMMONER_INFO);

		// Update info from the first request
		championMasteryRequest.params.data.region = summonerRequest.params.data.region;
		championMasteryRequest.params.data.summonerId = SUMMONER_INFO.id;
		rankedRequest.params.data.region = summonerRequest.params.data.region;
		rankedRequest.params.data.summonerId = SUMMONER_INFO.id;

	},
	fail: function (response) {

		console.log(response);

	},
	data: {
		'region': REGION,
		'summonerName': SUMMONER_NAME
	}

});

var championMasteryRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "/data/champion-mastery/all",
	done: function (response) {

		SUMMONER_MASTERIES = response;

	},
	fail: function (response) {

		LOADING_STATE["Summoner"] = 2;
		
	},
	data: {
		'region': REGION,
		'summonerId': null
	}
});

var rankedRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "/data/ranked-stats",
	done: function (response) {

		SUMMONER_RANKED = response;

	},
	fail: function (response) {

		LOADING_STATE["RankedStats"] = 2;

	},
	data: {
		'region': REGION,
		'summonerId': null
	}
});

var leaderboardRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "/data/leaderboard-champions",
	done: function (response) {

		LEADERBOARD_INFO = response;
		LEADERBOARD_INFO.sort(function(a, b) {
			if(a.champion.key < b.champion.key) return -1;
    		if(a.champion.key > b.champion.key) return 1;
    		return 0;
		});
		
	},
	fail: function (response) {

	}
});

function loadSummoner(region, summonerName) {

	summonerRequest.params.data.region = region || REGION;
	summonerRequest.params.data.summonerName = summonerName || SUMMONER_NAME;

	var rm = new RequestModule();

	rm.addToQueue(summonerRequest, 1);
	rm.addToQueue(championMasteryRequest, 2);
	rm.addToQueue(rankedRequest, 2);
	rm.launch();

}