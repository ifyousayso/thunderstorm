import axios from "axios";

const WEATHER_URL =
	"https://api.openweathermap.org/data/2.5/weather?appid=bd1437c53b15df8bd7e809ef8391d83d&units=metric&lang=en&";
const FIREBASE_URL =
	"https://thunderstorm-4d940-default-rtdb.europe-west1.firebasedatabase.app/";
const FIREBASE_NAME = "favorites";

export async function getWeather(lat, lon) {
	const url = WEATHER_URL + "lat=" + lat + "&lon=" + lon;
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.log(error);
	}
}

export async function getWeatherByCity(city) {
	let response;
	try {
		const url = WEATHER_URL + "q=" + city;
		response = await axios.get(url);
		return response.data;
	} catch (error) {
		throw new Error("An error has occured.");
	}
}

export async function addAsFavorite(weatherInfo) {
	await axios.post(
		FIREBASE_URL + FIREBASE_NAME + ".json",
		JSON.stringify(weatherInfo)
	);
}

export async function listFavorites() {
	const url = FIREBASE_URL + FIREBASE_NAME + ".json";
	const response = await axios.get(url);
	const favorites = [];

	for (const key in response.data) {
		const favorite = {
			id: key,
			city: response.data[key].city
		};

		favorites.push(favorite);
	}

	return favorites;
}

export async function getFavorite(id) {
	const url = `${FIREBASE_URL}/${FIREBASE_NAME}/${id}.json`;
	const response = await axios.get(url);
	return response.data;
}

export async function deleteFavorite(id) {
	const url = `${FIREBASE_URL}/${FIREBASE_NAME}/${id}.json`;
	await axios.delete(url);
}
