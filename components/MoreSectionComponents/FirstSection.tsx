import { Text, View, ScrollView, TouchableOpacity } from "react-native";
import { fetchUserDetails, UserDetails } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
	Navigation: undefined;
	Register: undefined;
	// Add other screen names and their respective params here
};

type NavigationProp = StackNavigationProp<
	RootStackParamList,
	"Navigation",
	"Register"
>;

export default function FirstSection() {
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
			{/* First section */}
			<View style={{ flex: 1 }}>
				<TouchableOpacity
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						gap: 20,
						marginStart: 10,
					}}
					onPress={() => {
						console.log("Settings");
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontSize: 16,
							textAlign: "center",
							width: 50,
							height: 50,
							borderRadius: 25,
							borderWidth: 3,
							borderColor: "#fff",
							lineHeight: 45,
						}}
					>
						{userDetails?.firstName.charAt(0)}
					</Text>

					<Text style={{ color: "#fff", fontSize: 16 }}>
						{userDetails?.firstName} {userDetails?.lastName}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						marginTop: 20,
						gap: 20,
						marginStart: 10,
					}}
					onPress={() => {
						console.log("Notifications");
					}}
				>
					<Ionicons
						name="notifications-outline"
						size={35}
						color={"#FFFFFF"}
						style={{
							color: "#fff",
							textAlign: "center",
							width: 50,
						}}
					/>

					<Text style={{ color: "#fff", fontSize: 16 }}>Notifications</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={{
						flex: 1,
						flexDirection: "row",
						alignItems: "center",
						marginTop: 20,
						gap: 20,
						marginStart: 10,
					}}
					onPress={() => {
						console.log("Settings");
					}}
				>
					<Ionicons
						name="people-outline"
						size={35}
						color={"#FFFFFF"}
						style={{
							color: "#fff",
							textAlign: "center",
							width: 50,
						}}
					/>

					<Text style={{ color: "#fff", fontSize: 16 }}>Friends</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
