$(document).init(function () {

	$('.button-collapse').sideNav();

	// Update request
	championMasteryRequest.params.data.region = SUMMONER_INFO.region;
	championMasteryRequest.params.data.summonerId = SUMMONER_INFO.id;

	rankedRequest.params.data.region = SUMMONER_INFO.region;
	rankedRequest.params.data.summonerId = SUMMONER_INFO.id;

	// launch requests
	rankedRequest.execute(createRankedStats);
	championMasteryRequest.execute(createSummoner);
});

function createSummoner()
{
	initChampionMasteryPoints();
	initChampionMasteryGraph();
	updateMasteries();
	
	LOADING_STATE["Summoner"] = 1;
	checkLoading();
}

function createRankedStats()
{
	// Update ranked icon
	var divisions = ['I', 'II', 'III', 'IV', 'V'];
	var leagues = SUMMONER_RANKED.leagues;
	for (var i = 0, leaguesLen = leagues.length; i < leaguesLen; i++)
	{
		var league = leagues[i];
		var queue = league.queue;
		if (queue == "RANKED_SOLO_5x5") 
		{
			var tier = league.tier;
			var entries = league.entries[0];
			var division = entries.division;
			var finalDivision = '/images/medals/' + tier.toLowerCase() + '_' + (divisions.indexOf(division) + 1) + '.png';
			$('#summonerInfo_rankImg').attr('src', finalDivision);
			
			var rankInfo = tier.toPascalCase() + ' ' + (divisions.indexOf(division) + 1) + ' - ' + entries.wins + 'W' + ' ' + entries.losses + 'L';
			$('#summonerInfo_rankInfo').html(rankInfo);
			
			break;
		}
	}
	
	LOADING_STATE["RankedStats"] = 1;
	checkLoading();
}

function checkLoading()
{
	var allIsLoaded = true;
	for (var i in LOADING_STATE)
	{
		if (LOADING_STATE[i] == 0)
		{
			allIsLoaded = false;
			break;
		}
	}
	
	if (allIsLoaded)
	{
		setTimeout(function() {
			// First block
			$('#summonerInfo_loader').hide();
			$('.modal-trigger').leanModal();
			$('#summonerInfo_container').show();
		
			// Second block
			$('#championMasteries_loader').hide();
			$('#championMasteries_container').show();
    		$('ul.tabs').tabs();
			$('.collapsible').collapsible({
				accordion : false
			});
		}, 500);
	}
}

function updateMasteries() {

	for (var i = 0; i < SUMMONER_MASTERIES.length; ++i) {

		addChampionMastery(SUMMONER_MASTERIES[i]);

	}

}

