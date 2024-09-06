import Ionicons from "react-native-vector-icons/Ionicons";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
} from "react-native";
import SideSwipe from "react-native-sideswipe";
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

const data = [
	{ id: "1", label: "All", count: 105, isActive: true },
	{ id: "2", label: "Complete", count: 65, isActive: false },
	{ id: "3", label: "In Progress", count: 45, isActive: false },
];

export default function TaskList() {
	const navigation = useNavigation<NavigationProp>();
	const { width } = Dimensions.get("window");

	return (
		<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
			<View style={{ flexDirection: "row", padding: 20 }}>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						color: "#fff",
						marginStart: 10,
						marginTop: 20,
					}}
				>
					Task List
				</Text>
			</View>
			<View style={{ flexDirection: "row", padding: 20 }}>
				<SideSwipe
					data={data}
					itemWidth={width * 0.85}
					contentContainerStyle={{
						// paddingTop: -20,
						paddingBottom: 20,
						paddingEnd: 10,
					}}
					style={{ width }}
					threshold={120}
					renderItem={({ item }) => (
						<TaskStatusHeader
							key={item.id}
							label={item.label}
							count={item.count}
							isActive={item.isActive}
						/>
					)}
				/>
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
