import React, { Component } from 'react';
import './Weather.scss';

class Weather extends Component {
	render() {
		const { props: { weather } } = this;

		if (!weather) {
			return null;
		}

		const { temperature, humidity, precipitation, main } = weather;

		return (
			<div styleName='base'>
				<div styleName='head'>
					{main} <span styleName='temp'>{temperature}℃</span>
				</div>
				<div styleName='others'>{humidity}%, {precipitation}mm/h</div>
			</div >
		);
	}
}

export default Weather;