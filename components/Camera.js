import { useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";
import {
	launchCameraAsync,
	useCameraPermissions,
	PermissionStatus
} from "expo-image-picker";

const styles = StyleSheet.create({
	imageContainer: {},
	imagePreview: {
		width: "100%",
		height: 200,
		marginVertical: 10,
		justifyContent: "center",
		alignItems: "center",
		fontSize: 24,
		backgroundColor: "#5b5bc9",
		color: "#fff"
	}
});

export default () => {
	const [permissionInformation, requestPermission] = useCameraPermissions();

	const verifyAccess = async () => {
		if (permissionInformation.status === PermissionStatus.UNDETERMINED) {
			const response = await requestPermission();

			console.log(response.granted);

			return response.granted;
		}

		if (permissionInformation.status === PermissionStatus.DENIED) {
			Alert.alert("Nono", "AAAARGH!");

			return false;
		}

		return true;
	};

	const onPressTakePhoto = async () => {
		const hasPermission = await verifyAccess();

		if (!hasPermission) return;

		const image = await launchCameraAsync({
			allowsEditing: true,
			aspect: [16, 9],
			quality: 0.5
		});
	};

	return (
		<View style={styles.imageContainer}>
			<View style={styles.imagePreview}>
				<Button title="*click*" onPress={onPressTakePhoto} />
			</View>
		</View>
	);
};
