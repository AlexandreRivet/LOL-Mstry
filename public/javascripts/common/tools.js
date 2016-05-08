function checkVariable(value)
{
	return ( (value != undefined) && (value != null) );
}

String.prototype.toPascalCase = function()
{
	return this.replace(/\w+/g, function(w){return w[0].toUpperCase() + w.slice(1).toLowerCase();});
}