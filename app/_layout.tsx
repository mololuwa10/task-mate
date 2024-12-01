// import React from "react";
// import { TransitionPresets } from "@react-navigation/stack";
// // import { Stack } from "expo-router";
// import Toast from "react-native-toast-message";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import LaunchScreen from "./LaunchScreen";
// // import Index from "./Index";
// import SignInOptions from "./SignInOptions";
// import { NavigationContainer } from "@react-navigation/native";
// import Navigation from "./Navigation";
// import Login from "./Login";
// import Register from "./Register";
// import ProfileScreen from "./ProfileScreen";
// import CreateTask from "./CreateTask";
// import EditSubTask from "./EditSubTask";
// import EditTask from "./EditTask";
// import TaskList from "./TaskList";
// import UserTaskProfile from "./UserTaskProfile";
// import IndividualTaskPage from "./IndividualTaskPage";
// import Index from ".";
// import TodaysTask from "./TodaysTask";

// // Example setup
// // const Stack = createNativeStackNavigator();

// const Stack = createNativeStackNavigator();

// export default function RootLayout() {
// 	return (
// 		<>
// 			{/* <NavigationContainer> */}
// 			<Stack.Navigator
// 				screenOptions={{
// 					gestureEnabled: true,
// 					...TransitionPresets.SlideFromRightIOS,
// 				}}
// 			>
// 				<Stack.Screen
// 					name="Index"
// 					component={Index}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="LaunchScreen"
// 					component={LaunchScreen}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="SignInOptions"
// 					component={SignInOptions}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="Login"
// 					component={Login}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="Register"
// 					component={Register}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="Navigation"
// 					component={Navigation}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="ProfileScreen"
// 					component={ProfileScreen}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="CreateTask"
// 					component={CreateTask}
// 					options={{
// 						headerShown: false,
// 						...TransitionPresets.SlideFromRightIOS,
// 					}}
// 				/>
// 				<Stack.Screen
// 					name="EditTask"
// 					component={EditTask}
// 					options={{
// 						headerShown: false,
// 						...TransitionPresets.SlideFromRightIOS,
// 					}}
// 				/>
// 				<Stack.Screen
// 					name="TaskList"
// 					component={TaskList}
// 					options={{
// 						headerShown: false,
// 						...TransitionPresets.SlideFromRightIOS,
// 					}}
// 				/>
// 				<Stack.Screen
// 					name="UserTaskProfile"
// 					component={UserTaskProfile}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="IndividualTaskPage"
// 					component={IndividualTaskPage}
// 					options={{ headerShown: false }}
// 				/>
// 				<Stack.Screen
// 					name="EditSubTask"
// 					component={EditSubTask}
// 					options={{
// 						headerShown: false,
// 					}}
// 				/>
// 				<Stack.Screen
// 					name="TodaysTask"
// 					component={TodaysTask}
// 					options={{
// 						headerShown: false,
// 					}}
// 				/>
// 			</Stack.Navigator>
// 			{/* </NavigationContainer> */}
// 			<Toast />
// 		</>
// 	);
// }

import React from "react";
import { TransitionPresets } from "@react-navigation/stack";
import { Stack } from "expo-router";
import Toast from "react-native-toast-message";

export default function RootLayout() {
	return (
		<>
			<Stack
				screenOptions={{
					gestureEnabled: true,
					...TransitionPresets.SlideFromRightIOS,
				}}
			>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="LaunchScreen" options={{ headerShown: false }} />
				<Stack.Screen name="SignInOptions" options={{ headerShown: false }} />
				<Stack.Screen name="Login" options={{ headerShown: false }} />
				<Stack.Screen name="Register" options={{ headerShown: false }} />
				<Stack.Screen name="Navigation" options={{ headerShown: false }} />
				<Stack.Screen name="ProfileScreen" options={{ headerShown: false }} />
				<Stack.Screen name="TodaysTask" options={{ headerShown: false }} />
				<Stack.Screen
					name="CreateTask"
					options={{
						headerShown: false,
						...TransitionPresets.SlideFromRightIOS,
					}}
				/>
				<Stack.Screen
					name="EditTask"
					options={{
						headerShown: false,
						...TransitionPresets.SlideFromRightIOS,
					}}
				/>
				<Stack.Screen
					name="TaskList"
					options={{
						headerShown: false,
						...TransitionPresets.SlideFromRightIOS,
					}}
				/>
				<Stack.Screen name="UserTaskProfile" options={{ headerShown: false }} />
				<Stack.Screen
					name="IndividualTaskPage"
					options={{ headerShown: false }}
				/>
				<Stack.Screen
					name="EditSubTask"
					options={{
						headerShown: false,
					}}
				/>
			</Stack>
			<Toast />
		</>
	);
}
