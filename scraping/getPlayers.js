var request = require('request');
var cheerio = require('cheerio');

console.log("Acquiring player list... please wait.");

var count = 0;
var schools = 2;
for(schools = 2; schools<818;schools++){//school IDs go from 2 to 818
	request('http://stats.ncaa.org/team/roster/12100?org_id='+schools, function (error, response, html) {
		if (!error && response.statusCode === 200) {
			var $ = cheerio.load(html);
			count = 0;
			schools++;
			$('a').each(function(i, element){			
				var a = $(this);
				var identifier = a.text();
				count++;
				if(count===2 && identifier.charAt(0) === 'S'){//if a page has players, it'll say Schedule/Results in the second 'a' tag
					console.log("full"+schools);
				}
				else if (count===2 && identifier.charAt(0) === 'T'){//if a page has no players, it'll say Terms and Conditions in the second 'a' tag
					console.log("empty"+schools);
				}

			});

		}
	});
}