function addChampionMastery(champion) {

	var currentLevel = champion.championLevel;
	
	// Different level (we do this here because riot will probably add others levels and better dynamically)
	if (currentLevel != LAST_LEVEL) {
	
		// If a summoner don't have any champion for max level
		if (LAST_LEVEL == -1 && currentLevel != MAX_LEVEL) {
			
			for (var i = MAX_LEVEL; i > currentLevel; --i) {
			
				$('#championMasteries_tab').append('<li class="tab col s3 disabled"><a href="#cmTab_' + i + '"><img src="/images/mastery-' + i +'.png" /></a></li>');
			
			}
			
		} else if (LAST_LEVEL != -1) {
		
			// We complete for missing levels
			for (var i = LAST_LEVEL - 1; i > currentLevel; --i) {
		
				$('#championMasteries_tab').append('<li class="tab col s3 disabled"><a href="#cmTab_' + i + '"><img src="/images/mastery-' + i +'.png" /></a></li>');
			
			}
			
		}
		
		LAST_LEVEL = currentLevel;
		
		// We add new level
		if (!FIRST_ACTIVE) {
		
			$('#championMasteries_tab').append('<li class="tab col s3"><a href="#cmTab_' + currentLevel + '" class="active"><img src="/images/mastery-' + currentLevel +'.png" /></a></li>');
			FIRST_ACTIVE = true;
			
		} else {
			
			$('#championMasteries_tab').append('<li class="tab col s3"><a href="#cmTab_' + currentLevel + '"><img src="/images/mastery-' + currentLevel +'.png" /></a></li>');
			
		}
		
		
		$('#championMasteries_container').append('<div id="cmTab_' + currentLevel + '" class="col s12"><ul id="cmExpendable' + currentLevel + '" class="collapsible col s10 offset-s1" data-collapsible="expandable"></ul></div>');
		
	}

	var splash_url = '/images/champions/' + champion.champion.key + '_Splash_Centered_0.jpg';
	var stats = getRankedStatChampionFromId(champion.championId);
	
	var str = '<li>';

	str += '<div class="collapsible-header white-text" style="background:url(' + splash_url + ');background-position:center -170px;">';
	str += 		'<div class="collapsible-header-black-mask">';
	str +=			'<div class="collapsible-header-left-section"><p><span style="font-size: 150%">' + champion.championPoints + '</span>';
	
	if (champion.chestGranted) {
	
		str += '<br><span><i class="material-icons" style="line-height:100%;">games</i>Chest granted</span>';
		
	}
	
	str += '</p></div>';
	
	str +=			'<div class="collapsible-header-right-section"><p><span style="font-size:250%;">' + champion.champion.name + '</span><br><span>' + champion.champion.title + '</span></p></div>';
	str += 		'</div>';
	str += '</div>';
	
	str += '<div class="collapsible-body">';
	str += '<div class="col s6">';
	str += 		'<div class="col s12">' + (checkVariable(champion.highestGrade) ? champion.highestGrade : '--') + '</div>';
	str += 		'<div class="col s12 no-padding">Highest Grade</div>';
	str += '</div>';
	str += '<div class="col s6">';
	str += 		'<div class="col s12">' + (( !checkVariable(champion.championPointsUntilNextLevel) || champion.championPointsUntilNextLevel == 0) ? '--' : champion.championPointsUntilNextLevel) + '</div>';
	str += 		'<div class="col s12 no-padding">Points until next level</div>';
	str += '</div>';
	
	if (stats == null) {
	
		str += '<div class="col s12">';
		str += 		'No ranked stats available for this champion.';
		str += '</div>';
	
	} else {
		
		str += '<div class="col s12">';
		str += 		'Ranked stats';
		str += '</div>';
		
		var totalPlayed = stats.totalSessionsPlayed;
		var won = stats.totalSessionsWon;
		var lost = stats.totalSessionsLost;
		var winrate = won / totalPlayed * 100;
		
		// Won / Lost / Winrate
		str += '<div class="col s12 m12 l8 offset-l2">';
		str += 		'<div class="col s12 m4 l4 no-padding">Won: ' + won + '</div>';
		str += 		'<div class="col s12 m4 l4 no-padding">Lost: ' + lost + '</div>';
		str += 		'<div class="col s12 m4 l4 no-padding">Win Ratio: ' + winrate.toFixed(1) + '%</div>';
		str += '</div>';
		
		// Title
		str += '<div class="col s12">';
		str += 		'Per game averages';
		str += '</div>';
		
		// KDA
		var killAvg = stats.totalChampionKills / totalPlayed;
		var deathAvg = stats.totalDeathsPerSession / totalPlayed;
		var assistAvg = stats.totalAssists / totalPlayed;
		str += '<div class="col s12 m12 l8 offset-l2">';
		str += 		'<div class="col s12 m4 l4 no-padding">Kills: ' + killAvg.toFixed(1) + '</div>';
		str += 		'<div class="col s12 m4 l4 no-padding">Deaths: ' + deathAvg.toFixed(1) + '</div>';
		str += 		'<div class="col s12 m4 l4 no-padding">Assists: ' + assistAvg.toFixed(1) + '</div>';
		str += '</div>';
		
		// More information
		str += addStatInformation(stats, 'totalTurretsKilled', totalPlayed, 2, "Turrets destroyed");
		str += addStatInformation(stats, 'totalDamageDealt', totalPlayed, 0);
		str += addStatInformation(stats, 'totalDoubleKills', totalPlayed, 2);
		str += addStatInformation(stats, 'totalPhysicalDamageDealt', totalPlayed, 0);
		str += addStatInformation(stats, 'totalTripleKills', totalPlayed, 2);
		str += addStatInformation(stats, 'totalMagicDamageDealt', totalPlayed, 0);
		str += addStatInformation(stats, 'totalQuadraKills', totalPlayed, 2);
		str += addStatInformation(stats, 'totalMinionKills', totalPlayed, 2, "Minions Killed");
		str += addStatInformation(stats, 'totalPentaKills', totalPlayed, 2);
		str += addStatInformation(stats, 'totalGoldEarned', totalPlayed, 0);
		
	}

	str += '</div>';
	str += '</li>';
	
	$('#cmExpendable' + currentLevel).append(str);

}

function addStatInformation(stats, key, nbPlayed, precision, titleOverride)
{
	var element = stats[key];
	var titleWithoutSpace = key.substring(5);
	var title = titleWithoutSpace.replace(/([A-Z]+)/g, " $1").substring(1);
	var value = element / nbPlayed;
	
	var str = '<div class="col s12 m6 l6">';
	str += 		'<div class="col s9 ranked-stat-label-left no-padding">' + (checkVariable(titleOverride) ? titleOverride : title) + '</div>';
	str += 		'<div class="col s3 ranked-stat-value-right no-padding">' + value.toFixed(precision) + '</div>';
	str += '</div>';
	
	return str;
}

function getRankedStatChampionFromId(id)
{
	var champions = SUMMONER_RANKED.champions;
	for (var i = 0, championsLen = champions.length; i < championsLen; i++)
	{
		if (champions[i].id == id)
		{
			return champions[i].stats;
		}
	}
	
	return null;
}