$(document).init(function () {

	$('.button-collapse').sideNav();

	// Update request
	championMasteryRequest.params.data.region = SUMMONER_INFO.region;
	championMasteryRequest.params.data.summonerId = SUMMONER_INFO.id;

	rankedRequest.params.data.region = SUMMONER_INFO.region;
	rankedRequest.params.data.summonerId = SUMMONER_INFO.id;

	// launch requests
	championMasteryRequest.execute(updateMasteries);
	rankedRequest.execute();
});

function updateMasteries() {

	$('#championMasteries_loader').hide();

	for (var i = 3; i < SUMMONER_MASTERIES.length; ++i) {

		addChampionMastery(SUMMONER_MASTERIES[i]);

	}

}

function addTopMastery(champion) {

}

function addChampionMastery(champion) {

	var str = '<li>';

	str += '<div class="collapsible-header"><i class="material-icons">filter_drama</i>' + champion.championId + '</div>';
	str += '<div class = "collapsible-body"> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p></div>';

	str += '</li>';

	$('#championMasteries_container').append(str);
	$('#championMasteries_container').show();

}