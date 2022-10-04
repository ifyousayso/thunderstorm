import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";

import { deleteFavorite, listFavorites } from "../utilities/http";
import IconButton from "../components/ui/IconButton";

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: "#383099"
	},
	item: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 12,
		backgroundColor: "#140e53",
		marginVertical: 8,
		marginHorizontal: 8,
		borderRadius: 4
	},
	itemText: {
		fontSize: 24
	},
	textColor: {
		color: "#fff"
	}
});

export default ({ navigation }) => {
	const [favorites, setFavorites] = useState([]);
	const getFavorites = async () => {
		const list = await listFavorites();
		setFavorites(list);
	};

	useEffect(() => {
		getFavorites();
	}, [getFavorites]);

	const onGotoDetailsHandler = (id) => {
		navigation.navigate("Details", { cityId: id });
	};

	const onDeleteFavoriteHandler = async (id) => {
		await deleteFavorite(id);
		await getFavorites();
	};

	const renderFavorite = (itemData) => {
		return (
			<View style={styles.screen}>
				<View style={styles.item}>
					<Pressable onPress={() => onGotoDetailsHandler(itemData.item.id)}>
						<Text style={[styles.itemText, styles.textColor]}>
							{itemData.item.city}
						</Text>
					</Pressable>
					<IconButton
						icon="trash-o"
						color="#9f1919"
						size={24}
						onPress={() => onDeleteFavoriteHandler(itemData.item.id)}
					/>
				</View>
			</View>
		);
	};

	return (
		<View style={styles.screen}>
			<FlatList
				data={favorites}
				renderItem={renderFavorite}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};
