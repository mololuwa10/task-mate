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
	ActivityIndicator,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/FontAwesome";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getToDoItemById } from "@/lib/dbModel";
import { updateSubTasks } from "@/lib/apiPutActions";
import { postSubTask } from "@/lib/apiPostActions";
import { deleteSubTask } from "@/lib/apiDeleteActions";

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
	const [removedSubTasks, setRemovedSubTasks] = useState<SubTask[]>([]);

	useEffect(() => {
		const fetchTask = async () => {
			setLoading(true);
			try {
				const fetchedTask = await getToDoItemById(taskId);
				if (fetchedTask) {
					// console.log("Fetched Task:", fetchedTask.subtasks);

					setTask(Array.isArray(fetchedTask) ? fetchedTask[0] : fetchedTask);

					setDueDate(new Date(fetchedTask.dueDate));

					// Set the fetched subtasks to state
					setSubTasks(
						Array.isArray(fetchedTask.subtasks?.$values)
							? fetchedTask.subtasks.$values
							: []
					);

					// Map the dates if available
					setSubTaskDates(
						Array.isArray(fetchedTask.subtasks?.$values)
							? fetchedTask.subtasks?.$values.map((sub: any) =>
									sub.subtaskDueDate ? new Date(sub.subtaskDueDate) : new Date()
							  )
							: []
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
		setSubTasks((prevSubTasks) => [
			...(Array.isArray(prevSubTasks) ? prevSubTasks : []),
			{
				subTaskName: "",
				subtaskDescription: "",
				subtaskDueDate: "",
				subtaskIsCompleted: false,
			},
		]);
	};

	const updateSubTask = (index: number, field: keyof SubTask, value: any) => {
		const updatedSubTasks = [...subTasks];
		(updatedSubTasks[index] as any)[field] = value;
		setSubTasks(updatedSubTasks);
		console.log("updatedSubTasks", updatedSubTasks);
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

		console.log("selectedDate", selectedDate, "dueDate", dueDate);

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
	// const removeSubtask = (index: number) => {
	// 	setSubTasks(subTasks.filter((_, i) => i !== index));
	// };
	const removeSubtask = (index: number) => {
		const subtaskToRemove = subTasks[index];
		if (subtaskToRemove?.subTaskId) {
			// Add the subtask to the removed list if it exists in the database
			setRemovedSubTasks((prev) => [...prev, subtaskToRemove]);
		}
		// Remove the subtask from the current state
		setSubTasks(subTasks.filter((_, i) => i !== index));
	};

	const handleSaveChanges = async () => {
		setLoading(true);
		try {
			// Create an array of promises for updating or creating subtasks
			const subTaskPromises = subTasks.map(async (subtask, i) => {
				const { subTaskId } = subtask;
				const updatedSubtask = {
					...subtask,
					subtaskDueDate:
						subTaskDates[i]?.toISOString() || new Date().toISOString(),
				};

				if (subTaskId) {
					// Update existing subtask
					return updateSubTasks(updatedSubtask, subTaskId);
				} else {
					// Create new subtask
					return postSubTask(
						{
							SubTaskName: updatedSubtask.subTaskName,
							SubtaskDescription: updatedSubtask.subtaskDescription,
							SubtaskDueDate: updatedSubtask.subtaskDueDate,
						},
						task.taskId
					);
				}
			});

			const deletePromises = removedSubTasks.map(async (removedSubtask) => {
				if (removedSubtask?.subTaskId) {
					return deleteSubTask(removedSubtask.subTaskId);
				}
			});

			// Wait for all API calls to complete
			await Promise.all([...subTaskPromises, ...deletePromises]);

			// Clean up states
			setTask(null);
			setSubTasks([]);
			setSubTaskDates([]);
			setRemovedSubTasks([]);

			// Show success toast
			Toast.show({
				type: "success",
				text1: "Changes Saved",
				text2: "All subtasks have been updated successfully.",
			});

			// Navigate back after successful updates
			// Navigate with a delay
			setTimeout(() => {
				navigation.navigate("IndividualTaskPage");
			}, 300);
			// navigation.navigate("IndividualTaskPage");
		} catch (error) {
			console.error("Error saving changes:", error);
			Toast.show({
				type: "error",
				text1: "Error",
				text2: "Failed to save changes. Please try again.",
			});
		} finally {
			setLoading(false);
		}
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
							paddingTop: Platform.OS === "ios" ? 50 : 20,
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

						{Array.isArray(subTasks) && subTasks.length > 0 ? (
							subTasks.map((subtask, index) => (
								<View
									key={index}
									style={{
										flex: 1,
										flexDirection: "column",
										backgroundColor: "#1e1e1e",
										borderRadius: 10,
										paddingHorizontal: 5,
										marginBottom: 15,
									}}
								>
									{/* Subtask Name */}
									<TextInput
										style={{
											backgroundColor: "#2c2c2c",
											color: "white",
											paddingHorizontal: 15,
											paddingVertical: 15,
											borderRadius: 5,
											marginBottom: 10,
										}}
										placeholder={`Subtask Name ${index + 1}`}
										placeholderTextColor="#777"
										value={subtask.subTaskName || ""}
										onChangeText={(text) =>
											updateSubTask(index, "subTaskName", text)
										}
									/>

									{/* Subtask Description */}
									<TextInput
										style={{
											backgroundColor: "#2c2c2c",
											color: "white",
											paddingHorizontal: 15,
											paddingVertical: 15,
											borderRadius: 5,
											marginBottom: 10,
										}}
										placeholder={`Subtask Description ${index + 1}`}
										placeholderTextColor="#777"
										value={subtask.subtaskDescription || ""}
										onChangeText={(text) =>
											updateSubTask(index, "subtaskDescription", text)
										}
									/>

									{/* Subtask Due Date */}
									<TouchableOpacity
										onPress={() => toggleSubTaskDatePicker(index)}
										style={{
											flexDirection: "row",
											alignItems: "center",
											backgroundColor: "#2c2c2c",
											padding: 10,
											borderRadius: 5,
											paddingHorizontal: 15,
											paddingVertical: 15,

											marginBottom: 10,
										}}
									>
										<Icon name="calendar" size={20} color="white" />
										<Text
											style={{
												color: "white",
												marginLeft: 10,
												flex: 1,
											}}
										>
											{subTaskDates[index]
												? subTaskDates[index].toDateString()
												: "Select Due Date"}
										</Text>
									</TouchableOpacity>

									{/* Show Date Picker */}
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

									{/* Remove Subtask Button */}
									<TouchableOpacity
										onPress={() => removeSubtask(index)}
										style={{
											marginTop: 15,
											backgroundColor: "#ff4d4d",
											padding: 10,
											borderRadius: 5,
										}}
									>
										<Text style={{ color: "white", textAlign: "center" }}>
											Remove Subtask
										</Text>
									</TouchableOpacity>
								</View>
							))
						) : (
							<Text
								style={{ color: "white", textAlign: "center", marginTop: 20 }}
							>
								No Subtasks Found
							</Text>
						)}
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
					onPress={handleSaveChanges}
				>
					{loading ? (
						<ActivityIndicator size="small" color="#ffffff" />
					) : (
						<Text
							style={{ color: "#1c1c1c", fontSize: 16, fontWeight: "bold" }}
						>
							Save Changes
						</Text>
					)}
				</TouchableOpacity>
			</View>
		</>
	);
}
