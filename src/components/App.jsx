import React, { Component } from 'react';
import Weather from './Weather';
import Forecast from './Forecast';
import autobind from 'autobind-decorator';
import 'whatwg-fetch';
import './App.scss';

const { protocol, hostname } = location;
const target = `${protocol}//${hostname}:8000/weather`;

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