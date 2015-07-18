var request = require('request');
var cheerio = require('cheerio');

console.log("Acquiring player list... please wait.");



/*
 * 
list:
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
University of Charleston (NCAA Division II) - 1013
Ball State University - 47
Grand Canyon University (began transition from NCAA Division II in July 2013) - 1104
Indiana University-Purdue University Fort Wayne (IPFW) - 308
Lewis University (NCAA Division II) - 354
Lindenwood University (NCAA Division II) - 30136
Loyola University Chicago - 371
McKendree University (NCAA Division II) - 30138
Ohio State University - 518
Quincy University (NCAA Division II) - 561
Pfieffer - 542 
Erskine - 1072
Mount Olive - 1245
Limestone - 1174
King - 30051
Barton - 15646
Belmont Abbey - 2683
North Greenville - 9223
Lees McRae - 13302
Coker - 1023
 */
var robCount=0;
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
101,
1013,
542, 
1072,
1245,
1174,
30051,
15646,
2683,
9223,
13302,
1023];

var i;
for(i=0;i<d1Schools.length;i++){
	var url = 'http://stats.ncaa.org/team/roster/12100?org_id='+d1Schools[i];
	request(url, ( function(d1Schools) {
		return function (error, response, html) {
			if (!error && response.statusCode === 200) {
				var $ = cheerio.load(html);
				var school = $('h1').text().trim();
				var pCount = 0;
				var dataCount = 0;
				$('td').each(function(i, element){	
					pCount++;
					if((pCount-2)%6 === 0){
						var a = $(this).next();
						var player = {
								name: a.text(),
								number: a.prev().text(),
								height: a.next().text(),
								year: a.next().next().text(),
								school: school,
								school_code: $('a').next().attr('href').slice(19,$('a').next().attr('href').search("&")),//window.location.href.slice(47),
								url: "stats.ncaa.org"+a.children().attr('href'),
								statistics: 0,
						};
						console.log(player);
						//insert into db here
						var mongodb = require('mongodb');
						var MongoClient = mongodb.MongoClient;
						var url = 'mongodb://localhost:27017/vb';
						MongoClient.connect(url, function (err, db) {
							if (err) {
								console.log('Unable to connect to the mongoDB server. Error:', err);
							} else {
								console.log('Connection established to', url);

								// do some work here with the database.
								var collection = db.collection('Players');
								//var player = players[dataCount];
								collection.insert(player, function (err,result) {
									if (err) {
										console.log(err);
									} else {
										console.log("Inserted "+player.name);
									}
								});
								db.close();
							}
						});
						dataCount++;
					}
				});
				robCount++;
				console.log(robCount);
			}
			else if(error)
			{
				console.log(error);
			}
			//db.close();
		};

	})(d1Schools));

}