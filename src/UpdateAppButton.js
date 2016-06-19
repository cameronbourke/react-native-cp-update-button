import React, { Component, PropTypes } from 'react';
import { Alert, View, Text, LayoutAnimation } from 'react-native';
import { InstallMode } from 'react-native-code-push';
import downloadNewVersion from './lib/downloadNewVersion';
import { getVersionMetaData } from './lib/utils';
import makeCancelable from './lib/makeCancelable';

export class UpdateAppButton extends Component {
	constructor () {
		super();
		this.state = { newVersion: null };
		this.handleUpdatePress = this.handleUpdatePress.bind(this);
		this._handleNewVersion = this._handleNewVersion.bind(this);
		this.install = this.install.bind(this);
	}

	componentDidMount () {
		// only fetch for an update if we don't have one in state already
		if (this.state.newVersion) return;
		const cancelablePromise = makeCancelable(downloadNewVersion());
		cancelablePromise.promise
		.then(this._handleNewVersion)
		.catch((err) => console.log('[react-native-cp-update-button] download caught an error', err));
		this._cancelablePromise = cancelablePromise;
	}

	componentWillUnmount () {
		this._cancelablePromise.cancel();
	}

	_handleNewVersion (newVersion) {
		if (!newVersion) return;
		if (this.props.animate) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({ newVersion });
	}

	handleUpdatePress () {
		const {promptTitle, promptMessage, updateOnPress, confirmButtonText} = this.props;
		if (updateOnPress) return this.install();
		const metaData = getVersionMetaData(this.state.newVersion);

		Alert.alert(
			// title
			metaData.promptTitle || promptTitle,
			// mesage (body)
			metaData.promptMessage || promptMessage,
			// buttons
			[{
				text: metaData.confirmButtonText || confirmButtonText,
				onPress: this.install,
			}, {
				text: 'Cancel',
				onPress: () => console.log('[react-native-cp-update-button] cancel update pressed'),
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
	animate: true,
	updateOnPress: false,
	promptMessage: 'A new update is now available. Do you want to update now? Note: Updating will restart the app and any changes not saved will be lost.',
	promptTitle: 'New Update Available',
	confirmButtonText: 'Update Now',
};

UpdateAppButton.propTypes = {
	animate: PropTypes.bool,
	component: PropTypes.func.isRequired,
	updateOnPress: PropTypes.bool,
	promptTitle: PropTypes.string,
	promptMessage: PropTypes.string,
	confirmButtonText: PropTypes.string,
};

export default UpdateAppButton;
