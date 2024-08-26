import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
	Alert,
	TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { registerUser } from "@/lib/auth";

export default function Register() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);

	const [errors, setErrors] = useState({
		firstname: "",
		lastname: "",
		email: "",
		username: "",
		password: "",
		confirmPassword: "",
	});

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible);
	};

	const validate = () => {
		let valid = true;
		const newErrors = {
			firstname: "",
			lastname: "",
			email: "",
			username: "",
			password: "",
			confirmPassword: "",
		};

		if (firstname.trim() === "") {
			newErrors.firstname = "First name is required.";
			valid = false;
		}
		if (lastname.trim() === "") {
			newErrors.lastname = "Last name is required.";
			valid = false;
		}
		if (username.trim() === "") {
			newErrors.username = "Username is required.";
			valid = false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			newErrors.email = "Invalid email address.";
			valid = false;
		}
		const passwordRegex =
			/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(password)) {
			newErrors.password =
				"At least 8 characters, 1 uppercase letter, 1 number, and 1 special character.";
			valid = false;
		}
		if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match.";
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleRegister = async () => {
		if (validate()) {
			try {
				const userData = {
					FirstName: firstname,
					LastName: lastname,
					username,
					email,
					password,
					confirmPassword,
				};
				const response = await registerUser(userData);
				Alert.alert("Success", "User registered successfully");
			} catch (error) {
				Alert.alert("Registration Error", (error as Error).message);
			}
		} else {
			Alert.alert("Validation Error", "Please correct the errors in the form.");
		}
	};

	return (
		<KeyboardAvoidingView
			style={{
				flex: 1,
				// backgroundColor: "#001D24"
				backgroundColor: "#1c1c1c",
			}}
			behavior={Platform.OS === "ios" ? "padding" : "position"}
		>
			{/* Header with Back Arrow and Title */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					padding: 20,
					paddingTop: Platform.OS === "ios" ? 50 : 50,
					backgroundColor: "#001D24",
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
						Create an account
					</Text>
				</View>
			</View>

			{/* Scrollable Form */}
			<ScrollView
				contentContainerStyle={{
					paddingHorizontal: 20,
					paddingTop: 20,
					paddingBottom: 30,
				}}
				keyboardShouldPersistTaps="handled"
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						marginBottom: 15,
						marginTop: 20,
					}}
				>
					<View style={{ flex: 1, marginRight: 10 }}>
						<TextInput
							style={styles.input}
							placeholder="First Name"
							placeholderTextColor="#888"
							value={firstname}
							onChangeText={(text) => {
								setFirstname(text);
								setErrors((prev) => ({ ...prev, firstname: "" }));
							}}
						/>
						{errors.firstname ? (
							<Text style={styles.errorText}>{errors.firstname}</Text>
						) : null}
					</View>
					<View style={{ flex: 1 }}>
						<TextInput
							style={styles.input}
							placeholder="Last Name"
							placeholderTextColor="#888"
							value={lastname}
							onChangeText={(text) => {
								setLastname(text);
								setErrors((prev) => ({ ...prev, lastname: "" }));
							}}
						/>
						{errors.lastname ? (
							<Text style={styles.errorText}>{errors.lastname}</Text>
						) : null}
					</View>
				</View>

				<View style={{ marginTop: 15 }}>
					<TextInput
						style={styles.input}
						placeholder="Username"
						placeholderTextColor="#888"
						value={username}
						onChangeText={(text) => {
							setUsername(text);
							setErrors((prev) => ({ ...prev, username: "" }));
						}}
					/>
					{errors.username ? (
						<Text style={styles.errorText}>{errors.username}</Text>
					) : null}
				</View>

				<View style={{ marginTop: 15 }}>
					<TextInput
						style={styles.input}
						placeholder="Email"
						placeholderTextColor="#888"
						value={email}
						onChangeText={(text) => {
							setEmail(text);
							setErrors((prev) => ({ ...prev, email: "" }));
						}}
						keyboardType="email-address"
					/>
					{errors.email ? (
						<Text style={styles.errorText}>{errors.email}</Text>
					) : null}
				</View>

				<View style={{ marginTop: 15 }}>
					<TextInput
						style={styles.input}
						placeholder="Password"
						placeholderTextColor="#888"
						value={password}
						onChangeText={(text) => {
							setPassword(text);
							setErrors((prev) => ({ ...prev, password: "" }));
						}}
						secureTextEntry
					/>
					{/* {errors.password ? (
						<Text style={styles.errorText}>{errors.password}</Text>
					) : null} */}
					<Text style={styles.hintText}>
						At least 8 characters, 1 uppercase letter, 1 number, and 1 special
						character
					</Text>
				</View>

				<View style={{ marginTop: 15 }}>
					<TextInput
						style={styles.input}
						placeholder="Confirm Password"
						placeholderTextColor="#888"
						value={confirmPassword}
						onChangeText={(text) => {
							setConfirmPassword(text);
							setErrors((prev) => ({ ...prev, confirmPassword: "" }));
						}}
						secureTextEntry
					/>
					{errors.confirmPassword ? (
						<Text style={styles.errorText}>{errors.confirmPassword}</Text>
					) : null}
				</View>

				<TouchableOpacity
					onPress={handleRegister}
					style={{
						// backgroundColor: "#66A0AF",
						backgroundColor: "#f2e29b",
						padding: 15,
						borderRadius: 10,
						alignItems: "center",
						marginTop: 20,
					}}
				>
					<Text style={{ color: "#1c1c1c", fontSize: 18 }}>Register</Text>
				</TouchableOpacity>
			</ScrollView>
		</KeyboardAvoidingView>
	);
}

const styles = {
	input: {
		height: 65,
		borderColor: "#FFFFFF",
		borderWidth: 2,
		borderRadius: 10,
		paddingHorizontal: 15,
		color: "white",
		marginBottom: 5,
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginBottom: 10,
	},
	hintText: {
		color: "#888",
		fontSize: 12,
		marginBottom: 10,
		marginTop: 5,
	},
};
