var request = require('request');
var cheerio = require('cheerio');

console.log("Roberts Hello World");

var count = 0;
request('http://stats.ncaa.org/player/game_by_game?game_sport_year_ctl_id=12100&stats_player_seq=1416537.0&org_id=371.0&Submit=Submit', function (error, response, html) {
	if (!error && response.statusCode == 200) {
		var $ = cheerio.load(html);
		var parsedResults = [];
		$('td.smtext').each(function(i, element){
			// Select the previous element
			var a = $(this).next();
			var date = a.prev().text();
			var opp = a.text();
			var result = a.next().text();
			var sets = a.next().next().text();
			var MS = a.next().next().next().text();
			var kills = a.next().next().next().next().text();
			var errors = a.next().next().next().next().next().text();
			var totalA = a.next().next().next().next().next().next().text();
			//count++;
			var metadata = {
					date: date,
					opponent: opp,
					result: result,
					sets: sets,
					MS: MS,
					kills: kills,
					errors: errors,
					total_attacks: totalA
			};
			console.log(metadata);

		});

	}
});