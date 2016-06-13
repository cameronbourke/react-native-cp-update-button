import codePush from 'react-native-code-push';

import UpdateAppButton from './UpdateAppButton';
import AppVersion from './AppVersion';
import Middot from './lib/icons';

// call in the root component's on componentDidMount so that
// it is only called once (or just call in this file)
codePush.notifyAppReady();

export {
	AppVersion,
  UpdateAppButton,
	Middot
};

export default UpdateAppButton;
