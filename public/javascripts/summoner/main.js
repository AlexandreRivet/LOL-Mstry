$(document).init(function () {

	$('.button-collapse').sideNav();
	$("select option[value='" + SUMMONER_INFO.region + "']").attr("selected", true);
	$('select').material_select();
	$('.summoner-input').focus(function() {
		
		$(this).keydown(function(e) {
			
			var code = e.keyCode || e.which;
			if (code == 13) {
				
				var region = $('.select-wrapper input').val();
				var summonerName = $(this).val();
				
				// Check for error case (redirect or not)
				if (summonerName == "" || region == "")
					return;

				summonerName = encodeURIComponent(summonerName);

				var finalURL = '/summoner/' + region + '/' + summonerName;

				window.location.replace(finalURL);
				
			}
			
		});
		
	});
	
	$(".search_summoner").submit(function(e) { 
    	e.preventDefault();
    });
								
	
	// Update request
	championMasteryRequest.params.data.region = SUMMONER_INFO.region;
	championMasteryRequest.params.data.summonerId = SUMMONER_INFO.id;

	rankedRequest.params.data.region = SUMMONER_INFO.region;
	rankedRequest.params.data.summonerId = SUMMONER_INFO.id;

	// launch requests
	rankedRequest.execute(createRankedStats, checkLoading);
	championMasteryRequest.execute(createSummoner, checkLoading);
});

function createSummoner()
{
	initChampionMasteryPoints();
	initChampionMasteryGraph();
	
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
		updateMasteries();
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
		}, 1000);
	}
}

function updateMasteries() {

	for (var i = 0; i < SUMMONER_MASTERIES.length; ++i) {

		addChampionMastery(SUMMONER_MASTERIES[i]);

	}
	
	if (!checkVariable(SUMMONER_RANKED.champions)) {
		$('#summonerInfo_rankInfo').html('Unranked');	
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
	
	str += '<div class="collapsible-body blue-grey lighten-4">';
    str +=      '<div class="col s12 ranked-stats-header">';
	str +=          '<div class="col s6 ranked-stats-gold">';
	str += 		        '<div class="col s12"><span class="highest-grade">' + (checkVariable(champion.highestGrade) ? champion.highestGrade : '--') + '</span></div>';
	str += 		        '<div class="col s12 no-padding">Highest Grade</div>';
	str +=          '</div>';
	str +=          '<div class="col s6 ranked-stats-blue">';
	str += 		        '<div class="col s12"><span class="level-up-points">' + (( !checkVariable(champion.championPointsUntilNextLevel) || champion.championPointsUntilNextLevel == 0) ? '--' : champion.championPointsUntilNextLevel) + '</span></div>';
	str += 		        '<div class="col s12 no-padding">Points until next level</div>';
	str +=          '</div>';
    str +=      '</div><hr>';
	
	if (stats == null) {
	
		str += '<div class="col s12">';
		str += 		'No ranked stats available for this champion.';
		str += '</div>';
	
	} else {
		
		str += '<div class="col s12">';
		str += 		'<h4>Ranked stats</h4>';
		str += '</div>';
		
		var totalPlayed = stats.totalSessionsPlayed;
		var won = stats.totalSessionsWon;
		var lost = stats.totalSessionsLost;
		var winrate = won / totalPlayed * 100;
		
		// Won / Lost / Winrate
		str += '<div class="col s12 m12 l8 offset-l2 ranked-stats-games">';
		str += 		'<div class="col s12 m4 l4 no-padding ranked-stats-green"><span class="ranked-stats-won">' + won + '</span><br>Won</div>';
		str += 		'<div class="col s12 m4 l4 no-padding ranked-stats-red"><span class="ranked-stats-lost">' + lost + '</span><br>Lost</div>';
		str += 		'<div class="col s12 m4 l4 no-padding ' + ((winrate < 50) ? 'ranked-stats-red' : ((winrate > 50) ? 'ranked-stats-green' : '') ) + '"><span class="ranked-stats-ratio">' + winrate.toFixed(1) + '%</span><br>Win ratio</div>';
		str += '</div>';
		
		// Title
		str += '<div class="col s12">';
		str += 		'<h5>Per game averages</h5>';
		str += '</div>';
		
		// KDA
		var killAvg = stats.totalChampionKills / totalPlayed;
		var deathAvg = stats.totalDeathsPerSession / totalPlayed;
		var assistAvg = stats.totalAssists / totalPlayed;
		str += '<div class="col s12 m12 l8 offset-l2 ranked-stats-kda">';
		str += 		'<div class="col s12 m4 l4 no-padding"><span class="ranked-stats-kills">' + killAvg.toFixed(1) + '</span><br>Kills</div>';
		str += 		'<div class="col s12 m4 l4 no-padding"><span class="ranked-stats-deaths">' + deathAvg.toFixed(1) + '</span><br>Deaths</div>';
		str += 		'<div class="col s12 m4 l4 no-padding"><span class="ranked-stats-assists">' + assistAvg.toFixed(1) + '</span><br>Assists</div>';
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
	
	var str = '<div class="col s12 m6 l6 stat-info">';
	str += 		'<div class="col s9 ranked-stat-label-left no-padding"><b>' + (checkVariable(titleOverride) ? titleOverride : title) + '</b></div>';
	str += 		'<div class="col s3 ranked-stat-value-right no-padding">' + value.toFixed(precision) + '</div>';
	str += '</div>';
	
	return str;
}

function getRankedStatChampionFromId(id)
{	
	var champions = SUMMONER_RANKED.champions;
	if (!checkVariable(champions))
		return null;
	
	for (var i = 0, championsLen = champions.length; i < championsLen; i++)
	{
		if (champions[i].id == id)
		{
			return champions[i].stats;
		}
	}
	
	return null;
}