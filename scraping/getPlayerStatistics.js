function getPlayerStatistics(URL, name){
	var request = require('request');
	var cheerio = require('cheerio');

	console.log("Acquiring statistics for "+name+"... please wait.");

	var count = 0;
	request('http://stats.ncaa.org/player/game_by_game?game_sport_year_ctl_id=12100&stats_player_seq=1416537.0&org_id=371.0&Submit=Submit', function (error, response, html) {
		if (!error && response.statusCode === 200) {
			var $ = cheerio.load(html);
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
				if(count%3===0) {
					var mongodb = require('mongodb');
					var MongoClient = mongodb.MongoClient;
					var url = 'mongodb://localhost:27017/vb';
					MongoClient.connect(url, function (err, db) {
						if (err) {
							console.log('Unable to connect to the mongoDB server. Error:', err);
						} else {
							console.log('Connection established to', url);

							// do some work here with the database.
							var collection = db.collection('Statistics');
							var stat = metadata;
							collection.insert(stat, function (err,result) {
								if (err) {
									console.log(err);
								} else {
									console.log('Inserted %d documents into the "users" collection. The documents inserted with "_id" are:', result.length, result);
								}
							});
							db.close();
						}
					});
					//console.log(metadata);
				}
				count++;

			});

		}
	});
}
getPlayerStatistics("http://stats.ncaa.org/player/game_by_game?game_sport_year_ctl_id=12100&stats_player_seq=1416537.0&org_id=371.0&Submit=Submit","Thomas Jaeschke");




