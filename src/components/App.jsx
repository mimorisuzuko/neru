import React from 'react';
import Weather from './Weather/App';
import Me from './Me/App';
import SwipeableViews from 'react-swipeable-views';

const App = () => (
	<SwipeableViews style={{ height: '100%' }} containerStyle={{ height: '100%' }} slideStyle={{ height: '100%' }}>
		<Weather />
		<Me />
	</SwipeableViews>
);

export default App;