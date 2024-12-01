import LaunchScreen from "@/app/LaunchScreen";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserDetails } from "@/lib/auth";
// import Toast from "react-native-toast-message";
// import * as Network from "expo-network";
// import { NetworkInfo } from "react-native-network-info";
// import Config from "react-native-config";
// import Constants from "expo-constants";

export default function Index() {
	const [loading, setLoading] = useState(true);
	// const [isNewUser, setIsNewUser] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const isNew = await AsyncStorage.getItem("isNewUser");

				if (isNew !== null && isNew !== "true") {
					const userDetails = await fetchUserDetails();
					if (userDetails) {
						router.replace("/Navigation");
					} else {
						router.replace("/LaunchScreen");
					}
				}
			} catch (error) {
				console.error("Error checking authentication:", error);
				router.replace("/Login");
			} finally {
				setLoading(false);
			}
		};

		setTimeout(() => {
			checkAuth();
		}, 3000);
	}, []);

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	// if (isNewUser) {
	// 	return <LaunchScreen />;
	// }

	// return null;

	return (
		<>
			<LaunchScreen />
			{/* <Toast /> */}
		</>
	);

	// return <Navigation />;
}
