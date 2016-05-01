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

	var splash_url = '/images/champions/' + champion.champion.key + '_Splash_Centered_0.jpg';
	
	var str = '<li>';

	str += '<div class="collapsible-header white-text" style="min-height:100px;max-height:100px;line-height:inherit;background:url(' + splash_url + ');background-position:center -170px;position:relative;">';
	str += 		'<div style="position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);">';
	str +=			'<div style="position:absolute;bottom:5px;left:10px;text-align:left;"><p><span>' + champion.championPoints + '</span>';
	
	if (champion.chestGranted) {
	
		str += '<br><span><i class="material-icons" style="line-height:100%;">games</i> Chest granted</span>';
		
	}
	
	str += '</p></div>';
	
	str +=			'<div style="position:absolute;bottom:5px;right:10px;text-align:right;"><p><span style="font-size:250%;">' + champion.champion.name + '</span><br><span>' + champion.champion.title + '</span></p></div>';
	// str += 			'<i class="material-icons">games</i>' +  + '<br>' + champion.champion.title;
	str += 		'</div>';
	str += '</div>';
	str += '<div class="collapsible-body">';
	str += 		'<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>';
	str += '</div>';

	str += '</li>';

	$('#cmExpendable' + currentLevel).append(str);

}