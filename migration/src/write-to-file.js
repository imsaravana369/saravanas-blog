const fs = require('fs');

// filedata - readme content, fileTitle - a valid file path (no spaces etc)
exports['writeToFile'] = async (filedata, fileTitle) => {
	// if (!title) {
	// 	throw "Title should not be empty"
	// }
	const filepath = `gen_articles/${fileTitle}.md`
	fs.writeFile(filepath, filedata, (err) => { if (!err) return; console.log("Error while writing to", filepath, err) });
}
