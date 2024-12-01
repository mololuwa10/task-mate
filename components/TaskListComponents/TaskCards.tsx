import React, { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { deleteToDoItem } from "@/lib/apiDeleteActions";

export default function TaskCards({
	tasks,
	onDeleteTask,
}: {
	tasks: any[];
	onDeleteTask: (taskId: string) => void;
}) {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const router = useRouter();
	// const [tasks, setTasks] = useState(initialTasks);
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case "High":
				return "#ff4d4d"; // red
			case "Medium":
				return "#ffcc00"; // yellow
			case "Low":
				return "#66cc66"; // green
			default:
				return "#cccccc"; // gray
		}
	};

	const getIsCompleted = (isCompleted: boolean) => {
		return isCompleted ? "#4CAF50" : "#F44336";
	};

	// Function to handle task deletion
	// const handleDeleteTask = async (taskId: string) => {
	// 	Alert.alert(
	// 		"Confirm Delete",
	// 		"Are you sure you want to delete this task?",
	// 		[
	// 			{ text: "Cancel", style: "cancel" },
	// 			{
	// 				text: "Delete",
	// 				style: "destructive",
	// 				onPress: async () => {
	// 					try {
	// 						await deleteToDoItem(taskId);
	// 						// Remove the deleted task from the state to update the UI
	// 						setTasks((prevTasks) =>
	// 							prevTasks.filter((task) => task.taskId !== taskId)
	// 						);
	// 						alert("Task deleted successfully.");
	// 					} catch (error) {
	// 						alert("Failed to delete task.");
	// 					}
	// 				},
	// 			},
	// 		]
	// 	);
	// };

	// Rendering the task cards
	return (
		<>
			{tasks.map((task) => (
				<TouchableOpacity
					key={task.taskId}
					style={{
						backgroundColor: "#303030",
						borderRadius: 15,
						padding: 21,
						marginRight: 15,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 5,
						elevation: 5,
						width: 350,
						marginTop: 15,
					}}
					onPress={() =>
						navigation.navigate("IndividualTaskPage", { taskId: task.taskId })
					}
				>
					<View>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<Text
								style={{
									color: "white",
									fontWeight: "bold",
									marginBottom: 10,
								}}
							>
								{task.taskName}
							</Text>
							<TouchableOpacity onPress={() => onDeleteTask(task.taskId)}>
								{/* <Icon name="ellipsis-h" size={20} color="#FFFFFF" /> */}
								<Icon name="trash" size={20} color="#FFFFFF" />
							</TouchableOpacity>
						</View>

						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
						>
							<Text
								style={{
									color: "white",
									borderRadius: 50,
									backgroundColor: getPriorityColor(task.priority),
									paddingVertical: 5,
									paddingHorizontal: 10,
									alignSelf: "flex-start",
								}}
							>
								{task.priority}
							</Text>

							<Text
								style={{
									color: "white",
									borderRadius: 50,
									backgroundColor: getIsCompleted(task.isCompleted),
									paddingVertical: 5,
									paddingHorizontal: 10,
									alignSelf: "flex-start",
								}}
							>
								{task.isCompleted ? "Completed" : "In Progress"}
							</Text>
						</View>
					</View>

					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							marginTop: 20,
						}}
					>
						<View
							style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
						>
							<Ionicons name="calendar-outline" size={25} color="white" />
							<Text style={{ color: "white" }}>
								{moment(task.dueDate).format("MMMM D, YYYY")}
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			))}
		</>
	);
}
