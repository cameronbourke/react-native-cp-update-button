import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import codePush, { UpdateState } from 'react-native-code-push';
import { getVersionMetaData } from './lib/utils';
import makeCancelable from './lib/makeCancelable';

export class AppVersion extends Component {
	constructor () {
		super();
		this.state = { versionNumber: '' };
		this._handleLocalVersion = this._handleLocalVersion.bind(this);
	}

	componentDidMount () {
		const cancelablePromise = makeCancelable(codePush.getUpdateMetadata(UpdateState.RUNNING));
		cancelablePromise.promise
		.then(this._handleLocalVersion)
		.catch((err) => console.log('[react-native-cp-update-button] download caught an error', err));
		this._cancelablePromise = cancelablePromise;
	}

	componentWillUnmount () {
		this._cancelablePromise.cancel();
	}

	_handleLocalVersion (runningVersion) {
		if (!runningVersion) return;
		// app version and not neccessarily the app version that was compiled with the binary
		const { version } = getVersionMetaData(runningVersion);
		this.setState({ versionNumber: version });
	}

	render () {
		const currentVersion = this.state.versionNumber || this.props.binary;
		if (!currentVersion) return null;
		return (
			<Text style={this.props.style}>
				v{currentVersion}
			</Text>
		);
	}
}

AppVersion.defaultProps = {
	style: {
		fontSize: 18,
		fontStyle: 'italic',
	},
};

AppVersion.propTypes = {
	binary: PropTypes.string,
	style: Text.propTypes.style,
};


export default AppVersion;
