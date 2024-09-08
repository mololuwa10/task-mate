import React from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";

export default function TaskCards({ tasks }: { tasks: any[] }) {
	// Log the tasks received by TaskCards
	// console.log("Tasks in TaskCards:", tasks);
	// Function to get the priority color
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
							<TouchableOpacity>
								<Icon name="ellipsis-h" size={20} color="#FFFFFF" />
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
