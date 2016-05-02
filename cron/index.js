var schedule    =    require('node-schedule');

var models      =    require('../models');

var rule = new schedule.RecurrenceRule();
rule.second = 10;

var j = schedule.scheduleJob(rule, function(){
    // Do whatever you want homie
});
