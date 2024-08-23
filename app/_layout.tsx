import { Stack } from "expo-router";

export default function RootLayout() {
	return (
		<>
			{/* <Navigation /> */}
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="LaunchScreen" options={{ headerShown: false }} />
				<Stack.Screen name="SignInOptions" options={{ headerShown: false }} />
				<Stack.Screen name="Login" options={{ headerShown: false }} />
				<Stack.Screen name="Register" options={{ headerShown: false }} />
				<Stack.Screen name="Navigation" options={{ headerShown: false }} />
			</Stack>
		</>
	);
}
