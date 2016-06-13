import React, { Component, PropTypes } from 'react';
import { Alert, View, Text, LayoutAnimation } from 'react-native';
import { InstallMode } from 'react-native-code-push';
import downloadNewVersion from './lib/downloadNewVersion';
import { getVersionMetaData } from './lib/utils';

const ALERT_MESSAGE = 'A new update is now available. Do you want to update now? Note: Updating will restart the app and any changes not saved will be lost.';
const ALERT_TITLE = 'New Update Available';
const CONFIRM_BUTTON_TEXT = 'Update Now';

export class UpdateAppButton extends Component {
	constructor () {
		super();
		this.state = {
			newVersion: null,
		};
		this.handleUpdatePress = this.handleUpdatePress.bind(this);
		this._handleNewVersion = this._handleNewVersion.bind(this);
		this.install = this.install.bind(this);
	}

	componentDidMount () {
		// only fetch for an update if we don't have one in state already
		if (this.state.newVersion) return;
		downloadNewVersion()
		.then(this._handleNewVersion)
		.catch((err) => console.log('[CodePush update] download caught an error', err));
	}

	_handleNewVersion (newVersion) {
		if (!newVersion) return;
		console.log('[CodePush] newVersion:', newVersion);
		if (this.props.animate) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({ newVersion });
	}

	handleUpdatePress () {
		const {alertTitle, alertMessage, updateOnPress, confirmButtonText} = this.props;
		if (updateOnPress) return this.install();
		const metaData = getVersionMetaData(this.state.newVersion);

		Alert.alert(
			// title
			alertTitle || metaData.alertTitle || ALERT_TITLE,
			// mesage (body)
			alertMessage || metaData.alertMessage || ALERT_MESSAGE,
			// buttons
			[{
				text: confirmButtonText || CONFIRM_BUTTON_TEXT,
				onPress: this.install,
			}, {
				text: 'Cancel',
				onPress: () => console.log('[CodePush update] cancel update pressed'),
				style: 'cancel',
			}]
		);
	}

	install () {
		this.state.newVersion.install(InstallMode.IMMEDIATE);
	}

	render () {
		return React.createElement(this.props.component, {
			newVersion: this.state.newVersion,
			shownUpdatePrompt: this.handleUpdatePress,
		});
	}
};

UpdateAppButton.defaultProps = {
	animate: false,
	updateOnPress: false,
	// yet to be determined
};

UpdateAppButton.propTypes = {
	animate: PropTypes.bool,
	component: PropTypes.func,
	message: PropTypes.string,
	updateOnPress: PropTypes.bool,
	// yet to be determined
};

export default UpdateAppButton;
