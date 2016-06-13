import React, { Component, PropTypes } from 'react';
import { Text } from 'react-native';
import codePush, { UpdateState } from 'react-native-code-push';
import { getVersionMetaData } from './lib/utils';

export class AppVersion extends Component {
	constructor () {
		super();
		this.state = {
			versionNumber: '',
		};
		this._handleLocalVersion = this._handleLocalVersion.bind(this);
	}

	componentDidMount () {
		codePush.getUpdateMetadata(UpdateState.RUNNING)
		.then(this._handleLocalVersion);
	}

	_handleLocalVersion (runningVersion) {
		if (!runningVersion) return;
		// app version and not neccessarily the app version that was compiled with the binary
		const { version } = getVersionMetaData(runningVersion);
		this.setState({ versionNumber: version });
	}

	render () {
		if (!this.state.versionNumber.length) return null;
		return (
			<Text style={this.props.style}>
				v{this.state.versionNumber}
			</Text>
		);
	}
}

AppVersion.defaultProps = {
	// yet to be determined
};

AppVersion.propTypes = {
	// yet to be determined
};


export default AppVersion;
