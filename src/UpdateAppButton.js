import React, { Component, PropTypes } from 'react';
import { Alert, View, Text, LayoutAnimation, AppState } from 'react-native';
import { InstallMode } from 'react-native-code-push';
import downloadNewVersion from './lib/downloadNewVersion';
import { getVersionMetaData } from './lib/utils';
import makeCancelable from './lib/makeCancelable';

export class UpdateAppButton extends Component {
	constructor ({ checkForUpdate }) {
		super();
		this.state = { newVersion: null };
		this.handleUpdatePress = this.handleUpdatePress.bind(this);
		this._handleNewVersion = this._handleNewVersion.bind(this);
		this.install = this.install.bind(this);

		if (checkForUpdate.onResume) {
			this._onAppStateChange =  (newState) => newState === 'active' && this._checkForUpdate();
			AppState.addEventListener('change', this._onAppStateChange);
		}

		if (checkForUpdate.onInterval) {
			this._interval = setTimeout(
				() => this._checkForUpdate(),
				checkForUpdate.checkEvery
			);
		}
	}

	componentDidMount () {
		if (this.props.checkForUpdate.onMount) this._checkForUpdate();
	}

	componentWillUnmount () {
		if (this._cancelablePromise) this._cancelablePromise.cancel();
		if (this._onAppStateChange) AppState.removeEventListener('change', this._onAppStateChange);
		if (this._interval) clearInterval(this._interval);
	}

	_checkForUpdate () {
		const cancelablePromise = makeCancelable(downloadNewVersion());
		cancelablePromise.promise
		.then(this._handleNewVersion)
		.catch((err) => console.log('[react-native-cp-update-button] download caught an error', err));
		this._cancelablePromise = cancelablePromise;
	}

	_handleNewVersion (newVersion) {
		if (!newVersion) return;
		if (this.props.animate) LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		this.setState({ newVersion });
	}

	handleUpdatePress () {
		if (this.props.updateOnPress) return this.install();
		const {description} = this.state.newVersion;

		Alert.alert(
			this.props.promptTitle, // title
			description || this.props.promptMessage, // mesage (body)
			// buttons
			[{
				text: this.props.confirmButtonText,
				onPress: this.install,
			}, {
				text: this.props.cancelButtonText,
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
	checkForUpdate: {
		onMount: true, // will check on mount of the component
		onResume: false, // will check when the app resumes
		onInterval: false, // will check every interval in milliseconds (checkEvery)
		checkEvery: 5 * 60 * 1000 // the length of the interval that ^ will use if true
	},
	promptTitle: 'New Update Available',
	promptMessage: 'A new update is now available. Do you want to update now? Note: Updating will restart the app and any changes not saved will be lost.',
	cancelButtonText: 'Cancel',
	confirmButtonText: 'Update Now',
};

UpdateAppButton.propTypes = {
	animate: PropTypes.bool,
	updateOnPress: PropTypes.bool,
	component: PropTypes.func.isRequired,
	checkForUpdate: PropTypes.shape({
		onMount: React.PropTypes.bool,
		onResume: React.PropTypes.bool,
		onInterval: React.PropTypes.bool,
		checkEvery: React.PropTypes.number,
	}),
	promptTitle: PropTypes.string,
	promptMessage: PropTypes.string,
	cancelButtonText: PropTypes.string,
	confirmButtonText: PropTypes.string,
};

export default UpdateAppButton;
