const express = require('express');
const request = require('request');
const moment = require('moment');
const libpath = require('path');
const cors = require('cors');
const Twitter = require('twitter');
const config = require('config');
const { JSDOM } = require('jsdom');

const app = express();
const twitter = new Twitter({
	consumer_key: config.get('consumer_key'),
	consumer_secret: config.get('consumer_secret'),
	access_token_key: config.get('access_token_key'),
	access_token_secret: config.get('access_token_secret')
});
const targetScreenName = config.get('screen_name');

/**
 * @param {HTMLTableElement} $table
 * @param {boolean} tomorrow
 * @returns {{ date: Date, main: string, temperature: number, humidity: number, precipitation: number }[]}
 */
const convertTableToWeather = ($table, tomorrow = false) => {
	let date = moment().minutes(0).seconds(0).milliseconds(0);

	if (tomorrow) {
		date = date.add(1, 'd');
	}

	const $trs = Array.from($table.querySelectorAll('tr'), ($tr) => $tr.querySelectorAll('td'));
	const $times = $trs[0];
	const { length: timesLength } = $times;
	const weather = [];

	for (let i = 1; i < timesLength; i += 1) {
		const $time = $times[i];

		if ($time.getAttribute('bgcolor') === '#eeeeee' && !tomorrow) {
			continue;
		}

		weather.push({
			date: date.hours(parseInt($time.textContent.match(/(\d+)/)[1], 10)).toDate(),
			main: $trs[1][i].textContent.trim(),
			temperature: parseInt($trs[2][i].textContent.trim(), 10),
			humidity: parseInt($trs[3][i].textContent.trim(), 10),
			precipitation: parseInt($trs[4][i].textContent.trim(), 10)
		});
	}

	return weather;
};

app.use(cors());
app.use('/', express.static(libpath.join(__dirname, 'docs')));

app.get('/weather', (req, res) => {
	request('https://weather.yahoo.co.jp/weather/jp/13/4410/13114.html', (err, response, body) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			const { window: { document } } = new JSDOM(body);
			const $tables = document.querySelectorAll('.yjw_table2');

			res.json([...convertTableToWeather($tables[0]), ...convertTableToWeather($tables[1], true)]);
		}
	});
});

app.post('/yo', (req, res) => {
	twitter.post('direct_messages/new', { screen_name: targetScreenName, text: 'Yoされた' }, (err) => {
		if (err) {
			console.error(err);
			res.sendStatus(500);
		} else {
			res.sendStatus(200);
		}
	});
});

app.listen(8000);