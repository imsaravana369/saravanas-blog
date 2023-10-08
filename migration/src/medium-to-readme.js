const mediumToMarkdown = require('medium-to-markdown');

exports['convertToMarkDown'] = async (articleLink) => {
	return await mediumToMarkdown.convertFromUrl(articleLink);
};
