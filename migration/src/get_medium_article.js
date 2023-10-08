const Parser = require('rss-parser');
const parser = new Parser();
/*
 
 {
   creator :: String
  , title : String
  , link : String
  , pubDate : Date
  , [content:encoded'] : String

 */
exports['getArticles'] = async (username) => {
	

  const imageRegex = /<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
	
  const url =`https://medium.com/feed/@${username}`
  const feed = await parser.parseURL(url);
  let result = [];
  const allArticles = []
  feed.items.forEach((item) => {
    const imageObj = imageRegex.exec(item['content:encoded']); // considering first itema as thumbnail
    const articleObj = {};	
    if (imageObj) {
      articleObj.thumbnail = imageObj[1];
    }
    // articleObj.content = item['content:encoded'];
    // articleObj.author = item['creator'];
	articleObj.pubDate = item['pubDate']
	articleObj.title = item['title']
	articleObj.link = item['link']
	console.log('categories',item.categories)
	allArticles.push(articleObj)	
  });

  return allArticles; 

};


