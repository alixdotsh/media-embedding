const express = require("express");
const fs = require("node:fs/promises");
const moment = require("moment-timezone");
const path = require('path');

const app = express();
const port = 3621;
// need forward slash
const hostedUrl = "https://u.kaedehara.xyz/"
const ogTitle = "alix"

app.set('view engine', 'pug');

app.use('/files', express.static('/var/www/ShareX'));

app.get('/:filename', async (req, res) => {
	let filename = req.params.filename;
	
	try {
		let stat = await fs.stat("/var/www/ShareX/" + filename);
		
		// let desc = stat.ctime.toString();
		let date = moment(stat.ctime).tz("America/New_York").format('MMMM Do YYYY, h:mm:ss a') + " EST";

		let extension = path.extname(filename);
		
		switch (extension) {
			case '.gif' :
			case '.jpg' :
			case '.jpeg' :
			case '.png' : {
				res.render('image', {ogTitle,hostedUrl,imageName: filename,date})
				break;
			}
			case '.mp4' : {
				res.render('video', {ogTitle,hostedUrl,videoName: filename,date})
				break;
			}
		}

	} catch (e) {
		res.status(404).send('Not found')
	}
});

app.listen(port, () => {
	console.log(`Listening on ${port}`);
});
