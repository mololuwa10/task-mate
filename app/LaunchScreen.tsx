import React from "react";
import { Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/FontAwesome";

type RootStackParamList = {
	SignInOptions: undefined;
	// Add other screen names and their respective params here
};

type LaunchScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	"SignInOptions"
>;

export default function LaunchScreen() {
	const navigation = useNavigation<LaunchScreenNavigationProp>();
	const handlePress = () => {
		navigation.navigate("SignInOptions");
	};
	return (
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
			{/* Replace with actual source when uncommenting */}
			<Image
				source={require("../assets/images/react-logo.png")}
				style={{ width: 100, height: 100, marginBottom: 30 }}
			/>
			{/* <Image
        source={require('../assets/images/car-illustration.png')}
        style={{ width: 200, height: 200, marginBottom: 20 }}
      /> */}
			<Text
				style={{
					fontSize: 30,
					fontWeight: "bold",
					textAlign: "center",
					marginBottom: 20,
					color: "white",
				}}
			>
				Welcome To <Text style={{ color: "#66A0AF" }}>Task Mate</Text>
			</Text>
			<Text
				style={{
					fontSize: 18,
					textAlign: "center",
					marginBottom: 30,
					color: "white",
				}}
			>
				Your friendly companion for effortless task management. Lorem ipsum
				dolor sit amet, consectetur adipisicing elit. recusandae culpa similique
				deserunt rerum quo nostrum.
			</Text>
			<TouchableOpacity
				onPress={handlePress}
				style={{
					// backgroundColor: "#333333",
					padding: 15,
					borderRadius: 10,
					borderColor: "#FFFFFF",
					borderWidth: 2,
					marginTop: 10,
					width: 350,
					alignItems: "center",
					// marginBottom: -280,
					// flexDirection: "row",
				}}
			>
				<Text
					style={{
						color: "white",
						fontSize: 18,
						marginRight: 10,
						textAlign: "center",
					}}
				>
					Get Started <Icon name="arrow-right" size={18} color="white" />
				</Text>
			</TouchableOpacity>
		</ScrollView>
	);
}
