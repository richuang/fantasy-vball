var request = require('request');
var cheerio = require('cheerio');

console.log("Acquiring player list... please wait.");

var count = 0;
var schools = new Array(1071);
for(count=2;count<1073;count++){
	schools[count] = count;
}
count = 0;
var school = 0;
for(school in schools){//school IDs go from 2 to 818
	var url = 'http://stats.ncaa.org/team/roster/12100?org_id='+schools[school];
	request(url, ( function(school) {
		return function (error, response, html) {
			if (!error && response.statusCode === 200) {
				var $ = cheerio.load(html);
				count = 0;
				$('a').each(function(i, element){			
					var a = $(this);
					var identifier = a.text();
					count++;
					if(count===2 && identifier.charAt(0) === 'S'){//if a page has players, it'll say Schedule/Results in the second 'a' tag
						
						var metadata = {
								school: $('h1').text().trim(),
								player1: $('a').next().next().next().next().next().next().next().next().next().next().next().text()
						};
						console.log(metadata);
					}
					else if (count===2 && identifier.charAt(0) === 'T'){//if a page has no players, it'll say Terms and Conditions in the second 'a' tag
						//console.log(school);
					}

				});
			}
		};
	})(school));

}

