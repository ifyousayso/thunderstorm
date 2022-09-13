import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		backgroundColor: "#201c4b"
	},
	loadingText: {
		fontSize: 18,
		color: "#ffffff",
		marginVertical: 12
	}
});

export default ({ text }) => {
	return (
		<View style={styles.screen}>
			<ActivityIndicator size="large" color="white" />
			<Text style={styles.loadingText}>{text}</Text>
		</View>
	);
};
