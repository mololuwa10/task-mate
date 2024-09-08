import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Platform,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { getToDoItems } from "@/lib/dbModel";
import { useCallback, useState } from "react";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

export default function UserProfileTaskCards() {
	const [cards, setCards] = useState<any[]>([]);

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
		switch (isCompleted) {
			case true:
				return "#4CAF50"; // green
			case false:
				return "#F44336"; // red
			default:
				return "#cccccc"; // gray
		}
	};

	// Fetch the tasks when the screen is in focus
	useFocusEffect(
		useCallback(() => {
			let isMounted = true;

			const fetchToDoItems = async () => {
				try {
					const response = await getToDoItems();
					if (response && response.$values) {
						// Filter out tasks that are not completed
						// const ongoingTasks = response.$values.filter(
						// 	(task) => !task.isCompleted
						// );

						// Sort tasks by earliest created date
						const sortedTasks = response.$values.sort((a, b) => {
							const dateA = new Date(a.dateCreated).getTime();
							const dateB = new Date(b.dateCreated).getTime();
							return dateA - dateB;
						});

						// Map the ongoing tasks to the card structure
						const cardData = sortedTasks.map((task) => ({
							id: task.taskId,
							priority: task.priority,
							priorityColor: getPriorityColor(task.priority),
							isCompleted: task.isCompleted,
							isCompletedColor: getIsCompleted(task.isCompleted),
							textColor: task.priority === "High" ? "white" : "black",
							title: task.taskName,
							time:
								moment(task.dateCreated).format("DD/MM/YYYY h:mm A") +
								" - " +
								moment(task.dueDate).format("DD/MM/YYYY h:mm A"),
							dueDate: moment(task.dueDate).format("MMMM D, YYYY"),
						}));

						// Add a spacer at the end
						setCards([
							...cardData,
							{
								id: "spacer",
								priority: "",
								priorityColor: "",
								isCompleted: false,
                                isCompletedColor: "",
								textColor: "",
								title: "",
								time: "",
								dueDate: "",
							},
						]);
					}
				} catch (error) {
					console.error("Error fetching to-do items:", error);
					Alert.alert("Error", "Failed to fetch tasks");
				}
			};
			fetchToDoItems();

			return () => {
				isMounted = false;
			};
		}, [])
	);

	// Rendering the task cards
	return (
		<>
			{cards.map((card) => {
				if (card.id === "spacer") {
					return <View key={card.id} style={{ height: 50 }} />;
				}

				return (
					<TouchableOpacity
						key={card.id}
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
									{card.title}
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
										backgroundColor: card.priorityColor,
										paddingVertical: 5,
										paddingHorizontal: 10,
										alignSelf: "flex-start",
									}}
								>
									{card.priority}
								</Text>

								<Text
									style={{
										color: "white",
										borderRadius: 50,
										backgroundColor: card.isCompletedColor,
										paddingVertical: 5,
										paddingHorizontal: 10,
										alignSelf: "flex-start",
									}}
								>
									{card.isCompleted ? "Completed" : "Incomplete"}
								</Text>
							</View>
						</View>

						<View
							style={{
								flex: 1,
								flexDirection: "row",
								justifyContent: "space-between",
								marginTop: 20,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									gap: 10,
								}}
							>
								<Ionicons name="calendar-outline" size={25} color="white" />
								<Text style={{ color: "white" }}>{card.dueDate}</Text>
							</View>
							<Icon name="user-circle" size={20} color="#FFFFFF" />
						</View>
					</TouchableOpacity>
				);
			})}
		</>
	);
}
