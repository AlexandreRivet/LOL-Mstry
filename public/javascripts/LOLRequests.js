var summonerRequest = new RequestObject({
	type: "GET",
	dataType: "json",
	url: "route_url",
	done: function (response) {
		
		SUMMONER_INFO = response;
		
	},
	fail: function (response) {
		console.log(response);
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