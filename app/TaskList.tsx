import Ionicons from "react-native-vector-icons/Ionicons";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import TaskStatusHeader from "@/components/TaskListComponents/TaskStatusHeader";
import TaskCards from "@/components/TaskListComponents/TaskCards";
type RootStackParamList = {
	TaskList: undefined;
	CreateTask: undefined;
	// Add other screen names and their respective params here
};

type NavigationProp = StackNavigationProp<
	RootStackParamList,
	"TaskList",
	"CreateTask"
>;
export default function TaskList() {
	const navigation = useNavigation<NavigationProp>();

	return (
		<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
			{/* <View style={{}}>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						padding: 20,
						color: "#fff",
					}}
				>
					Task List
				</Text>
			</View> */}
			<View style={{ flexDirection: "row", padding: 20 }}>
				<TaskStatusHeader label="Complete" count={65} isActive={true} />
				<TaskStatusHeader label="In Progress" count={45} isActive={false} />
			</View>

			<ScrollView style={{ flex: 1 }}>
				<View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
					<TaskCards />
				</View>
			</ScrollView>

			<TouchableOpacity
				style={{
					position: "absolute",
					bottom: 20,
					left: 300,
					right: 20,
					backgroundColor: "#f2e29b",
					paddingVertical: 15,
					borderRadius: 50,
					alignItems: "center",
				}}
				onPress={() => navigation.navigate("CreateTask")}
			>
				<Ionicons name="add" size={35} color="#000" />
			</TouchableOpacity>
		</View>
	);
}
