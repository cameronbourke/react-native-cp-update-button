import React from 'react';
import {
  AppRegistry,
  StyleSheet,
	TouchableOpacity,
  Text,
	StatusBar,
  View
} from 'react-native';

import { UpdateAppButton, Middot, AppVersion } from './dev/react-native-cp-update-button';

const UpdateButtonDemo = () => (
	<View style={styles.container}>
		<StatusBar barStyle='light-content' />

		{/*<View>
			<Text>Default</Text>
			<UpdateAppButton component={AppName} />
  	</View>*/}

		<View>
			{/*<Text>Show Description</Text>*/}
			<UpdateAppButton
				component={AppName}
				animate
			/>
  	</View>

		{/*<View>
			<Text>Update onPress</Text>
			<UpdateAppButton
				component={AppName}
				updateOnPress
			/>
		</View>*/}

		<View>
			<Text>Installed App Version</Text>
			<AppVersion style={styles.appVersion} />
  	</View>
	</View>
);

const AppName = ({ newVersion, shownUpdatePrompt }) => {
	const text = <Text style={styles.buttonText}>Update App Demo</Text>;
	if (newVersion) {
		return (
			<TouchableOpacity
				style={styles.button}
				onPress={shownUpdatePrompt}>
				<Middot style={styles.middot} />
				{text}
			</TouchableOpacity>
		);
	};
	return <View style={styles.button}>{text}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3498db',
  },
  button: {
		backgroundColor: '#fff',
		paddingTop: 12,
		paddingLeft: 12,
		paddingRight: 12,
		paddingBottom: 12,
		borderRadius: 15,
  },
	buttonText: {
		color: '#3498db',
		textAlign: 'center',
		fontSize: 18,
	},
	middot: {
		right: -10,
		top: -4,
		position: 'absolute',
	},
	appVersion: {
		color: '#fff',
		marginTop: 15,
		fontStyle: 'italic'
	},
});

AppRegistry.registerComponent('UpdateButtonDemo', () => UpdateButtonDemo);
