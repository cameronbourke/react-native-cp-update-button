react-native-cp-update-button
=============================

[CodePush](https://microsoft.github.io/code-push/) is really great tool to deploy React Native app updates directly to our users' devices without the need of going through the App or Play Store. However, sometimes we need to give more control to our users to let them update the app as opposed to silently updating it in the background. The goal of `react-native-cp-update-button` is to make this updating workflow straight forward and quick to implement.

> Currently iOS is only supported, however Android support will land shortly!

* [Installation](#installation)
* [Demo & Example](#demo--example)
* [Components](#components)
		* [<UpdateAppButton />](updateappbutton-)
		* [<AppVersion />](appversion-)
		* [<Middot />](middot-)
* [Basic Usage](#basic-usage)
* [Advanced Usage](#advanced-usage)
* [Animation](#animation)
* [Deploying Updates](#deploying-updates)

## Installation
```
npm install --save react-native-cp-update-button
```

Note, `react-native-cp-update-button` also requires on the following dependencies:
- [React Native](https://facebook.github.io/react-native/) 15.0 or later
- [React](https://facebook.github.io/react/) 0.15 or later
- [React Native Code Push](https://github.com/Microsoft/react-native-code-push) 1.12.2-beta or later

## Example & Demo
```
git clone https://github.com/cameronbourke/react-native-cp-update-button
cd react-native-cp-update-button
npm install
cd example/UpdateButtonDemo
npm install
```

Then open the Xcode project at `ios/UpdateButtonDemo.xcodeproj`

Currently `npm link` does not work with React Native's packager, so temporarily to get around that `npm start` actually runs a babel command that will output the `/src` directory into `/example/UpdateButtonDemo/dev` which explains why you will see the following when in the example app:

```js
import {
	UpdateAppButton,
	Middot,
	AppVersion
} from './dev/react-native-cp-update-button';
```


## Components
`react-native-cp-update-button` is made up of three React components that provide the building blocks to quickly add a button to allow your users to update their version of the app installed.

#### `<UpdateAppButton />`
This component gives you the ability to simply invoke a function to show a confirmation prompt to the user that will update the app immediately when the confirmation button is pressed.

| Property          | Type     | Default     | Description
|------------------ | -------- | ----------- | --------
| animate           | boolean  | true        | LayoutAnimation.configureNext will be called when a new version becomes available, animating any layout change in the next render
| component         | function | (required)  | react component will be rendered, [see usage for more details](#basic-version)
| updateOnPress     | bool     | false       | whether to update the app immediately without showing the confirm prompt
| promptTitle       | string   | New Update Available | short title of the confirmation prompt shown to the user
| promptMessage     | string   | A new update is now available. Do you want to update now? Note: Updating will restart the app and any changes not saved will be lost. | body of the confirmation prompt shown to the user
| confirmButtonText | string   | Update Now  | the text for the confirmation prompt's confirm button

#### `<AppVersion />`
This component will display the installed CodePush version, **not** the binary version of the app. Make sure to read over [Deploying Updates](#deploying-updates) to understand how to set the app version.

| Property          | Type     | Default         | Description
|------------------ | -------- | --------------- | --------
| binary            | string   | true (required) | if there are not any installs from CodePush yet on the device, no value for the version is returned and therefore you need to specific what the binary version of the installed app was
| style             | object   |                 | accepts all the style properties for the <Text /> component

#### `<Middot />`
A common pattern these days is to show a middot to indicate there is a notification component, think Slack for example. To save you building your own, you can import one prepared a little earlier.

| Property          | Type     | Default      | Description
|------------------ | -------- | ------------ | --------
| color             | string   | #e74c3c      | background color for the outer circle
| size              | number   |  22          | specifies the size of the outer circle


## Basic Usage
The gist of how this works is that you need to create a component to pass to `<UpdateAppButton />`. In the example below, `AppLogo` is a simple component that renders the app logo and only shows `<Middot />` when a new version is available for the user to download. Notice, the component has access to two props:
- **newVersion**: either will be `null` if there is no new version, or a `CodePush` [localPackage](https://github.com/Microsoft/react-native-code-push#localpackage)
- **shownUpdatePrompt**: function that when called will show a confirmation prompt to update the app

```js
import { AppUpdateButton, Middot, AppVersion } from 'react-native-cp-update-button';

const AppLogo = ({ newVersion, shownUpdatePrompt }) => (
	<TouchableOpacity
		disabled={!newVersion}
		onPress={shownUpdatePrompt}>
		{newVersion ? <Middot /> : null}
		<Image src={require('../img/example-logo.png')} />
	</TouchableOpacity>
);
```

Now all that is left to do is to render these components. You don't need to have both `UpdateAppButton` and `AppVersion` together, but for the sake of simplification the `App` component below does.  
```js
class App extends React.Component {
	...
	render () {
		return (
			<View>
				...
				<UpdateAppButton component={AppLogo} />
				<AppVersion binary='1.0.0' />
			</View>
		)
	}
}
```

## Advanced Usage

## Animation

## Deploying Updates
One of best parts about `react-native-cp-update-button` is that it does not need any new tooling, you can just use the `code-push` cli like you normally would to push updates to your React Native app. Everything the component needs to know is achieved by setting a stringified object for the `--description` option in the cli. An example command to deploy an update may look like the following:

```
code-push release-react UpdateButtonDemo ios -d Production --description '{"version":"1.3.0", "promptMessage": "There are plenty of new features in this goodie of an update"}'
```

If a value for `promptTitle, promptMessage or confirmButtonText` is on the stringified object, it will be used over the corresponding value/s that were passed as props to `<UpdateAppButton />`

> Note: if the object is not stringified correctly, none of the data within the object will be used and instead will default to the default values
