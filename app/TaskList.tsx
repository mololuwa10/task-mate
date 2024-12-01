import React, { useState, useEffect, useCallback } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Dimensions,
	Alert,
} from "react-native";
import SideSwipe from "react-native-sideswipe";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import TaskStatusHeader from "@/components/TaskListComponents/TaskStatusHeader";
import TaskCards from "@/components/TaskListComponents/TaskCards";
import { getToDoItems } from "@/lib/dbModel";
import { useFocusEffect } from "@react-navigation/native";
import { deleteToDoItem } from "@/lib/apiDeleteActions";

export default function TaskList() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const { width } = Dimensions.get("window");

	const [filter, setFilter] = useState("All");
	const [tasks, setTasks] = useState<any[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
	const [counts, setCounts] = useState({
		all: 0,
		complete: 0,
		inProgress: 0,
	});

	// Fetch tasks when the screen is in focus
	useFocusEffect(
		useCallback(() => {
			const fetchTasks = async () => {
				try {
					const response = await getToDoItems();
					if (response && response.$values) {
						const taskData = response.$values;

						// Calculate the count for each filter
						const allCount = taskData.length;
						const completeCount = taskData.filter(
							(task) => task.isCompleted
						).length;
						const inProgressCount = taskData.filter(
							(task) => !task.isCompleted
						).length;

						// Set task counts
						setCounts({
							all: allCount,
							complete: completeCount,
							inProgress: inProgressCount,
						});

						setTasks(taskData);
						setFilteredTasks(taskData);
					}
				} catch (error) {
					console.error("Error fetching tasks:", error);
				}
			};
			fetchTasks();
		}, [])
	);

	// Update filtered tasks based on selected filter
	useEffect(() => {
		// console.log(`Applying filter: ${filter}`);
		const filterTasks = () => {
			let updatedTasks = [];
			if (filter === "All") {
				updatedTasks = tasks;
			} else if (filter === "Complete") {
				updatedTasks = tasks.filter((task) => task.isCompleted);
			} else if (filter === "In Progress") {
				updatedTasks = tasks.filter((task) => !task.isCompleted);
			}
			setFilteredTasks(updatedTasks);
			console.log(`Filtered tasks count: ${updatedTasks.length}`);
		};
		filterTasks();
	}, [filter, tasks]);

	const data = [
		{ id: "1", label: "All", count: counts.all, isActive: filter === "All" },
		{
			id: "2",
			label: "Complete",
			count: counts.complete,
			isActive: filter === "Complete",
		},
		{
			id: "3",
			label: "In Progress",
			count: counts.inProgress,
			isActive: filter === "In Progress",
		},
	];

	const handleFilterClick = (label: string) => {
		console.log(`Filter clicked: ${label}`);
		setFilter(label);
	};

	const handleDeleteTask = async (taskId: string) => {
		Alert.alert(
			"Confirm Delete",
			"Are you sure you want to delete this task?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: async () => {
						try {
							// Delete from backend
							await deleteToDoItem(taskId);

							// Remove the task from state
							setTasks((prevTasks) =>
								prevTasks.filter((task) => task.taskId !== taskId)
							);
							setFilteredTasks((prevTasks) =>
								prevTasks.filter((task) => task.taskId !== taskId)
							);
							alert("Task deleted successfully.");
						} catch (error) {
							alert("Failed to delete task.");
						}
					},
				},
			]
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
			<View style={{ flexDirection: "row", padding: 20 }}>
				<Text
					style={{
						fontSize: 24,
						fontWeight: "bold",
						color: "#fff",
						marginStart: 10,
						marginTop: 10,
					}}
				>
					Task List
				</Text>
			</View>

			{/* Filter Selection */}
			<View style={{ flexDirection: "row", padding: 20 }}>
				<SideSwipe
					data={data}
					itemWidth={width * 0.85}
					contentContainerStyle={{
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
							onPress={handleFilterClick}
						/>
					)}
				/>
			</View>

			{/* Task Cards */}
			<ScrollView style={{ flex: 1 }}>
				<View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
					<TaskCards tasks={filteredTasks} onDeleteTask={handleDeleteTask} />
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
