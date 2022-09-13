import { Pressable, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const styles = StyleSheet.create({
	container: {
		padding: 6,
		marginHorizontal: 8,
		marginVertical: 2
	},
	pressed: {
		opacity: 0.6
	}
});

export default ({ icon, size, color, onPress }) => {
	return (
		<Pressable
			onPress={onPress}
			style={({ pressed }) => pressed && styles.pressed}
		>
			<View style={styles.container}>
				<FontAwesome name={icon} size={size} color={color} />
			</View>
		</Pressable>
	);
};
