var LAST_LEVEL = -1;
var MAX_LEVEL = 5;
var FIRST_ACTIVE = false;

$(document).init(function () {

	$('.button-collapse').sideNav();

	// Update request
	championMasteryRequest.params.data.region = SUMMONER_INFO.region;
	championMasteryRequest.params.data.summonerId = SUMMONER_INFO.id;

	rankedRequest.params.data.region = SUMMONER_INFO.region;
	rankedRequest.params.data.summonerId = SUMMONER_INFO.id;

	// launch requests
	championMasteryRequest.execute(updateInterface);
	rankedRequest.execute();
});

function updateInterface()
{
	updateSummoner();
	updateMasteries();
	
}

function updateSummoner() {

	$('#summonerInfo_loader').hide();	
	
	// Sum of all championLevel
	var masteriesPoint = 0;
	for (var i = 0; i < SUMMONER_MASTERIES.length; ++i) {

		masteriesPoint += SUMMONER_MASTERIES[i].championLevel;

	}
	
	$('#summonerInfo_sumChampionLevel').html("Total: " + masteriesPoint);
	
	initRankedGraph();
	
	$('#summonerInfo_container').show();
	
}

function updateMasteries() {

	$('#championMasteries_loader').hide();

	for (var i = 0; i < SUMMONER_MASTERIES.length; ++i) {

		addChampionMastery(SUMMONER_MASTERIES[i]);

	}
	
	$('#championMasteries_container').show();
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
		if (!FIRST_ACTIVE) {
		
			$('#championMasteries_tab').append('<li class="tab col s3"><a href="#cmTab_' + currentLevel + '" class="active">Mastery ' + currentLevel + '</a></li>');
			FIRST_ACTIVE = true;
			
		} else {
			
			$('#championMasteries_tab').append('<li class="tab col s3"><a href="#cmTab_' + currentLevel + '">Mastery ' + currentLevel + '</a></li>');
			
		}
		
		
		$('#championMasteries_container').append('<div id="cmTab_' + currentLevel + '" class="col s12"><ul id="cmExpendable' + currentLevel + '" class="collapsible col s10 offset-s1" data-collapsible="expandable"></ul></div>');
		
	}
	
	var str = '<li>';

	str += '<div class="collapsible-header"><i class="material-icons">filter_drama</i>' + champion.championId + ' - ' + champion.championPoints + ' - ' + (checkVariable(champion.highestGrade) ? champion.highestGrade : "")  + '</div>';
	str += '<div class = "collapsible-body"> <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p></div>';

	str += '</li>';

	$('#cmExpendable' + currentLevel).append(str);

}