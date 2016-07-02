import codePush from 'react-native-code-push';

import UpdateAppButton from './UpdateAppButton';
import Middot from './lib/icons';

// call in the root component's on componentDidMount so that
// it is only called once (or just call in this file)
codePush.notifyAppReady();

export {
  UpdateAppButton,
	Middot
};

export default UpdateAppButton;
