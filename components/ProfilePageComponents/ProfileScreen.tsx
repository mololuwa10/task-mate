import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	ScrollView,
	Platform,
	TouchableOpacity,
	Alert,
	Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchUserDetails, UserDetails, useLogout } from "@/lib/auth";

function ProfileScreen() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const logOut = useLogout();

	useEffect(() => {
		const getUserDetails = async () => {
			const details = await fetchUserDetails();
			if (details) {
				setUserDetails(details);
			}
		};

		getUserDetails();
	}, []);

	const handleLogout = () => {
		// Implement your logout logic here
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{ text: "Logout", onPress: logOut },
		]);
	};

	const handleDeleteAccount = () => {
		Alert.alert(
			"Delete Account",
			"Are you sure you want to delete your account? This action cannot be undone.",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{ text: "Delete", onPress: () => console.log("Account Deleted") },
			]
		);
	};

	return (
		<>
			<View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingVertical: 20,
						paddingHorizontal: 20,
						paddingTop: Platform.OS === "ios" ? 50 : 45,
						// backgroundColor: "#FAF9F6",
						zIndex: 10,
					}}
				>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Icon name="arrow-left" size={22} color="black" />
					</TouchableOpacity>
					<View style={{ flex: 1, alignItems: "center" }}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "bold",
								color: "black",
								textAlign: "center",
							}}
						>
							Profile
						</Text>
					</View>
				</View>

				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						// justifyContent: "center",
						// alignItems: "center",
						padding: 20,
						paddingTop: 0,
						paddingBottom: 100,
						// backgroundColor: "#FAF9F6",
					}}
				>
					{/* User Info Section */}
					<View style={{ alignItems: "center", marginVertical: 20 }}>
						<Icon name="user-circle" size={100} color="#000000" />
						<Text style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
							{userDetails?.firstName} {userDetails?.lastName}
						</Text>
						<Text style={{ color: "#888", marginBottom: 20 }}>
							{userDetails ? userDetails.email : ""}
						</Text>
					</View>

					{/* General Settings */}
					<View>
						<Text
							style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
						>
							General
						</Text>
						<View
							style={{
								backgroundColor: "white",
								padding: 15,
								borderRadius: 10,
								marginBottom: 10,
								elevation: 2,
							}}
						>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingBottom: 10,
									borderBottomWidth: 0.5,
								}}
							>
								<Text>Personal Info</Text>
								<Icon name="arrow-right" />
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingBottom: 10,
									borderBottomWidth: 0.5,
								}}
							>
								<Text>Dark Mode</Text>
								<Switch
									value={isDarkMode}
									onValueChange={() => setIsDarkMode(!isDarkMode)}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingTop: 10,
									paddingBottom: 10,
									borderBottomWidth: 0.5,
								}}
							>
								<Text>All Tasks</Text>
								<Icon name="arrow-right" />
							</TouchableOpacity>
						</View>
					</View>

					{/* Support Section */}
					<View style={{ marginTop: 10 }}>
						<Text
							style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
						>
							Support
						</Text>
						<View
							style={{
								backgroundColor: "white",
								padding: 15,
								borderRadius: 10,
								marginBottom: 10,
								elevation: 2,
							}}
						>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingBottom: 10,
									borderBottomWidth: 0.5,
								}}
							>
								<Text>Help Center</Text>
								<Icon name="arrow-right" />
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingTop: 10,
									paddingBottom: 10,
									borderBottomWidth: 0.5,
								}}
							>
								<Text>Contact Us</Text>
								<Icon name="arrow-right" />
							</TouchableOpacity>
						</View>
					</View>

					{/* General Settings */}
					<View style={{ marginTop: 10 }}>
						<Text
							style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}
						>
							Account
						</Text>
						<View
							style={{
								backgroundColor: "white",
								padding: 15,
								borderRadius: 10,
								marginBottom: 10,
								elevation: 2,
							}}
						>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingBottom: 10,
									borderBottomWidth: 0.5,
								}}
								onPress={handleLogout}
							>
								<Text style={{ color: "red" }}>Logout</Text>
								<Icon name="sign-out" size={20} />
							</TouchableOpacity>

							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingTop: 10,
									paddingBottom: 10,
									// borderBottomWidth: 0.5,
								}}
								onPress={handleDeleteAccount}
							>
								<Text style={{ color: "red" }}>Delete Account</Text>
								<Icon name="trash" size={20} />
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		</>
	);
}

export default ProfileScreen;
