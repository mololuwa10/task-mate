import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import HomeScreen from "../components/HomePageComponents/HomeScreen";
import { TouchableOpacity, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProfileScreen from "@/components/ProfilePageComponents/ProfileScreen";
import CreateTask from "./CreateTask";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import Hamburger from "hamburger-react";
import MoreSection from "@/components/ProfilePageComponents/MoreSection";

type RootStackParamList = {
	CreateTask: undefined;
	// Add other screen names and their respective params here
};

type NavigationProp = StackNavigationProp<RootStackParamList, "CreateTask">;

function CustomTabBarButton({
	children,
	onPress,
}: {
	children: any;
	onPress?: () => void;
}) {
	return (
		<TouchableOpacity
			style={{
				top: -30, // Lift the button above the tab bar
				justifyContent: "center",
				alignItems: "center",
				...styles.shadow,
			}}
			onPress={onPress}
		>
			<View
				style={{
					width: 60,
					height: 60,
					borderRadius: 35,
					// backgroundColor: "#000000",
					backgroundColor: "#f2e29b",
					// backgroundColor: "#FF007F",
					// backgroundColor: "#FFFF",
				}}
			>
				{children}
			</View>
		</TouchableOpacity>
	);
}

const Tab = createBottomTabNavigator();

export default function Navigation() {
	const navigation = useNavigation<NavigationProp>();
	return (
		<>
			{/* <NavigationContainer> */}
			<Tab.Navigator
				screenOptions={{
					tabBarShowLabel: false,
					tabBarStyle: {
						position: "absolute",
						bottom: 0,
						// left: 20,
						// right: 20,
						// backgroundColor: "#fff",
						backgroundColor: "#3b3b3b",
						// backgroundColor: "#222222",
						// borderRadius: 15,
						height: 75,
						...styles.shadow,
					},
				}}
			>
				<Tab.Screen
					name="Home"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<Ionicons
								name="home-outline"
								size={25}
								color={focused ? "#fff" : "#948a5f"}
							/>
						),
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="Calendar"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<Ionicons
								name="calendar-outline"
								size={25}
								color={focused ? "#fff" : "#948a5f"}
							/>
						),

						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="Add"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<Ionicons name="add" size={35} color="#000" />
						),
						tabBarButton: (props) => (
							<CustomTabBarButton
								{...props}
								onPress={() => navigation.navigate("CreateTask")} // Navigate to CreateTask
							/>
						),
						headerShown: false,
					}}
				/>
				<Tab.Screen
					name="Chat"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<Ionicons
								name="chatbubble-outline"
								// name="notifications-outline"
								size={25}
								color={focused ? "#fff" : "#948a5f"}
							/>
						),
						tabBarBadge: 6,
						headerShown: false,
					}}
				/>
				{/* <Tab.Screen
					name="Messages"
					component={HomeScreen}
					options={{
						tabBarIcon: ({ focused }) => (
							<Ionicons
								// name="chatbubble-outline"
								name="notifications-outline"
								size={25}
								color={focused ? "#fff" : "#948a5f"}
							/>
						),
						tabBarBadge: 6,
						headerShown: false,
					}}
				/> */}
				<Tab.Screen
					name="Profile"
					component={MoreSection}
					options={{
						tabBarIcon: ({ focused }) => (
							<Ionicons
								// name="settings-outline"
								name="menu-outline"
								size={40}
								color={focused ? "#fff" : "#948a5f"}
							/>
							// <Hamburger onToggle={(toggled) => {}} />
						),
						headerShown: false,
					}}
				/>
			</Tab.Navigator>
			{/* </NavigationContainer> */}
		</>
	);
}

const styles = {
	shadow: {
		shadowColor: "#7F5DF0",
		shadowOffset: {
			width: 0,
			height: 10,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.5,
		elevation: 5,
	},
};
