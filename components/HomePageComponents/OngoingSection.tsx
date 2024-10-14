import { Ionicons } from "@expo/vector-icons";
import { Text, View, Dimensions, TouchableOpacity } from "react-native";
import SideSwipe from "react-native-sideswipe";
import Icon from "react-native-vector-icons/FontAwesome";
import { getToDoItems, ToDoItemsResponse } from "@/lib/dbModel";
import React, { useEffect, useState, useCallback } from "react";
import moment from "moment";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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

export default function OngoingSection() {
	const navigation = useNavigation<StackNavigationProp<any>>();

	const { width } = Dimensions.get("window");
	const [cards, setCards] = useState<
		Array<{
			id: number | string | undefined;
			priority: string;
			priorityColor: string;
			textColor: string;
			title: string;
			time: string;
			dueDate: string;
		}>
	>([]);

	const getPriorityColor = (priority: any) => {
		switch (priority) {
			case "High":
				return "red";
			case "Medium":
				return "yellow";
			case "Low":
				return "green";
			default:
				return "gray";
		}
	};
	useFocusEffect(
		useCallback(() => {
			let isMounted = true;

			const fetchToDoItems = async () => {
				try {
					const response = await getToDoItems();
					if (response && response.$values) {
						// Filter out tasks that are not completed
						const ongoingTasks = response.$values.filter(
							(task) => !task.isCompleted
						);

						// Sort tasks by earliest due date
						const sortedTasks = ongoingTasks.sort((a, b) => {
							const dateA = new Date(a.dueDate).getTime();
							const dateB = new Date(b.dueDate).getTime();
							return dateA - dateB; // Sort in ascending order
						});

						// Map the ongoing tasks to the card structure
						const cardData = sortedTasks
							.map((task) => ({
								id: task.taskId,
								priority: task.priority,
								priorityColor: getPriorityColor(task.priority),
								textColor: task.priority === "High" ? "white" : "black",
								title: task.taskName,
								time:
									moment(task.dateCreated).format("DD/MM/YYYY h:mm A") +
									" - " +
									moment(task.dueDate).format("DD/MM/YYYY h:mm A"),
								dueDate: moment(task.dueDate).format("MMMM D, YYYY"),
							}))
							.slice(0, 4);

						// Add a spacer at the end
						setCards([
							...cardData,
							{
								id: "spacer",
								priority: "",
								priorityColor: "",
								textColor: "",
								title: "",
								time: "",
								dueDate: "",
							},
						]);
					}
					console.log(response);
				} catch (error) {
					console.error("Error fetching to-do items:", error);
				}
			};
			fetchToDoItems();

			return () => {
				isMounted = false;
			};
		}, [])
	);

	return (
		<>
			<View style={{ marginBottom: 20 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
						Ongoing Task
					</Text>

					<TouchableOpacity onPress={() => navigation.navigate("TaskList")}>
						<Text style={{ color: "#f2e29b" }}>See all</Text>
					</TouchableOpacity>
				</View>

				<SideSwipe
					data={cards}
					itemWidth={width * 0.85}
					contentContainerStyle={{
						paddingTop: 20,
						paddingBottom: 20,
						paddingEnd: 10,
					}}
					style={{ width }}
					threshold={120}
					renderItem={({ item }) =>
						item.id === "spacer" ? (
							<View style={{ width: 10 }} />
						) : (
							<TouchableOpacity
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
									width: 300,
								}}
								key={item.id}
								onPress={() =>
									navigation.navigate("IndividualTaskPage", {
										taskId: item.id,
									})
								}
							>
								<View>
									<Text
										style={{
											color: (
												item as {
													textColor: string;
													priority: string;
												}
											).textColor,
											borderRadius: 50,
											backgroundColor: (
												item as {
													priorityColor: string;
												}
											).priorityColor,
											paddingVertical: 5,
											paddingHorizontal: 10,
											alignSelf: "flex-start",
										}}
									>
										{(item as { priority: string }).priority}
									</Text>

									<Text
										style={{
											color: "white",
											fontWeight: "bold",
											marginTop: 10,
										}}
									>
										{(item as { title: string }).title}
									</Text>

									<View
										style={{ marginTop: 10, flex: 1, flexDirection: "row" }}
									>
										<Ionicons name="time-outline" size={20} color="#adaaaa" />
										<Text style={{ color: "#adaaaa", marginLeft: 10 }}>
											{(item as { time: string }).time}
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
									<Text style={{ color: "white" }}>
										{" "}
										Due Date: {(item as { dueDate: string }).dueDate}
									</Text>
									<Icon name="user-circle" size={20} color="#FFFFFF" />
								</View>
							</TouchableOpacity>
						)
					}
				/>
			</View>
		</>
	);
}
