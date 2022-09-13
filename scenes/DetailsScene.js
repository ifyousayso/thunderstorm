import { useState, useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import { getFavorite, getWeather } from "../utilities/http";
import Camera from "../components/Camera";

const detailsStyles = () => {
	const { width } = useWindowDimensions();
	const styles = StyleSheet.create({
		screen: {
			flex: 1,
			backgroundColor: "#140e53"
		},
		container: {
			justifyContent: "center",
			alignItems: "center",
			paddingVertical: 50
		},
		mainTitle: {
			fontSize: width < 380 ? 24 : 38
		},
		subTitle: {
			fontSize: width < 380 ? 16 : 24
		},
		smallTitle: {
			fontSize: width < 380 ? 14 : 18,
			marginVertical: 4
		},
		highAndLow: {
			flexDirection: "row"
		},
		displayRow: {
			flexDirection: "row",
			marginHorizontal: 4
		},
		textColor: {
			color: "#ffffff"
		},
		spacingHorizontal: {
			marginHorizontal: 4
		}
	});

	return { styles };
};

export default ({ route }) => {
	const [location, setLocation] = useState(null);

	const { styles } = detailsStyles();

	useEffect(() => {
		(async () => {
			const response = await getFavorite(route.params.cityId);
			const location = await getWeather(response.latitude, response.longitude);
			setLocation(location);
		})();
	}, []);

	return (
		<View style={styles.screen}>
			<View style={styles.container}>
				<Text style={[styles.mainTitle, styles.textColor]}>
					{location?.name}
				</Text>
				<Text style={[styles.smallTitle, styles.textColor]}>
					Aktuell temperatur
				</Text>
				<Text style={[styles.mainTitle, styles.textColor]}>
					{Math.ceil(location?.main.temp)}°
				</Text>
				<Text style={[styles.smallTitle, styles.textColor]}>
					{location?.weather[0].description}
				</Text>
				<View style={styles.highAndLow}>
					<Text style={[styles.smallTitle, styles.textColor]}>
						H: {Math.ceil(location?.main.temp_max)}°
					</Text>
					<Text> </Text>
					<Text style={[styles.smallTitle, styles.textColor]}>
						L: {Math.ceil(location?.main.temp_min)}°
					</Text>
				</View>
				<View style={styles.displayRow}>
					<Text
						style={[
							styles.textColor,
							styles.smallTitle,
							styles.spacingHorizontal
						]}
					>
						Luftfuktighet:
					</Text>
					<Text style={[styles.textColor, styles.smallTitle]}>
						{location?.main.humidity}%
					</Text>
				</View>
			</View>
			<Camera />
		</View>
	);
};
