var RANKS_VALUE = {
	BRONZE : 0,
	SILVER : 1,
	GOLD : 2,
	PLATINUM : 3,
	DIAMOND : 4,
	MASTER : 5,
	CHALLENGER : 6
};

var RANKS_TEXT = [
	'Bronze',
	'Silver',
	'Gold',
	'Platinum',
	'Diamond',
	'Master',
	'Challenger'
];

function initChampionMasteryGraph()
{
	
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