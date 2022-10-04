import { useState, useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

import { getFavorite, getWeather } from "../utilities/http";
import Camera from "../components/Camera";
import Spinner from "../components/ui/Spinner";

const detailsStyles = () => {
	const { width, height } = useWindowDimensions();

	const landscapeMode = width > height;
	const landscapeRatio = landscapeMode ? 2 : 1;

	const styles = StyleSheet.create({
		scene: {
			flex: 1,
			backgroundColor: "#140e53",
			justifyContent: "space-evenly",
			alignItems: "center",
			flexDirection: landscapeMode ? "row" : "column"
		},
		localityWeather: {
			width: landscapeMode ? "45%" : "100%",
			height: landscapeMode ? "100%" : "45%",
			justifyContent: "center",
			alignItems: "center"
		},
		mainTitle: {
			fontSize: Math.round(width / 12 / landscapeRatio)
		},
		subTitle: {
			fontSize: Math.round(width / 16 / landscapeRatio)
		},
		smallTitle: {
			fontSize: Math.round(width / 20 / landscapeRatio),
			lineHeight: Math.round(width / 13 / landscapeRatio)
		},
		highAndLow: {
			width: "100%",
			flexDirection: "row",
			justifyContent: "space-evenly"
		},
		textColor: {
			color: "#fff"
		}
	});

	return { styles };
};

export default ({ route }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [location, setLocation] = useState(null);

	const { styles } = detailsStyles();

	useEffect(() => {
		(async () => {
			const response = await getFavorite(route.params.cityId);
			const location = await getWeather(response.latitude, response.longitude);
			setLocation(location);

			setIsLoading(false);
		})();
	}, []);

	if (isLoading) {
		return <Spinner text="Loading weather - please wait" />;
	}

	return (
		<View style={styles.scene}>
			<View style={styles.localityWeather}>
				<Text style={[styles.mainTitle, styles.textColor]}>
					{location?.name}
				</Text>
				<Text style={[styles.subTitle, styles.textColor]}>
					{Math.round(location?.main.temp)} °C
				</Text>
				<Text style={[styles.smallTitle, styles.textColor]}>
					{location?.weather[0].description}
				</Text>
				<View style={styles.highAndLow}>
					<Text style={[styles.smallTitle, styles.textColor]}>
						High: {Math.round(location?.main.temp_max)} °C
					</Text>
					<Text style={[styles.smallTitle, styles.textColor]}>
						Low: {Math.round(location?.main.temp_min)} °C
					</Text>
				</View>
				<Text style={[styles.textColor, styles.smallTitle]}>
					Humidity: {location?.main.humidity}%
				</Text>
			</View>
			<Camera />
		</View>
	);
};
