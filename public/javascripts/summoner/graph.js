function createRadarChart(id, keys, values)
{
	var config = {
		type: 'radar',
		options: {
			legend: {
				display: false,
			},
			scale: {
				ticks: {
					display: false,
				}
			}
		},
		data: {
			labels: keys,
			datasets: [{
				data: values,
				
			}],
		},
		
		
	};
		
	var ctx = document.getElementById(id).getContext('2d');
	var chart = new Chart(ctx, config);
}


function initChampionMasteryGraph()
{
	// Creation of each level
	for (var i = 1; i <= MAX_LEVEL; ++i)
		MASTERIES_POINTS[i] = 0;	
	
	// Compute score per role
	for (var i = 0, end = SUMMONER_MASTERIES.length; i < end; ++i)
	{
		var champion = SUMMONER_MASTERIES[i];
		// var tag = => TODO: faire en fonction des vrais tags
		var tag = champion.champion.tags[0];
		
		if (!checkVariable(MASTERIES_ROLES[tag]))
			MASTERIES_ROLES[tag] = 0;
		
		MASTERIES_ROLES[tag] += champion.championPoints;
		MASTERIES_POINTS[champion.championLevel] += 1;
	}
	
	// Find best role
	var bestRole = {'title': null, 'score': -1};
	for (var role in MASTERIES_ROLES)
	{
		if (MASTERIES_ROLES[role] > bestRole.score)
		{
			bestRole.title = role;
			bestRole.score = MASTERIES_ROLES[role];
		}
	}
	
	$('#summonerInfo_image').attr('src', '/images/roles/' + bestRole.title + '.jpg');
	
	var keys = Object.keys(MASTERIES_ROLES);
	createRadarChart("rolesChart", keys, keys.map(function (key) {return MASTERIES_ROLES[key]}));
	keys = Object.keys(MASTERIES_POINTS);
	createRadarChart("masteriesPointsChart", keys, keys.map(function (key) {return MASTERIES_POINTS[key]}));
			
}

function initRankedGraph()
{
	var config = {
		type: 'line',
		options: {
			legend: {
				display: false,
			},
			maintainAspectRatio: false,
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true,
						max: RANKS_VALUE.CHALLENGER,
						userCallback: function(value) { return RANKS_TEXT[value]; },
					},
				}],
			},
			elements: {
				point: {
					radius: 5,	
				}
			},
			showLines: false,
		},
		data: {
			labels: ['', 'S3', 'S4', 'S5', 'S6'],
			datasets: [{
				data: [null, RANKS_VALUE.GOLD, RANKS_VALUE.PLATINUM, RANKS_VALUE.PLATINUM, RANKS_VALUE.PLATINUM],
				fill: false,
				pointBackgroundColor: '#ff9800',
				pointBorderColor: '#871515',
				pointBorderWidth: 2,
			}],
			
		},
		
		
	};
	
	var ctx = document.getElementById("rankedChart").getContext('2d');
	var chart = new Chart(ctx, config);
}