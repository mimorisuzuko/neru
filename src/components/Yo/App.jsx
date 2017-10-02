import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import liburl from 'url';
import apiTarget from '../api-target';
import './App.scss';

const target = liburl.resolve(apiTarget, 'yo');

class App extends Component {
	constructor() {
		super();

		this.state = { disabled: false };
	}

	@autobind
	onClick() {
		this.setState({ disabled: true });

		fetch(target, {
			method: 'POST'
		}).then(() => {
			setTimeout(() => this.setState({ disabled: false }), 60000);
		}).catch((err) => {
			this.setState({ disabled: false });
			console.error(err);
		});
	}

	render() {
		const { state: { disabled } } = this;

		return (
			<div styleName='base'>
				<img src='/assets/me.jpg' />
				<button disabled={disabled} onClick={this.onClick}>Yo</button>
			</div>
		);
	}
}

export default App;