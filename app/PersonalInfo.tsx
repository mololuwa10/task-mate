import React, { useEffect, useState } from "react";
import {
	Platform,
	TouchableOpacity,
	View,
	Text,
	ScrollView,
	Image,
	TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { fetchUserDetails, UserDetails } from "@/lib/auth";
import { updateUserProfile } from "@/lib/apiPutActions";
import Toast from "react-native-toast-message";

const LabeledInput = ({ label, value, onChange, fieldType, ...props }: any) => (
	<View style={{ flexDirection: "column", marginBottom: 6 }}>
		<Text
			style={{
				fontSize: 16,
				color: "white",
				fontWeight: "semibold",
				marginBottom: 6,
			}}
		>
			{label}
		</Text>
		<View
			style={{
				height: 44,
				width: "100%",
				borderColor: "#3f3f3f",
				borderWidth: 1,
				borderRadius: 4,
				marginVertical: 6,
				justifyContent: "center",
				paddingLeft: 8,
			}}
		>
			<TextInput
				value={value}
				onChangeText={onChange}
				autoComplete={fieldType}
				style={{
					color: "white",
				}}
				{...props}
			/>
		</View>
	</View>
);

export default function PersonalInfo() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [selectedImage, setSelectedImage] = useState<string | undefined>(
		undefined
	);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const details = await fetchUserDetails();
				setUserDetails(details);
			} catch (error) {
				console.error("Error fetching user details: ", error);
				Toast.show({
					type: "error",
					text1: "Fetch Failed",
					text2: "Unable to fetch user details. Please try again.",
				});
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (userDetails) {
			setFirstName(userDetails.firstName || "");
			setLastName(userDetails.lastName || "");
			setEmail(userDetails.email || "");
			setUsername(userDetails.userName || "");
			setPhoneNumber(userDetails.phoneNumber || "");
		}
	}, [userDetails]);

	const handleImageSelection = async () => {
		try {
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.All,
				allowsEditing: true,
				aspect: [4, 4],
				quality: 1,
			});

			if (!result.canceled && result.assets && result.assets.length > 0) {
				setSelectedImage(result.assets[0].uri);
			}
		} catch (error) {
			console.error("Error selecting image: ", error);
			Toast.show({
				type: "error",
				text1: "Image Selection Failed",
				text2: "Something went wrong. Please try again.",
			});
		}
	};

	const handleUpdateProfile = async () => {
		const updateUserItem = {
			FirstName: firstName,
			LastName: lastName,
			Email: email,
			Username: username,
			PhoneNumber: phoneNumber,
		};

		try {
			const response = await updateUserProfile(updateUserItem);
			if (response) {
				Toast.show({
					type: "success",
					text1: "Update Successful",
					text2: "Your profile has been updated successfully.",
				});
			} else {
				Toast.show({
					type: "error",
					text1: "Update Failed",
					text2: "Failed to update profile. Please try again.",
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Update Failed",
				text2: "Failed to update profile. Please try again.",
			});
		}
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
							Edit Profile
						</Text>
					</View>

					<TouchableOpacity
						onPress={() => handleUpdateProfile()}
						style={{
							borderRadius: 50,
							backgroundColor: "#3f3f3f",
						}}
					>
						<Text
							style={{
								color: "white",
								paddingHorizontal: 25,
								paddingVertical: 15,
							}}
						>
							Save
						</Text>
					</TouchableOpacity>
				</View>

				<ScrollView style={{ paddingHorizontal: 20, marginBottom: 15 }}>
					<View
						style={{
							alignItems: "center",
							marginVertical: 22,
						}}
					>
						<TouchableOpacity onPress={handleImageSelection}>
							<Image
								source={{ uri: selectedImage || "https://picsum.photos/200" }}
								style={{
									height: 170,
									width: 170,
									borderRadius: 85,
									borderWidth: 5,
									borderColor: "#3f3f3f",
								}}
							/>

							<View
								style={{
									position: "absolute",
									bottom: 0,
									right: 10,
									zIndex: 9999,
									backgroundColor: "#3f3f3f",
									borderRadius: 20,
								}}
							>
								<Camera
									size={32}
									color={"#ffff"}
									style={{ paddingHorizontal: 25, paddingVertical: 5 }}
								/>
							</View>
						</TouchableOpacity>
					</View>

					<View>
						{/* First name */}
						<LabeledInput
							label="First Name"
							value={firstName}
							onChangeText={(value: React.SetStateAction<string>) =>
								setFirstName(value)
							}
						/>

						{/* Last name */}
						<LabeledInput
							label="Last Name"
							value={lastName}
							onChangeText={(value: React.SetStateAction<string>) =>
								setLastName(value)
							}
						/>

						{/* Email */}
						<LabeledInput
							label="Email"
							value={email}
							onChangeText={(value: React.SetStateAction<string>) =>
								setEmail(value)
							}
						/>

						{/* Username */}
						<LabeledInput
							label="Username"
							value={username}
							onChangeText={(value: React.SetStateAction<string>) =>
								setUsername(value)
							}
						/>

						{/* Phone Number */}
						<LabeledInput
							label="Phone Number"
							value={phoneNumber}
							onChangeText={(value: React.SetStateAction<string>) =>
								setPhoneNumber(value)
							}
						/>

						{/* Password */}
						<View style={{ flexDirection: "column", marginBottom: 6 }}>
							<Text
								style={{
									fontSize: 16,
									color: "white",
									fontWeight: "semibold",
									marginBottom: 6,
								}}
							>
								Password
							</Text>
							<View
								style={{
									height: 44,
									width: "100%",
									borderColor: "#3f3f3f",
									borderWidth: 1,
									borderRadius: 4,
									marginVertical: 6,
									justifyContent: "center",
									paddingLeft: 8,
								}}
							>
								<TextInput
									value={password}
									onChangeText={(value) => setPassword(value)}
									editable={true}
									secureTextEntry={true}
									style={{
										color: "white",
									}}
								/>
							</View>
						</View>

						{/* Confirm Password */}
						<View style={{ flexDirection: "column", marginBottom: 6 }}>
							<Text
								style={{
									fontSize: 16,
									color: "white",
									fontWeight: "semibold",
									marginBottom: 6,
								}}
							>
								Confirm Password
							</Text>
							<View
								style={{
									height: 44,
									width: "100%",
									borderColor: "#3f3f3f",
									borderWidth: 1,
									borderRadius: 4,
									marginVertical: 6,
									justifyContent: "center",
									paddingLeft: 8,
								}}
							>
								<TextInput
									value={confirmPassword}
									onChangeText={(value) => setConfirmPassword(value)}
									editable={true}
									secureTextEntry={true}
									style={{
										color: "white",
									}}
								/>
							</View>
						</View>
					</View>
				</ScrollView>
			</View>
		</>
	);
}
