const {getArticles }  = require ('./src/get_medium_article.js');
const {convertToMarkDown} = require('./src/medium-to-readme');
const {writeToFile } = require('./src/write-to-file')
const { getMediumLinks }  = require('./src/get_medium_links');

const publications = ["nerd-for-tech"]; // Add your publication names here
const username = 'imsaravananm';

const sanitizeTitleFromLink = (value) => {
  const pubPrefixes = publications.map(pub => `https://medium.com/${pub}/`);
  const usernamePrefix = `https://${username}.medium.com/`;
  const regex = /(.+)-.+$/;
  
  let titleWithHash = value.startsWith(usernamePrefix)
    ? value.slice(usernamePrefix.length)
    : pubPrefixes.some(prefix => value.startsWith(prefix))
    ? pubPrefixes.reduce((acc, prefix) => (value.startsWith(prefix) ? value.slice(prefix.length) : acc), value)
    : value;
    
  const match = titleWithHash.match(regex) ?? [];
  return match[1] ?? titleWithHash;
}



getMediumLinks(username).then((allArticles) => {
	let allArticleLink = Object.keys(allArticles).slice(2); // the first two are some random sites of medium
	allArticleLink.forEach(async (link) => {
		const obj = allArticles[link]
		console.log("reading the article", link);
		const markdown = await convertToMarkDown(link);
		const title = sanitizeTitleFromLink(link );
		obj.title = title.replace(/-/g, ' ');
		console.log("object",obj);
		writeToFile(markdown, title);
	});
});

