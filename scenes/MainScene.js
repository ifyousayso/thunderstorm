import { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	ImageBackground,
	Pressable,
	useWindowDimensions,
	Alert
} from "react-native";
import * as Location from "expo-location";

import {
	getWeather,
	addAsFavorite,
	getWeatherByCity,
	listFavorites
} from "../utilities/http";
import Spinner from "../components/ui/Spinner";

const weatherStyles = () => {
	const { width, height } = useWindowDimensions();

	const landscapeMode = width > height;
	const landscapeRatio = landscapeMode ? 2 : 1;

	const styles = StyleSheet.create({
		screen: {
			flex: 1
		},
		background: {
			flex: 1,
			justifyContent: "center",
			paddingHorizontal: landscapeMode ? 0 : Math.round(width / 10),
			paddingVertical: landscapeMode ? Math.round(width / 30) : 0,
			flexDirection: landscapeMode ? "row" : "column"
		},
		textColor: {
			color: "#fff"
		},
		myWeather: {
			width: landscapeMode ? "45%" : "100%",
			alignItems: "center",
			justifyContent: "center",
			marginBottom: landscapeMode ? 0 : Math.round(width / 12)
		},
		localityWeather: {
			width: landscapeMode ? "45%" : "100%",
			justifyContent: "center",
			alignItems: "center"
		},
		localityWeatherResult: {
			alignItems: "center",
			marginTop: Math.round(landscapeMode ? height / 18 : width / 12)
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
		inputField: {
			width: "70%",
			fontSize: Math.round(width / 18 / landscapeRatio),
			borderBottomColor: "#fff",
			borderBottomWidth: Math.round(width / 256 / landscapeRatio),
			paddingVertical: Math.round(width / 256 / landscapeRatio)
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
			fontSize: Math.round(width / 20 / landscapeRatio)
		},
		pressed: {
			opacity: 0.6
		}
	});

	return { styles, width, height };
};

export default () => {
	const [city, setCity] = useState("");
	const [isLoading, setIsLoading] = useState(true);
	const [location, setLocation] = useState(null);
	const [searchedLocation, setSearchedLocation] = useState(null);

	const { styles } = weatherStyles();

	useEffect(() => {
		(async () => {
			// Be om lov att få använda GPS-enheten.
			let { status } = await Location.requestForegroundPermissionsAsync();

			if (status === "granted") {
				// Hämta latitud och longitud för enhetens posision.
				let location = await Location.getCurrentPositionAsync();
				const currentLocation = await getWeather(
					location.coords.latitude,
					location.coords.longitude
				);
				setLocation(currentLocation);
			}

			setIsLoading(false);
		})();
	}, []);

	const localityNotFound = () => {
		Alert.alert(
			"Information",
			"No locality named " + city + " could be found."
		);
	};

	const onSearchHandler = async () => {
		try {
			const location = await getWeatherByCity(city);

			if (!location) {
				localityNotFound();
			} else {
				setSearchedLocation(location);
			}
		} catch (error) {
			localityNotFound();
		}
	};

	const onSaveAsFavorite = async () => {
		const favorites = await listFavorites();

		const favorite = favorites.find(
			(item) => item.city === searchedLocation.name
		);
		if (favorite) {
			Alert.alert(
				"Information",
				searchedLocation.name + " is already in your favorites list."
			);
			return;
		}

		const weatherData = {
			city: searchedLocation.name,
			latitude: searchedLocation.coord.lat,
			longitude: searchedLocation.coord.lon
		};
		await addAsFavorite(weatherData);
		Alert.alert(
			"Information",
			searchedLocation.name + " is added to your favorites."
		);
	};

	if (isLoading) {
		return <Spinner text="Fetching location - please wait" />;
	}

	const showLocalityWeather = () => {
		if (searchedLocation !== null) {
			return (
				<>
					<View style={styles.localityWeatherResult}>
						<Text style={[styles.mainTitle, styles.textColor]}>
							{searchedLocation.name}
						</Text>
						<Text style={[styles.subTitle, styles.textColor]}>
							{Math.round(searchedLocation.main.temp) + " °C"}
						</Text>
					</View>
					<View style={styles.button}>
						<Pressable
							onPress={onSaveAsFavorite}
							style={({ pressed }) => pressed && styles.pressed}
						>
							<Text style={[styles.buttonText, styles.textColor]}>
								Save as favorite
							</Text>
						</Pressable>
					</View>
				</>
			);
		} else {
			return "";
		}
	};

	return (
		<View style={styles.screen}>
			<ImageBackground
				style={styles.background}
				source={require("../assets/images/background.jpg")}
			>
				<View style={styles.myWeather}>
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
				</View>

				<View style={styles.localityWeather}>
					<TextInput
						style={[styles.inputField, styles.textColor]}
						placeholder="Locality"
						placeholderTextColor="#b3b2b2"
						onChangeText={(value) => setCity(value)}
						value={city}
					/>
					<View style={styles.button}>
						<Pressable
							onPress={onSearchHandler}
							style={({ pressed }) => pressed && styles.pressed}
						>
							<Text style={[styles.buttonText, styles.textColor]}>Search</Text>
						</Pressable>
					</View>
					{showLocalityWeather()}
				</View>
			</ImageBackground>
		</View>
	);
};
