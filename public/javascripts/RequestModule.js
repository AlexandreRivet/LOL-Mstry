var RequestModule = function()
{
	this.requests = {};
	this.levels = [];
	
	this._numberRequestsDone = 0;
	this._queueCleaned = false;
};

RequestModule.prototype.addToQueue = function(req)
{
	this.checkForNewLevel(req.level);
	
	if ( !checkVariable(this.requests[req.level]) )
		this.requests[req.level] = new Array();
	
	this.requests[req.level].push(req);
};

RequestModule.prototype.checkForNewLevel = function(level)
{	
	// Splice or push in the tab
	var levelObject = { value : level, number : 1};
	var alreadyPushed = false;
	for (var i = 0, end = this.levels.length; i < end; ++i)
	{
		if (level == this.levels[i].value)
		{
			this.levels[i].number++;
			alreadyPushed = true;
			return;		
		}
		else if (level < this.levels[i].value)
		{
			this.levels.splice(i, 0, levelObject);
			alreadyPushed = true;
			break;
		}			
	}
	
	if (!alreadyPushed)
		this.levels.push(levelObject);
		
};

RequestModule.prototype.launch = function()
{
	this._queueCleaned = false;
	
	this.process();
};

RequestModule.prototype.process = function()
{
	var self = this;
	var initialLevel = this.levels[0].value;
	
	console.log('Start on level ' + initialLevel);
	
	var initialRequests = this.requests[initialLevel];
	for (var i = 0, end = initialRequests.length; i < end; ++i)
	{
		initialRequests[i].execute( (function() { self.requestAchieved(); }), (function() { self.requestFailed(); }));
	}	
};

RequestModule.prototype.requestFailed = function()
{
	if (this._queueCleaned)
		return;
	
	console.warn('Requests failed on level ' + this.levels[0].value);
	console.warn('Queue cleaned');
	
	this._queueCleaned = true;
	this.requests = {};
	this.levels = [];
	this._numberRequestsDone = 0;
};

RequestModule.prototype.requestAchieved = function()
{
	this._numberRequestsDone++;
	
	this.checkForNextLevel();
};

RequestModule.prototype.checkForNextLevel = function()
{	
	// We have finished all requests for one level
	if (this._numberRequestsDone == this.levels[0].number)
	{		
		this._numberRequestsDone = 0;
		this.levels.splice(0, 1);
		
		if (this.levels.length != 0)
		{
			this.process();
		}
	}
	
		// End of the process
	if (this.levels.length == 0) {
		
		this._queueCleaned = true;
		
		this.requests = {};
		this.levels = [];
		this._numberRequestsDone = 0;
	}
};





var RequestObject = function(level, params)
{
	this.level = level || 1;
	this.params = params;
	this.status = 0;				// 0 : pas lancé, 1 : réussi,  2 : fail
};

// callbackOnSuccess, callbackOnFail => override done for RequestModule
RequestObject.prototype.execute = function(callbackOnSuccess, callbackOnFail)
{
	var params = this.params;
	
	var sendType = params.type;
	if ( !checkVariable(sendType) )
		sendType = "GET";
	
	var responseType = params.dataType;
	if ( !checkVariable(responseType) )
		responseType = "json";
	
	var xhr = new XMLHttpRequest();
	var allreadyLoaded = false;
		
	xhr.onprogress = function(e)
	{
		var progress = params.progress;
		if ( checkVariable(progress) )
		{
			var arg_tmp = {};
			for (var key in e)
			{
				var type = typeof e[key];
				
				if(((type != "boolean") && (type != "number") && (type != "string")) || (key == "position")  || (key == "totalSize"))
						continue;
					
				arg_tmp[key] = e[key];
				
			}
			
			progress(arg_tmp);
		}
	};
	
	xhr.onreadystatechange = function(e)
	{
		if ( (allreadyLoaded) || (xhr.readyState != 4) )
			return;
		
		if( ( (xhr.status != 200) && (xhr.status != 0) ) || (!checkVariable(xhr.response) ) )
		{
			if( checkVariable(params.fail) )
				params.fail(xhr.response);
			
			if ( checkVariable(callbackOnFail) )
				callbackOnFail();
			
			return;
		}
		
		allreadyLoaded = true;
		
		if( checkVariable(params.done) )
		{		
			var finalResponse = xhr.response;
				
			// Security for IE (sometimes, IE doesn't recognize json)
			if ( responseType == "json" && !(typeof xhr.response == "object") )
				finalResponse = JSON.parse(xhr.response); 
				
			params.done(finalResponse);				
		}
		
		if ( checkVariable(callbackOnSuccess) )
			callbackOnSuccess();
		
	};
	
	xhr.open(sendType, params.url, true);
	xhr.responseType = responseType;
	
	if ( !checkVariable(params.data) )
		params.data = null;
	
	xhr.send(params.data);
	
};