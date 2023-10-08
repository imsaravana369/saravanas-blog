const fs = require('fs');

exports['writeToFile'] = async (filedata, title) => {
	if (!title) {
		throw "Title should not be empty"
	}
	console.log("title", title, typeof (title));
	const fileTitle = title.replace(/ /g, '_');
	const filepath = `gen_articles/${fileTitle}.md`
	fs.writeFile(filepath, filedata, (err) => { if (!err) return; console.log("Error while writing to", filepath, err) });
}
