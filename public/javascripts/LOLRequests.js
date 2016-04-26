var summonerRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "/data/summoner",
	done: function (response) {
		
		SUMMONER_INFO = response;
		
		debugger;
		
	},
	fail: function (response) {
		console.log(response);
	},
	data:  {
		'region' : REGION,
		'summonerName' : SUMMONER_NAME
	}
	
});

var championMasteryRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "route_url",
	done: function (response) {
		console.log(response);
	},
	fail: function (response) {
		console.log(response);
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
	}
});

function loadSummoner(region, summonerName)
{
	summonerRequest.data.region = region || REGION;
	summonerRequest.data.summonerName = summonerName || SUMMONER_NAME;
	
	RM.addToQueue(summonerRequest, 1);
	RM.addToQueue(championMasteryRequest, 2);
	RM.addToQueue(rankedRequest, 2);
	RM.launch();
	
}