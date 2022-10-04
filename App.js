import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, View, Text } from "react-native";
import { StatusBar } from "expo-status-bar";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainScene from "./scenes/MainScene";
import FavoritesScene from "./scenes/FavoritesScene";
import DetailsScene from "./scenes/DetailsScene";
import IconButton from "./components/ui/IconButton";

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
	screen: {
		flex: 1
	}
});

export default () => (
	<View style={styles.screen}>
		<StatusBar style="light" />
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerStyle: { backgroundColor: "#560856" },
					headerTintColor: "#ffffff",
					title: "Thunderstorm"
				}}
			>
				<Stack.Screen
					name="Main"
					component={MainScene}
					options={({ navigation }) => ({
						headerRight: ({ tintColor }) => (
							<IconButton
								icon="bookmark-o"
								color={tintColor}
								size={18}
								onPress={() => {
									navigation.navigate("Favorites");
								}}
							/>
						)
					})}
				/>
				<Stack.Screen
					name="Favorites"
					component={FavoritesScene}
					options={{ title: "Favorites" }}
				/>
				<Stack.Screen
					name="Details"
					component={DetailsScene}
					options={{ title: "" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	</View>
);
