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
		console.log(SUMMONER_MASTERIES);

	},
	fail: function (response) {

		console.log(response);

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
		console.log(SUMMONER_RANKED);

	},
	fail: function (response) {

		console.log(response);

	},
	data: {
		'region': REGION,
		'summonerId': null
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