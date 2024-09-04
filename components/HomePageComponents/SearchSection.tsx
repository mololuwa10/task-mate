import React, { useState, useEffect } from "react";
import { SearchBar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchUserDetails, UserDetails } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import {
	View,
	Text,
	ScrollView,
	Platform,
	TouchableOpacity,
} from "react-native";

export default function SearchSection() {
	const [searchQuery, setSearchQuery] = useState("");

	const updateSearch = (search: string) => {
		setSearchQuery(search);
	};

	return (
		<>
			<View
				style={{
					flexDirection: "row",
					// backgroundColor: "#fff",
					backgroundColor: "#3b3b3b",
					padding: 10,
					borderRadius: 15,
					marginBottom: 20,
					alignItems: "center",
				}}
			>
				<Icon name="search" size={20} color="#888" />
				<SearchBar
					placeholder="Search anything..."
					onChangeText={updateSearch}
					value={searchQuery}
					containerStyle={{
						backgroundColor: "transparent",
						flex: 1,
						marginLeft: 10,
						padding: 0,
						borderBottomColor: "transparent",
						borderTopColor: "transparent",
					}}
					inputContainerStyle={{
						backgroundColor: "transparent",
					}}
					inputStyle={{
						color: "#fff",
						fontSize: 16,
					}}
					searchIcon={false}
					lightTheme
					round
				/>
			</View>
		</>
	);
}
