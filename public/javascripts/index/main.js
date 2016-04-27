$(document).init(function () {

});


$('#searchForSummoner').click(function () {

	var region = $('.tabs .tab .active').html();
	var summonerName = $('#summonerName_input').val();

	// Check for error case (redirect or not)
	if (summonerName == "" || region == "")
		return;

	summonerName = encodeURIComponent(summonerName);

	var finalURL = '/summoner/' + region + '/' + summonerName;

	window.location.replace(finalURL);

});