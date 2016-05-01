var TAGS = [
	'Tank',
	'Support',
	'Marksman',
	'Magus',
	'Fighter',
	'Assassin'
];

function initChampionMasteryGraph()
{
	// Compute score per role
	for (var i = 0, end = SUMMONER_MASTERIES.length; i < end; ++i)
	{
		var champion = SUMMONER_MASTERIES[i];
		// var tag = => TODO: faire en fonction des vrais tags
		var tag = champion.champion.tags[0];
		
		if (!checkVariable(MASTERIES_ROLES[tag]))
			MASTERIES_ROLES[tag] = 0;
		
		MASTERIES_ROLES[tag] += champion.championPoints;
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
	
	var keys = Object.keys(MASTERIES_ROLES);
	var values = keys.map(function (key) {return MASTERIES_ROLES[key]});
	
	var config = {
		type: 'radar',
		options: {
			legend: {
				display: false,
			},
			maintainAspectRatio: false,
			scale: {
				ticks: {
					display: false,
					callback: function(value) { return '' + value; },	
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
		
	var ctx = document.getElementById("rankedChart").getContext('2d');
	var chart = new Chart(ctx, config);
			
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
	
	// var ctx = document.getElementById("rankedChart").getContext('2d');
	// var chart = new Chart(ctx, config);
}