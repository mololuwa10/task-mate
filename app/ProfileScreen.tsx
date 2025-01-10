import React, { useState, useEffect, useCallback } from "react";
import {
	View,
	Text,
	ScrollView,
	Platform,
	TouchableOpacity,
	Alert,
	Switch,
} from "react-native";
import {
	CommonActions,
	useFocusEffect,
	useNavigation,
} from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";
import { fetchUserDetails, UserDetails, useLogout } from "@/lib/auth";

function ProfileScreen() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
	const { logout } = useLogout();

	useFocusEffect(
		useCallback(() => {
			let isMounted = true;
			const getUserDetails = async () => {
				const details = await fetchUserDetails();
				if (details) {
					setUserDetails(details);
				}
			};

			getUserDetails();

			return () => {
				isMounted = false;
			};
		}, [])
	);

	const handleLogout = () => {
		Alert.alert("Logout", "Are you sure you want to logout?", [
			{ text: "Cancel", style: "cancel" },
			{
				text: "Logout",
				onPress: async () => {
					await logout();
					navigation.dispatch(
						CommonActions.reset({
							index: 0,
							routes: [{ name: "Login" }],
						})
					);
				},
			},
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
			<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingVertical: 20,
						paddingHorizontal: 20,
						paddingTop: Platform.OS === "ios" ? 50 : 20,
						// backgroundColor: "#FAF9F6",
						zIndex: 10,
					}}
				>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Icon name="arrow-left" size={22} color="white" />
					</TouchableOpacity>
					<View style={{ flex: 1, alignItems: "center" }}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "bold",
								color: "white",
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
						<Icon name="user-circle" size={100} color="#fff" />
						<Text
							style={{
								fontSize: 24,
								fontWeight: "bold",
								marginTop: 10,
								color: "#fff",
							}}
						>
							{userDetails?.firstName} {userDetails?.lastName}
						</Text>
						<Text style={{ color: "#fff", marginBottom: 20 }}>
							{userDetails ? userDetails.email : ""}
						</Text>
					</View>

					{/* General Settings */}
					<View>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "700",
								marginBottom: 10,
								color: "#fff",
							}}
						>
							General
						</Text>
						<View
							style={{
								backgroundColor: "#303030",
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
								onPress={() => navigation.navigate("PersonalInfo")}
							>
								<Text style={{ color: "#fff" }}>Personal Info</Text>
								<Icon color={"#fff"} name="arrow-right" />
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
								<Text style={{ color: "#fff" }}>Dark Mode</Text>
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
								onPress={() => navigation.navigate("TaskList")}
							>
								<Text style={{ color: "#fff" }}>All Tasks</Text>
								<Icon color={"#fff"} name="arrow-right" />
							</TouchableOpacity>
						</View>
					</View>

					{/* Support Section */}
					<View style={{ marginTop: 10 }}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "700",
								color: "#fff",
								marginBottom: 10,
							}}
						>
							Support
						</Text>
						<View
							style={{
								backgroundColor: "#303030",
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
								<Text style={{ color: "#fff" }}>Help Center</Text>
								<Icon color={"#fff"} name="arrow-right" />
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
								<Text style={{ color: "#fff" }}>Contact Us</Text>
								<Icon color={"#fff"} name="arrow-right" />
							</TouchableOpacity>
						</View>
					</View>

					{/* General Settings */}
					<View style={{ marginTop: 10 }}>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "700",
								color: "#fff",
								marginBottom: 10,
							}}
						>
							Account
						</Text>
						<View
							style={{
								backgroundColor: "#303030",
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
								<Text style={{ color: "white" }}>Logout</Text>
								<Icon name="sign-out" color={"white"} size={20} />
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
								<Text style={{ color: "white" }}>Delete Account</Text>
								<Icon name="trash" color={"white"} size={20} />
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</View>
		</>
	);
}

export default ProfileScreen;
