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


function initChampionMasteryPoints()
{
	var nbMasteriesPointsMax = 130 * 5;
	
	var masteriesPoints = 0;
	for (var i = 0; i < SUMMONER_MASTERIES.length; ++i) {

		masteriesPoints += SUMMONER_MASTERIES[i].championLevel;

	}
	
	var percent = masteriesPoints / nbMasteriesPointsMax;
	
	// Draw
	var ctx = document.getElementById('summonerInfo_canvas').getContext('2d');
	
	// Background
	ctx.clearRect(0, 0, 118, 118);
	ctx.fillStyle = '#263238';
	ctx.fillRect(0, 0, 118, 118);
	
	// Arc
	ctx.fillStyle = '#607d8b';
	ctx.beginPath();
	ctx.arc(59, 85, 50, -Math.PI, 0);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = '#fe9700';
	ctx.beginPath();
	ctx.arc(59, 85, 50, -Math.PI, -Math.PI + (Math.PI * percent));
	ctx.lineTo(59, 85);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = '#263238';
	ctx.beginPath();
	ctx.arc(59, 85, 25, -Math.PI, 0);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = '#ffffff';
	ctx.font = '25px Owsald';
	var width = ctx.measureText(masteriesPoints).width;
	ctx.fillText(masteriesPoints, 59 - width / 2, 25);
	
}