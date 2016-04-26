$(document).init(function () {

	RM = new RequestModule();
	
	RM.addToQueue(summonerRequest, 1);
	RM.addToQueue(championMasteryRequest, 2);
	RM.addToQueue(rankedRequest, 2);
	RM.launch();

});