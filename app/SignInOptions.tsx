import {
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

type RootStackParamList = {
	Login: undefined;
	Register: undefined;
};

type SignInOptionsNavigationProp = StackNavigationProp<
	RootStackParamList,
	"Login",
	"Register"
>;

const ip = Constants.expoConfig?.extra?.apiHost || "http://localhost:5133";

// const handleGoogleSignIn = () => {
// 	const apiUrl = `http://${ip}:5133/api/account/google-login`;
// 	Linking.openURL(apiUrl);
// };

const handleGoogleSignIn = async () => {
	// const authUrl = `https://bdee-82-15-14-47.ngrok-free.app/api/account/google-login`;

	const authUrl = `https://bdee-82-15-14-47.ngrok-free.app/api/account/google-login`;

	const result = await WebBrowser.openAuthSessionAsync(
		authUrl,
		"https://bdee-82-15-14-47.ngrok-free.app/api/account/google-login"
	);

	if (result.type === "success" && result.url) {
		// Parse URL to extract any tokens or information
		const queryParams = new URL(result.url).searchParams;
		const status = queryParams.get("status");
		const email = queryParams.get("email");

		if (status === "success") {
			// Successfully logged in, proceed with handling the user's data
			console.log("Login success, user email:", email);
			// Add further handling like saving the token, navigating, etc.
		} else {
			console.log("Login failed");
		}
	} else {
		console.log("Login canceled");
	}
};

export default function SignInOptions() {
	const navigation = useNavigation<SignInOptionsNavigationProp>();
	const handleLoginPress = () => {
		// Add navigation or any other action here
		navigation.navigate("Login");
	};

	const handleRegisterPress = () => {
		// Add navigation or any other action here
		navigation.navigate("Register");
	};
	return (
		<>
			<ScrollView
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
					// backgroundColor: "#001D24",
					backgroundColor: "#1c1c1c",
				}}
			>
				<TouchableOpacity
					onPress={() => navigation.goBack()}
					style={{ position: "absolute", top: 50, left: 20 }}
				>
					<Icon name="arrow-left" size={22} color="white" />
				</TouchableOpacity>
				<View
					style={{
						flex: 1,
						justifyContent: "flex-start",
						alignItems: "center",
						marginTop: 50,
					}}
				>
					<Image
						source={require("../assets/images/react-logo.png")}
						style={{ width: 100, height: 100, marginBottom: 30 }}
					/>
					<Text style={{ fontSize: 24, fontWeight: "500", color: "white" }}>
						Create an account
					</Text>
				</View>
				<View style={{ flex: 1 }}>
					<TouchableOpacity
						style={{
							borderColor: "#FFFFFF",
							borderWidth: 2,
							padding: 15,
							borderRadius: 10,
							marginTop: 10,
							width: 350,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
						}}
						onPress={handleRegisterPress}
					>
						<Icon
							name="envelope"
							style={{ marginRight: 10 }}
							size={18}
							color="white"
						/>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								marginRight: 10,
								textAlign: "center",
							}}
						>
							Continue with Email
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							borderColor: "#FFFFFF",
							borderWidth: 2,
							padding: 15,
							borderRadius: 10,
							marginTop: 10,
							width: 350,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
						}}
						onPress={handleGoogleSignIn}
					>
						<Icon
							name="google"
							style={{ marginRight: 10 }}
							size={18}
							color="white"
						/>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								marginRight: 10,
								textAlign: "center",
							}}
						>
							Continue with Google
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							borderColor: "#FFFFFF",
							borderWidth: 2,
							padding: 15,
							borderRadius: 10,
							marginTop: 10,
							width: 350,
							alignItems: "center",
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<Icon
							name="apple"
							style={{ marginRight: 10 }}
							size={18}
							color="white"
						/>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								marginRight: 10,
								textAlign: "center",
							}}
						>
							Continue with Apple
						</Text>
					</TouchableOpacity>
				</View>
				<Text
					style={{
						color: "white",
						fontSize: 18,
						marginTop: 10,
						paddingBottom: 80,
						textAlign: "center",
					}}
				>
					By continuing, you agree to Privacy policy and Terms & Conditions
				</Text>

				<View
					style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
				>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text
							style={{
								color: "white",
								fontSize: 18,
								marginRight: 10,
								textAlign: "center",
							}}
						>
							Have an account?
							<TouchableOpacity onPress={handleLoginPress}>
								<Text
									style={{
										fontSize: 18,
										textDecorationLine: "underline",
										color: "#007BFF",
									}}
								>
									Log in
								</Text>
							</TouchableOpacity>
						</Text>
					</View>
				</View>
			</ScrollView>
		</>
	);
}
