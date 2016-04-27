$(document).init(function () {

});


$('#searchForSummoner').click(function () {

	var region = $('.tabs .tab .active').html();
	var summonerName = $('#summonerName_input').val();

	if (summonerName == "" || region == "")
		return;

	loadSummoner(region, summonerName);

});