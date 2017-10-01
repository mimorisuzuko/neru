import React, { Component } from 'react';
import moment from 'moment';
import { item } from './Forecast.scss';

class Forecast extends Component {
	render() {
		const { props: { forecast } } = this;

		if (!forecast) {
			return null;
		}

		return (
			<div styleName='base'>
				{forecast.slice(0, 5).map(({ main, date, temperature, humidity, precipitation, }, i) => (
					<div key={i} className={item}>
						<time>{moment(date).format('MM/DD HH:mm')}</time>
						<div>
							<div styleName='weather'>
								{main} <small>{temperature}℃</small>
							</div>
							<div>{humidity}%, {precipitation}mm/h</div>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Forecast;