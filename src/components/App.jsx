import React, { Component } from 'react';
import Weather from './Weather';
import Forecast from './Forecast';
import autobind from 'autobind-decorator';
import qs from 'querystring';
import 'whatwg-fetch';
import './App.scss';

const { appid } = qs.parse(location.search.substring(1));

class App extends Component {
	/**
	 * @param {{}} obj
	 * @returns {{ temp: number, tempMin: number, tempMax: number, main: string }}
	 */
	static convertWeather(obj) {
		if (!obj) {
			return null;
		}

		let { main: { temp, temp_min: tempMin, temp_max: tempMax }, weather: [{ main }] } = obj;

		temp = App.convertKelvinToCelsius(temp);
		tempMin = App.convertKelvinToCelsius(tempMin);
		tempMax = App.convertKelvinToCelsius(tempMax);
		main = App.convertEnglishToJapanese(main);

		return {
			temp,
			tempMin,
			tempMax,
			main
		};
	}

	/**
	 * @param {{}} obj
	 */
	static convertForecast(obj) {
		if (!obj) {
			return null;
		}

		const { list } = obj;
		const now = Date.now();

		return list.reduce((sum, { dt_txt: dt, main: { temp, temp_min: tempMin, temp_max: tempMax }, weather: [{ main }] }) => {
			const date = new Date(dt.replace(/-/g, '/'));

			console.log(date, dt);

			if (date.getTime() < now) {
				return sum;
			}

			return sum.concat({
				date,
				temp: App.convertKelvinToCelsius(temp),
				tempMin: App.convertKelvinToCelsius(tempMin),
				tempMax: App.convertKelvinToCelsius(tempMax),
				main: App.convertEnglishToJapanese(main)
			});
		}, []);
	}

	/**
	 * @param {number} f
	 * @returns {number}
	 */
	static convertKelvinToCelsius(f) {
		return f - 273.15;
	}

	/**
	 * @param {string} s
	 * @returns {string}
	 */
	static convertEnglishToJapanese(s) {
		switch (s) {
			case 'Drizzle':
				return '霧雨';
			case 'Clouds':
				return '曇り';
			case 'Rain':
				return '雨';
			case 'Clear':
				return '晴れ';
			default:
				console.log(s);
				return 'なんや';
		}
	}

	constructor() {
		super();

		this.state = {
			weather: null,
			forecast: null
		};
	}

	componentDidMount() {
		this.loop();
	}

	@autobind
	loop() {
		Promise.all([
			fetch(`http://api.openweathermap.org/data/2.5/weather?q=Nakano&appid=${appid}`).then((r) => r.json()),
			fetch(`http://api.openweathermap.org/data/2.5/forecast?q=Nakano&appid=${appid}`).then((r) => r.json())
		]).then(([weather, forecast]) => {
			this.setState({ weather, forecast });
		}).catch(console.error).then(() => setTimeout(this.loop, 300000));
	}

	render() {
		const { state: { weather, forecast } } = this;

		return (
			<div styleName='base'>
				<Weather weather={App.convertWeather(weather)} />
				<Forecast forecast={App.convertForecast(forecast)} />
			</div>
		);
	}
}

export default App;