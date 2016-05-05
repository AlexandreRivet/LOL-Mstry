$(document).ready(function () {
	$('select').material_select();
});


$('#searchForSummoner').click(function () {

	var region = null;

	if( $('.large-server-selection').is(':visible') && !$('.small-server-selection').is(':visible')) {
		region = $('.tabs .tab .active').text();
	} else {
		region = $('.select-wrapper ul li.active').text();
	}

	var summonerName = $('#summonerName_input').val();

	// Check for error case (redirect or not)
	if (summonerName == "" || region == "")
		return;

	summonerName = encodeURIComponent(summonerName);

	var finalURL = '/summoner/' + region + '/' + summonerName;

	window.location.replace(finalURL);

});