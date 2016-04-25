var RM = new RequestModule();

var summonerRequest = new RequestObject(1, 
	{
		type : "GET",
		dataType : "json",
		url : "route_url,
		done : function(response)
		{
			console.log(response);
		},
		fail : function(response)
		{
			console.log(response);
		}
	}
);

var championMasteryRequest = new RequestObject(2, 
	{
		type : "GET",
		dataType : "json",
		url : "route_url",
		done : function(response)
		{
			console.log(response);
		},
		fail : function(response)
		{
			console.log(response);
		}
	}
);

var rankedRequest = new RequestObject(3, 
	{
		type : "GET",
		dataType : "json",
		url : "route_url",
		done : function(response)
		{
			console.log(response);
		},
		fail : function(response)
		{
			console.log(response);
		}
	}
);