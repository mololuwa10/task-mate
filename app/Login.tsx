import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Image,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	ActivityIndicator,
	Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useLogin } from "@/lib/auth";

type RootStackParamList = {
	Navigation: undefined;
	Register: undefined;
	// Add other screen names and their respective params here
};

type LoginNavigationProp = StackNavigationProp<
	RootStackParamList,
	"Navigation",
	"Register"
>;

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigation = useNavigation<LoginNavigationProp>();
	const { login, error } = useLogin();

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			"keyboardDidShow",
			() => {
				setKeyboardVisible(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			"keyboardDidHide",
			() => {
				setKeyboardVisible(false);
			}
		);
		return () => {
			keyboardDidHideListener.remove();
			keyboardDidShowListener.remove();
		};
	}, []);

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const navigateRegister = () => {
		navigation.navigate("Register");
	};

	const handleLogin = async () => {
		setIsLoading(true);
		// navigation.navigate("Navigation");
		try {
			await login(email, password);
			setConfirmationMessage("Login successful!");
			setConfirmationMessage("");
			// Alert.alert("Login Successful");
			setErrorMessage("");
			setIsLoading(false);
			navigation.navigate("Navigation");
		} catch (e) {
			setConfirmationMessage("");
			setErrorMessage(
				"Login failed. Please check your credentials and try again."
			);
			setIsLoading(false);
			console.error("Login failed:", e);
		}
	};

	const handleForgotPassword = () => {
		// Handle forgotten password logic
		console.log("Forgot Password");
	};

	return (
		<>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
			>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						justifyContent: "center",
						alignItems: "center",
						padding: 20,
						backgroundColor: "#001D24",
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
							marginTop: 80,
						}}
					>
						<Image
							source={require("../assets/images/react-logo.png")}
							style={{ width: 80, height: 80, marginBottom: 20 }}
						/>
						<Text
							style={{
								fontSize: 15,
								fontWeight: "bold",
								color: "white",
								textAlign: "center",
							}}
						>
							Welcome Back!! Glad to see you again
						</Text>

						<TextInput
							style={{
								height: 65,
								borderColor: "#FFFFFF",
								borderWidth: 2,
								width: 350,
								borderRadius: 10,
								marginTop: 25,
								marginBottom: 15,
								paddingHorizontal: 15,
								color: "white",
							}}
							placeholder="Email/Username"
							placeholderTextColor="#888"
							value={email}
							onChangeText={setEmail}
							// keyboardType="email-address"
						/>

						<View style={{ position: "relative", width: 350 }}>
							<TextInput
								style={{
									height: 65,
									borderColor: "#FFFFFF",
									borderWidth: 2,
									width: "100%",
									borderRadius: 10,
									marginBottom: 15,
									paddingHorizontal: 15,
									color: "white",
									paddingRight: 50,
								}}
								placeholder="Password"
								placeholderTextColor="#888"
								value={password}
								onChangeText={setPassword}
								secureTextEntry={!passwordVisible}
							/>
							<TouchableOpacity
								onPress={togglePasswordVisibility}
								style={{
									position: "absolute",
									right: 15,
									top: 20,
									height: 25,
									width: 25,
								}}
							>
								<Icon
									name={passwordVisible ? "eye" : "eye-slash"}
									size={22}
									color="white"
								/>
							</TouchableOpacity>
						</View>

						{!keyboardVisible && (
							<TouchableOpacity
								onPress={handleForgotPassword}
								style={{ marginTop: 10, alignItems: "flex-end", width: 350 }}
							>
								<Text
									style={{
										color: "#66A0AF",
										fontSize: 16,
										textDecorationLine: "underline",
									}}
								>
									Forgot Password?
								</Text>
							</TouchableOpacity>
						)}

						{errorMessage ? (
							<Text style={{ color: "red", marginTop: 10 }}>
								{errorMessage}
							</Text>
						) : null}

						{confirmationMessage ? (
							<Text style={{ color: "green", marginTop: 10 }}>
								{confirmationMessage}
							</Text>
						) : null}
					</View>

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
								New to Task-mate?
								<TouchableOpacity onPress={navigateRegister}>
									<Text
										style={{
											fontSize: 18,
											textDecorationLine: "underline",
											color: "#007BFF",
											marginLeft: 5,
										}}
									>
										Register
									</Text>
								</TouchableOpacity>
							</Text>
						</View>
					</View>

					<TouchableOpacity
						onPress={handleLogin}
						style={{
							backgroundColor: "#66A0AF",
							padding: 15,
							borderRadius: 10,
							alignItems: "center",
							width: 350,
						}}
						disabled={isLoading}
					>
						{isLoading ? (
							<ActivityIndicator size="small" color="#ffffff" />
						) : (
							<Text style={{ color: "white", fontSize: 18 }}>Login</Text>
						)}
					</TouchableOpacity>
				</ScrollView>
			</KeyboardAvoidingView>
		</>
	);
}
