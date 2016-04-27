var summonerRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "/data/summoner",
	done: function (response) {

		SUMMONER_INFO = response;

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
		console.log(response);
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
	url: "route_url",
	done: function (response) {
		console.log(response);
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

	RM.addToQueue(summonerRequest, 1);
	RM.addToQueue(championMasteryRequest, 2);
	RM.addToQueue(rankedRequest, 2);
	RM.launch();

}