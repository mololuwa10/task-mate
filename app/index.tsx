import LaunchScreen from "@/app/LaunchScreen";
import axios from "axios";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserDetails } from "@/lib/auth";

export default function Index() {
	const [loading, setLoading] = useState(true);
	const [isNewUser, setIsNewUser] = useState(true);
	const router = useRouter();

	// const fetchApi = async () => {
	// 	try {
	// 		const res = await axios.get("http://192.168.0.169:5133");
	// 		console.log(res.data);
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// useEffect(() => {
	// 	fetchApi();
	// }, []);

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

				// if (isNew !== null || isNew !== "true") {
				// 	// New user, show launch screen
				// 	setIsNewUser(true);
				// 	setLoading(false);
				// 	return;
				// }
				// const userDetails = await fetchUserDetails();
				// if (userDetails) {
				// 	router.replace("/Navigation");
				// } else {
				// 	router.replace("/SignInOptions");
				// }
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

	return <LaunchScreen />;

	// return <Navigation />;
}
