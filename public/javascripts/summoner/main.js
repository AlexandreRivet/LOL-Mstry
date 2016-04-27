var LAST_LEVEL = -1;
var MAX_LEVEL = 5;

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

	for (var i = 0; i < SUMMONER_MASTERIES.length; ++i) {

		addChampionMastery(SUMMONER_MASTERIES[i]);

	}
	
    $('ul.tabs').tabs();
	$('.collapsible').collapsible({
      		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
	});

}

function addTopMastery(champion) {

}

function addChampionMastery(champion) {

	var currentLevel = champion.championLevel;
	
	// Different level (we do this here because riot will probably add others levels and better dynamically)
	if (currentLevel != LAST_LEVEL) {
	
		// If a summoner don't have any champion for max level
		if (LAST_LEVEL == -1 && currentLevel != MAX_LEVEL) {
			
			for (var i = MAX_LEVEL; i > currentLevel; --i) {
			
				$('#championMasteries_tab').append('<li class="tab col s3 disabled"><a href="#cmTab_' + i + '">Mastery ' + i + '</a></li>');
			
			}
			
		} else if (LAST_LEVEL != -1) {
		
			// We complete for missing levels
			for (var i = LAST_LEVEL - 1; i > currentLevel; --i) {
		
				$('#championMasteries_tab').append('<li class="tab col s3 disabled"><a href="#cmTab_' + i + '">Mastery ' + i + '</a></li>');
			
			}
			
		}
		
		LAST_LEVEL = currentLevel;
		
		// We add new level
		$('#championMasteries_tab').append('<li class="tab col s3"><a href="#cmTab_' + currentLevel + '">Mastery ' + currentLevel + '</a></li>');
		$('#championMasteries_container').append('<div id="cmTab_' + currentLevel + '" class="col s12"><ul id="cmExpendable' + currentLevel + '" class="collapsible" data-collapsible="expandable"></ul></div>');
		
	}
	
	var str = '<li>';

	str += '<div class="collapsible-header"><i class="material-icons">filter_drama</i>' + champion.championId + ' - ' + champion.championPoints + ' - ' + (checkVariable(champion.highestGrade) ? champion.highestGrade : "")  + '</div>';
	str += '<div class = "collapsible-body"> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p></div>';

	str += '</li>';

	$('#cmExpendable' + currentLevel).append(str);
	$('#championMasteries_container').show();

}