import { SubTask } from "@/lib/apiPostActions";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Platform,
	TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getToDoItemById } from "@/lib/dbModel";

type RootStackParamList = {
	TaskList: undefined;
	EditSubTask: { taskId: number };
};

type IndividualTaskPageRouteProp = RouteProp<
	RootStackParamList,
	"EditSubTask"
> & { taskId: number };

export default function EditSubTask() {
	const route = useRoute();
	const navigation = useNavigation<StackNavigationProp<any>>();
	const { taskId } = (route.params as IndividualTaskPageRouteProp) || {};
	const [loading, setLoading] = useState(false);
	const [task, setTask] = useState<any>(null);
	const [subTasks, setSubTasks] = useState<SubTask[]>([]);
	const [images, setImages] = useState<string[]>([]);
	const [subTaskDates, setSubTaskDates] = useState<Date[]>([]);
	const [showSubTaskDatePickers, setShowSubTaskDatePickers] = useState<
		boolean[]
	>([]);
	const [dueDate, setDueDate] = useState(new Date());
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTask = async () => {
			setLoading(true);
			try {
				const fetchedTask = await getToDoItemById(taskId);
				if (fetchedTask) {
					console.log("Fetched Task:", fetchedTask.subtasks);

					setTask(fetchedTask);

					// Set the fetched subtasks to state
					setSubTasks(fetchedTask.subtasks.$values);
					// Map the dates if available
					setSubTaskDates(
						fetchedTask.subtasks.$values.map((subtask: SubTask) =>
							subtask.subtaskDueDate
								? new Date(subtask.subtaskDueDate)
								: new Date()
						)
					);
				} else {
					setError("Failed to load task");
				}
			} catch (error) {
				setError("Error fetching task");
			} finally {
				setLoading(false);
			}
		};

		if (taskId) {
			fetchTask();
		}
	}, [taskId]);

	const addSubTask = () => {
		setSubTasks([
			...subTasks,
			{ subTaskName: "", subtaskDescription: "", subtaskDueDate: "" },
		]);
	};

	const updateSubTask = (
		index: number,
		field: keyof SubTask,
		value: string
	) => {
		const updatedSubTasks = [...subTasks];
		updatedSubTasks[index][field] = value;
		setSubTasks(updatedSubTasks);
	};

	const updateSubTaskDate = (index: number, selectedDate: Date) => {
		const updatedDates = [...subTaskDates];
		updatedDates[index] = selectedDate || new Date();
		setSubTaskDates(updatedDates);
	};

	// Function to handle subtask due date change
	const onSubTaskDateChange = (
		event: any,
		selectedDate: Date | undefined,
		index: number
	) => {
		const updatedShowPickers = [...showSubTaskDatePickers];
		updatedShowPickers[index] = Platform.OS === "ios";
		setShowSubTaskDatePickers(updatedShowPickers);

		if (selectedDate && selectedDate < dueDate) {
			updateSubTaskDate(index, selectedDate);
			updateSubTask(index, "subtaskDueDate", selectedDate.toISOString());
		} else {
			Toast.show({
				type: "error",
				text1: "Invalid Subtask Due Date",
				text2:
					"The subtask due date cannot be later than the main task due date.",
			});
		}
	};

	// Function to toggle visibility of the DatePicker for a specific subtask
	const toggleSubTaskDatePicker = (index: number) => {
		const updatedShowPickers = [...showSubTaskDatePickers];
		updatedShowPickers[index] = !updatedShowPickers[index];
		setShowSubTaskDatePickers(updatedShowPickers);
	};

	// Function to remove a subtask
	const removeSubtask = (index: number) => {
		setSubTasks(subTasks.filter((_, i) => i !== index));
	};

	return (
		<>
			<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
				<ScrollView style={{ flexGrow: 1, marginBottom: 50 }}>
					{/* Header */}
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							paddingVertical: 20,
							paddingHorizontal: 20,
							paddingTop: Platform.OS === "ios" ? 50 : 45,
							backgroundColor: "#1c1c1c",
						}}
					>
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Icon name="close" size={22} color="white" />
						</TouchableOpacity>
						<View style={{ flex: 1, alignItems: "center" }}>
							<Text
								style={{
									fontSize: 18,
									fontWeight: "bold",
									color: "white",
									textAlign: "center",
								}}
							>
								Edit Task
							</Text>
						</View>
					</View>

					<View
						style={{
							paddingVertical: 10,
							paddingHorizontal: 20,
						}}
					>
						<Text
							style={{
								color: "white",
								fontSize: 20,
								fontWeight: "600",
							}}
						>
							Sub-tasks
						</Text>

						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#2c2c2c",
								borderRadius: 10,
								marginBottom: 20,
								padding: 10,
								paddingHorizontal: 15,
								marginTop: 15,
							}}
							onPress={addSubTask}
						>
							<Icon name="plus" size={20} color="white" />
							<Text
								style={{
									backgroundColor: "#2c2c2c",
									color: "white",
									paddingHorizontal: 15,
									paddingVertical: 10,
									borderRadius: 10,
								}}
							>
								Add a Subtask
							</Text>
						</TouchableOpacity>

						{subTasks.map((subtask, index) => (
							<View
								key={index}
								style={{
									flex: 1,
									alignItems: "center",
									marginBottom: 20,
								}}
							>
								<TextInput
									style={{
										backgroundColor: "#2c2c2c",
										color: "white",
										width: "100%",
										paddingHorizontal: 15,
										paddingVertical: 15,
										borderRadius: 10,
										marginBottom: 10,
									}}
									placeholder={`Subtask Name ${index + 1}`}
									placeholderTextColor="#777"
									value={subtask.subTaskName || ""}
									onChangeText={(text) =>
										updateSubTask(index, "subTaskName", text)
									}
								/>
								<TextInput
									style={{
										backgroundColor: "#2c2c2c",
										color: "white",
										width: "100%",
										paddingHorizontal: 15,
										paddingVertical: 15,
										borderRadius: 10,
										marginBottom: 10,
									}}
									placeholder={`Subtask Description ${index + 1}`}
									placeholderTextColor="#777"
									value={subtask.subtaskDescription || ""}
									onChangeText={(text) =>
										updateSubTask(index, "subtaskDescription", text)
									}
								/>
								<TouchableOpacity
									style={{
										flexDirection: "row",
										alignItems: "center",
										backgroundColor: "#2c2c2c",
										borderRadius: 10,
										marginBottom: 20,
										width: "100%",
										paddingHorizontal: 15,
										padding: 15,
									}}
									onPress={() => toggleSubTaskDatePicker(index)}
								>
									<Icon name="calendar" size={20} color="white" />
									<Text
										style={{
											backgroundColor: "#2c2c2c",
											color: "white",
											paddingHorizontal: 15,
											paddingVertical: 10,
											borderRadius: 10,
											flex: 1,
										}}
									>
										{subTaskDates[index]
											? subTaskDates[index].toDateString()
											: "Select Due Date"}
									</Text>
								</TouchableOpacity>

								{/* Date Picker */}
								{showSubTaskDatePickers[index] && (
									<DateTimePicker
										value={subTaskDates[index] || new Date()}
										mode="date"
										display="default"
										onChange={(event, date) =>
											onSubTaskDateChange(event, date, index)
										}
									/>
								)}

								<TouchableOpacity
									onPress={() => removeSubtask(index)}
									style={{
										backgroundColor: "#ff4d4d",
										paddingVertical: 10,
										borderRadius: 10,
										width: "100%",
									}}
								>
									<Text style={{ color: "white", textAlign: "center" }}>
										Remove Subtask
									</Text>
								</TouchableOpacity>
							</View>
						))}
					</View>
				</ScrollView>

				<TouchableOpacity
					style={{
						position: "absolute",
						bottom: 10,
						left: 20,
						right: 20,
						backgroundColor: "#f2e29b",
						paddingVertical: 15,
						borderRadius: 10,
						alignItems: "center",
					}}
					// onPress={handleCreateTask}
				>
					<Text style={{ color: "#1c1c1c", fontSize: 16, fontWeight: "bold" }}>
						Save Changes
					</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}
