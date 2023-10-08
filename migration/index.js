const {getArticles }  = require ('./src/get_medium_article.js');
const {convertToMarkDown} = require('./src/medium-to-readme');
const {writeToFile } = require('./src/write-to-file')
const { getMediumLinks }  = require('./src/get_medium_links');
const username = 'imsaravananm'

const prefix = `https://${username}.medium.com/`
const removePrefix = (value, prefix) => value.startsWith(prefix) ? value.slice(prefix.length) : value;



getMediumLinks(username).then((allArticles) => {
	let allArticleLink = Object.keys(allArticles).slice(2);
	allArticleLink.forEach(async (link) => {
		console.log("reading the article", link);
		const markdown = await convertToMarkDown(link);
		const title = removePrefix(link, prefix);
		writeToFile(markdown, title);
	});
});

