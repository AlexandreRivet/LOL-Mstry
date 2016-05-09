$(document).init(function () {

	$('.button-collapse').sideNav();
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
	
	leaderboardRequest.execute(createLeaderboard);
								
});

function createLeaderboard()
{
	var str = '<ul class="collection with-header col s10 offset-s1">';
	str += '<li class="collection-header"><h5>Leaderboard</h5><br>Players must be searched on our website to be shown in this list.</li>';
	
	for (var i = 0, iLen = LEADERBOARD_INFO.length; i < iLen; i++)
	{
		str += addChampionInfo(LEADERBOARD_INFO[i]);
	}
	
	str += '</ul>';
	
	$('#leaderboard_container').append(str);
	$('#leaderboard_loader').hide();
	$('#leaderboard_container').show();
	
}

function addChampionInfo(championInfo)
{
	var str = "";
	str += '<li class="collection-item leaderboard-collection avatar">';
    str += '<img src="http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/' + championInfo.champion.key + '.png" alt="" class="circle">';
    str += '<span class="title">' + championInfo.champion.name + ', ' + championInfo.champion.title + '</span>';
   	str += '<p>' + championInfo.summonerName + ' (' + championInfo.region + ')<br>';
    str += thousandsSeparator(championInfo.score) + ' points';
    str += '</p>';
   	str += '<a href="/summoner/' + championInfo.region + '/' + championInfo.summonerName + '" class="secondary-content"><i class="material-icons">send</i></a>';
    str += '</li>';
	
	return str;
}
			