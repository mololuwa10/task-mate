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
				{/* <Stack.Screen name="CreateTask" options={{ headerShown: false }} /> */}
				<Stack.Screen
					name="CreateTask"
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
			</Stack>
			<Toast />
		</>
	);
}
