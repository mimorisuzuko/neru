import React, { Component } from 'react';
import './Weather.scss';

class Weather extends Component {
	render() {
		const { props: { weather } } = this;

		if (!weather) {
			return null;
		}

		const { temp, tempMin, tempMax, main } = weather;

		return (
			<div styleName='base'>
				<div styleName='head'>
					{main} <span styleName='temp'>{temp.toFixed(2)}℃</span>
				</div>
				<div styleName='temp-minmax'>
					<span className='red'>{tempMax.toFixed(2)}℃</span>
					/
					<span className='blue'>{tempMin.toFixed(2)}℃</span>
				</div>
			</div>
		);
	}
}

export default Weather;