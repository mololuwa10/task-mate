import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	Platform,
	TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchUserDetails, UserDetails } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import SearchSection from "./SearchSection";
import ProductivitySection from "./ProductivitySection";
import ProjectSummary from "./ProjectSummary";
// import LinearGradient from "react-native-linear-gradient";

function HomeScreen() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

	useEffect(() => {
		const getUserDetails = async () => {
			const details = await fetchUserDetails();
			if (details) {
				setUserDetails(details);
			}
		};

		getUserDetails();
	}, []);

	return (
		<>
			<View
				// colors={["#FAFAFA", "#E0E0E0"]}
				style={{ flex: 1, backgroundColor: "#FAFAFA" }}
			>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						padding: 20,
						paddingTop: 0,
						paddingBottom: 100,
					}}
				>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingVertical: 20,
							paddingHorizontal: 5,
							paddingTop: Platform.OS === "ios" ? 50 : 60,
						}}
					>
						<Icon name="user-circle" size={60} color="#000000" />
						<View style={{ flex: 1, paddingHorizontal: 20 }}>
							<Text style={{ fontWeight: "300" }}>Welcome Back!</Text>
							<Text style={{ fontWeight: "bold", fontSize: 16 }}>
								{userDetails?.firstName} {userDetails?.lastName}
							</Text>
						</View>

						<TouchableOpacity style={{ justifyContent: "flex-end" }}>
							<Ionicons name="notifications-outline" size={35} />
						</TouchableOpacity>
					</View>

					{/* Search Icon */}
					<SearchSection />

					{/* Productivity Section */}
					{/* <ProductivitySection /> */}

					{/* Project Summary */}
					<ProjectSummary />
				</ScrollView>
			</View>
		</>
	);
}

export default HomeScreen;
