var request = require('request');
var cheerio = require('cheerio');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = 'mongodb://localhost:27017/vb';
var count = 0;
var v = 0;
function getPlayerStatistics(URL, name, db){
	var request = require('request');
	var cheerio = require('cheerio');
	console.log("Acquiring statistics for "+name+"... please wait.");
	var scount = 0;
	request("http://"+URL, function (error, response, html) {
		if (!error && response.statusCode === 200) {
			var $ = cheerio.load(html);
			var statistics = new Array(0);
			$('td.smtext').each(function(i, element){
				var a = $(this);
				var data = new Array(19);
				for(i = 0; i<19;i++){
					data[i] = a.text();
					data[i] = data[i].trim();
					a = a.next();
				}
				for(i = 0; i < data[1].length;i++){
					if(data[1].charAt(i) === '\n') {
						data[1].replace('\n',' ');
					}
				}
				data[1] = data[1].trim();
				for(i = 0; i < data[2].length;i++){
					if(data[2].charAt(i) === '\n') {
						data[2].replace('\n',' ');
					}
				}
				data[2] = data[2].trim();
				var metadata = {
						name: name,
						date: data[0],
						opponent: data[1],
						result: data[2],
						sets: data[3],
						MS: data[4],
						kills: data[5],
						errors: data[6],
						total_attacks: data[7],
						hitting_percentage: data[8],
						assists: data[9],
						aces: data[10],
						serving_errors: data[11],
						digs: data[12],
						receive_errors: data[13],
						solo_blocks: data[14],
						block_assists: data[15],
						block_errors: data[16],
						points: data[17],
						ball_handling_error: data[18]
				};

				if(scount%3===0) {

					//statistics[0] = metadata.name;
					//console.log(metadata);
					statistics.length = statistics.length++;
					statistics.push(metadata);

				}
				scount++;

			});
			if (statistics.length>1){

				MongoClient.connect(url, function (err, db) {
					// do some work here with the database.
					var coll = db.collection('Statistics');
//					var stat = {
//							name: statistics[0].name,
//							stats: statistics
//					};
					//var stat = statistics;
					coll.insert(stat, function (err,result) {
						if (err) {
							console.log(err);
						} else {
							console.log(result);
						}
					});
					db.close();
//					}
				});
				v++;
			}
		}
		else if(error)
		{
			console.log(error);
		}
	});
}
var names = new Array(0);
MongoClient.connect(url, function connectDB(err, db) { //gets the players' names
	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		console.log('Connection established to', url);
		var collection = db.collection('Players');
		collection.find().each(function(err,docs){
			if(err){
				console.log(err);
			}
			else{
				if(count < 708){
					count++;
					var name = docs.name;
					var URL = docs.url;
					getPlayerStatistics(URL,name, db);
					db.close();
				}
			}

		});

	}
});

