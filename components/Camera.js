import { useState } from "react";
import {
	Alert,
	Pressable,
	Image,
	StyleSheet,
	Text,
	View,
	useWindowDimensions
} from "react-native";
import {
	launchCameraAsync,
	useCameraPermissions,
	PermissionStatus
} from "expo-image-picker";

const cameraStyles = () => {
	const { width, height } = useWindowDimensions();

	const landscapeMode = width > height;
	const landscapeRatio = landscapeMode ? 2 : 1;

	const styles = StyleSheet.create({
		imageContainer: {
			width: landscapeMode ? "45%" : "90%",
			height: landscapeMode ? "90%" : "45%",
			justifyContent: "space-evenly",
			alignItems: "center"
		},
		imagePreview: {
			width: "100%",
			height: width * (landscapeMode ? 0.253125 : 0.50625),
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "#5b5bc9"
		},
		image: {
			width: "100%",
			height: "100%"
		},
		text: {
			fontSize: Math.round(width / 16 / landscapeRatio),
			color: "#fff"
		},
		button: {
			backgroundColor: "#560856",
			width: "70%",
			padding: Math.round(width / 42 / landscapeRatio),
			marginTop: Math.round((landscapeMode ? height : width) / 21),
			alignItems: "center",
			borderRadius: Math.round(width / 14 / landscapeRatio)
		},
		buttonText: {
			fontSize: Math.round(width / 20 / landscapeRatio),
			color: "#fff"
		},
		pressed: {
			opacity: 0.6
		}
	});

	return { styles };
};

export default () => {
	const [permissionInformation, requestPermission] = useCameraPermissions();
	const [image, setImage] = useState();

	const { styles } = cameraStyles();

	const verifyAccess = async () => {
		if (permissionInformation.status === PermissionStatus.UNDETERMINED) {
			const response = await requestPermission();

			return response.granted;
		}

		if (permissionInformation.status === PermissionStatus.DENIED) {
			Alert.alert("No no no no", "AAAARGH!");

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

		setImage(image);
	};

	let imagePreview = <Text style={styles.text}>No photo</Text>;

	if (image) {
		imagePreview = <Image style={styles.image} source={{ uri: image.uri }} />;
	}

	return (
		<View style={styles.imageContainer}>
			<View style={styles.imagePreview}>{imagePreview}</View>
			<View style={styles.button}>
				<Pressable
					onPress={onPressTakePhoto}
					style={({ pressed }) => pressed && styles.pressed}
				>
					<Text style={styles.buttonText}>Take photo</Text>
				</Pressable>
			</View>
		</View>
	);
};
