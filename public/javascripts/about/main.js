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
								
});