var request = require('request');
var cheerio = require('cheerio');

console.log("Acquiring player list... please wait.");

var count = 0;
var robCount=0;
var schools = new Array(1071);
for(count=2;count<1073;count++){
	schools[count] = count;
}
count = 0;
var school = 0;

/*
 * Eastern Intercollegiate Volleyball Association

list:
248
275
471
539
554
590
600
47
1104
308 
354
30136
371
30138
518
561
77
30135
277
99
541
674
109
112
104
110
657
101

Brigham Young University - 77
California Baptist University (NCAA Division II) - 30135
California State University, Northridge - 101
University of Hawai'i at Mānoa - 277
California State University, Long Beach (Long Beach State) - 99
Pepperdine University - 541
Stanford University - 674
University of California, Irvine (UC Irvine) - 109
University of California, San Diego (UC San Diego; NCAA Division II) - 112
University of California, Santa Barbara (UC Santa Barbara) - 104
University of California, Los Angeles (UCLA) - 110
University of Southern California (USC) - 657

George Mason University - 248
Harvard University - 275
New Jersey Institute of Technology - 471
Pennsylvania State University - 539
Princeton University - 554
Sacred Heart University - 590
Saint Francis University of Pennsylvania - 600
University of Charleston (NCAA Division II)

Ball State University - 47
Grand Canyon University (began transition from NCAA Division II in July 2013) - 1104
Indiana University-Purdue University Fort Wayne (IPFW) - 308
Lewis University (NCAA Division II) - 354
Lindenwood University (NCAA Division II) - 30136
Loyola University Chicago - 371
McKendree University (NCAA Division II) - 30138
Ohio State University - 518
Quincy University (NCAA Division II) - 561

 */

var d1Schools = [
248,
275,
471,
539,
554,
590,
600,
47,
1104,
308 ,
354,
30136,
371,
30138,
518,
561,
77,
30135,
277,
99,
541,
674,
109,
112,
104,
110,
657,
101];

var i;
for(i=0;i<d1Schools.length;i++){//school IDs go from 2 to 818
	var url = 'http://stats.ncaa.org/team/roster/12100?org_id='+d1Schools[i];
	console.log(url);
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
						robCount++;
						console.log(metadata);
						console.log(robCount);
						console.log(d1Schools.length);
					}
					else if (count===2 && identifier.charAt(0) === 'T'){//if a page has no players, it'll say Terms and Conditions in the second 'a' tag
						//console.log(school);
					}

				});
			}
			else if(error)
				{
				console.log(error);
				}
		};
		
	})(school));

}


