import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	ScrollView,
	Platform,
	TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchUserDetails, UserDetails } from "@/lib/auth";
import { Ionicons } from "@expo/vector-icons";
import SearchSection from "./SearchSection";
import ProductivitySection from "./ProductivitySection";
import ProjectSummary from "./ProjectSummary";
import OngoingSection from "./OngoingSection";
import TaskProgressCards from "./TaskProgressCards";
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
				style={{ flex: 1, backgroundColor: "#1c1c1c" }}
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
							paddingTop: Platform.OS === "ios" ? 50 : 30,
						}}
					>
						<Icon name="user-circle" size={60} color="#FFFFFF" />
						<View style={{ flex: 1, paddingHorizontal: 20 }}>
							<Text style={{ fontWeight: "300", color: "#FFFFFF" }}>
								Welcome Back!
							</Text>
							<Text
								style={{ fontWeight: "bold", fontSize: 16, color: "#FFFFFF" }}
							>
								{userDetails?.firstName} {userDetails?.lastName}
							</Text>
						</View>

						<TouchableOpacity style={{ justifyContent: "flex-end" }}>
							<Ionicons
								name="notifications-outline"
								size={35}
								color={"#FFFFFF"}
							/>
						</TouchableOpacity>
					</View>

					<View style={{ marginBottom: 15 }}>
						<Text
							style={{ color: "#FFFFFF", fontSize: 25, fontWeight: "semibold" }}
						>
							Manage Your{" "}
							<Text
								style={{
									color: "#f2e29b",
									fontSize: 25,
									fontWeight: "semibold",
								}}
							>
								Daily Tasks
							</Text>
						</Text>
					</View>

					{/* Search Icon */}
					<SearchSection />

					{/* Task Progress Cards */}
					<TaskProgressCards />

					{/* Productivity Section */}
					{/* <ProductivitySection /> */}

					{/* Project Summary */}
					<ProjectSummary />

					{/* Ongoing Section */}
					<OngoingSection />
				</ScrollView>
			</View>
		</>
	);
}

export default HomeScreen;
