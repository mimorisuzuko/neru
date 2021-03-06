import React, { Component } from 'react';
import Weather from './Weather';
import Forecast from './Forecast';
import autobind from 'autobind-decorator';
import liburl from 'url';
import apiTarget from '../api-target';
import './App.scss';

const target = liburl.resolve(apiTarget, 'weather');

class App extends Component {
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
		fetch(target).then((a) => a.json()).then(([weather, ...forecast]) => {
			this.setState({ weather, forecast });
		}).catch(console.error).then(() => setTimeout(this.loop, 60000));
	}

	render() {
		const { state: { weather, forecast } } = this;

		return (
			<div styleName='base'>
				<Weather weather={weather} />
				<Forecast forecast={forecast} />
			</div>
		);
	}
}

export default App;