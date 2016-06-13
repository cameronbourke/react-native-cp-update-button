import React from 'react';
import { View } from 'react-native';

export const Middot = ({ color, size, style }) => {
	const styles = {
		width: size,
		height: size,
		borderRadius: size,
		borderWidth: size * 0.4,
		backgroundColor: 'white',
		borderColor: color,
	};
	return <View style={[style, styles]} />;
};

Middot.defaultProps = {
	color: '#e74c3c',
	size: 22,
}

export default Middot;
