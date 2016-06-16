import React from 'react';
import {
  StyleSheet,
	TouchableOpacity,
  Text,
  View
} from 'react-native';

const EXAMPLES = [{
	title: 'Default Behaviour',
	description: 'If you just pass the component to render, <UpdateAppButton /> will assume you want a confirmation alert when updating and will animate default.',
}, {
	title: 'Tailoring the Prompt',
	description: 'You can change the confirmation\'s prompt title, message and the text of the confirm button by simply passing some additonal props to <UpdateAppButton />',
}, {
	title: 'Updating onPress',
	description: "Showing the confirmation alert breaks iOS' AppStore guidelines, so alernatively you can update the app immediately when calling the function shownUpdatePrompt.",
}, {
	title: 'Animated Button',
	description: "You can set the prop animated to false and instead use the Animated API to animate the change in state when a new version becomes available within the app.",
}];

export const Panels = ({ children, style, selectedIndex }) => {
	return (
		<View style={style}>
			{EXAMPLES.map((example, i) => {
				return (
					<Panel
						{...example}
						key={i}
						show={selectedIndex === i}>
						{children[i]}
					</Panel>
				);
			})}
		</View>
	);
};

const Panel = ({ show, children, title, description }) => {
	if (!show || !children) return null;
	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<View style={{ borderColor: '#fff', borderBottomWidth: 2, paddingBottom: 4, marginBottom: 10 }}>
				<Text style={styles.panelTitle}>{title.toUpperCase()}</Text>
			</View>
			<Text style={{ fontSize: 16, color: '#fff', fontFamily: 'Gill Sans' }}>{description}</Text>
			<View style={{ marginTop: 40 }}>{children}</View>
		</View>
	);
};

export const Tabs = ({ selectedIndex, onTabPress }) => (
	<View style={styles.tabs}>
		{EXAMPLES.map((example, i) => (
			<Tab
				number={i + 1}
				key={i}
				selectedIndex={selectedIndex === i}
				onPress={() => onTabPress(i)}
			/>
		))}
	</View>
);

export const Tab = ({ number, onPress, selectedIndex }) => (
	<TouchableOpacity
		style={[styles.tab, selectedIndex && styles.selectedTab]}
		onPress={onPress}>
		<Text style={[styles.tabText, selectedIndex && styles.selectedText]}>
			{number}
		</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	tabs: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 200,
	},
	tab: {
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		width: 40,
		height: 40,
		borderRadius: 10,
	},
	tabText: {
		fontSize: 18,
		fontWeight: 'bold',
		color: '#3498db',
		fontFamily: 'Futura'
	},
	selectedTab: {
		backgroundColor: '#3498db',
	},
	selectedText: {
		color: '#fff',
	},
	panelTitle: {
		color: '#fff',
		fontSize: 22,
		fontFamily: 'Futura',
	},
});
