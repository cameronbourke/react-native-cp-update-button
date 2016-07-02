import React from 'react';
import {
  AppRegistry,
  StyleSheet,
	TouchableOpacity,
  Text,
	StatusBar,
	Animated,
  View
} from 'react-native';
import { Tabs, Panels } from './components';

import {
	UpdateAppButton,
	Middot,
} from './dev/react-native-cp-update-button';

/*
APP_VERSION would usually live in a constants module where
you would increment it each time you release a new version
*/
const APP_VERSION = 'v1.7.4';

const AppVersion = () => (
	<Text style={styles.appVersion}>
		{APP_VERSION}
	</Text>
);

class UpdateButtonDemo extends React.Component {
	constructor () {
		super();
		this.state = { selectedIndex: 0 };
	}

	render () {
		return (
			<View style={styles.container}>
				<StatusBar barStyle='light-content' />
				<Tabs
					selectedIndex={this.state.selectedIndex}
					style={{ flex: 1 }}
					onTabPress={(selectedIndex) => this.setState({ selectedIndex })}
				/>
				<Panels selectedIndex={this.state.selectedIndex} style={{ flex: 7 }}>

					{/* Example 1 */}
					<UpdateAppButton component={AppName} />

					{/* Example 2 */}
					<UpdateAppButton
						component={AppName}
						animated={true}
						promptTitle="What's New?"
						promptMessage='This is where you would show the value passed to --description when releasing with code push.'
						confirmButtonText="Lets do it!"
					/>

					{/* Example 3 */}
					<UpdateAppButton
						component={AppName}
						updateOnPress
					/>

					{/* Example 4 */}
					<UpdateAppButton
						component={AnimatedAppName}
						animated={false}
					/>

    		</Panels>

				{/*  Installed App Version */}
				<Text style={styles.footer}>
					Installed App Version: {'  '}
					<AppVersion />
				</Text>
			</View>
		);
	}
}


// Components Passed to <UpdateAppButton />
// ----------------------------------------

// Straightforward Component
const AppName = ({ newVersion, shownUpdatePrompt }) => (
	<TouchableOpacity
		disabled={!newVersion}
		style={styles.button}
		onPress={shownUpdatePrompt}>
		{newVersion ? <Middot style={styles.middot} /> : null}
		<Text style={styles.buttonText}>Update App Demo</Text>
	</TouchableOpacity>
);

// Animated Component
class AnimatedAppName extends React.Component {
	constructor () {
		super();
		this.state = {
			slideAnim: new Animated.Value(175),
		};
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.newVersion === nextProps.newVersion) return;
		Animated.spring(
			this.state.slideAnim,
			{ toValue: 10 }
		).start();
	}

	render () {
		const translateX = {
			transform: [{
				translateX: this.state.slideAnim
			}, {
				translateY: -35
			}]
		};
		const text = <Text style={styles.buttonText}>Update App Demo</Text>;
		if (this.props.newVersion) return (
			<TouchableOpacity
				style={styles.button}
				onPress={this.props.shownUpdatePrompt}>
				{text}
				<Animated.View style={translateX}>
					<Middot style={styles.middot} />
				</Animated.View>
			</TouchableOpacity>
		);
		return <View style={styles.button}>{text}</View>;
	}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
		paddingTop: 60,
		paddingLeft: 20,
		paddingRight: 20,
    justifyContent: 'center',
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
		fontStyle: 'italic',
		fontFamily: 'Gill Sans',
	},
	footer: {
		flex: 1,
		color: '#fff',
		fontSize: 18,
		fontFamily: 'Gill Sans'
	},
});

AppRegistry.registerComponent('UpdateButtonDemo', () => UpdateButtonDemo);
