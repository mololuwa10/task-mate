import React, { useState, useEffect } from "react";
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Platform,
	Image,
	Alert,
	Linking,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getCategories, getToDoItemById } from "@/lib/dbModel";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { postToDoItem, SubTask } from "@/lib/apiPostActions";
import { updateToDoItem } from "@/lib/apiPutActions";

type RootStackParamList = {
	TaskList: undefined;
	EditTask: { taskId: number };
};

type IndividualTaskPageRouteProp = RouteProp<RootStackParamList, "EditTask"> & {
	taskId: number;
};

export default function EditTask() {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const route = useRoute();
	const { taskId } = (route.params as IndividualTaskPageRouteProp) || {};
	const [task, setTask] = useState<any>(null);
	const [error, setError] = useState<string | null>(null);
	const [taskName, setTaskName] = useState("");
	const [taskDescription, setTaskDescription] = useState("");
	const [loading, setLoading] = useState(true);
	const [dateCreated, setDateCreated] = useState(new Date());
	const [dueDate, setDueDate] = useState(new Date());
	const [showStartDatePicker, setShowStartDatePicker] = useState(false);
	const [showDueDatePicker, setShowDueDatePicker] = useState(false);
	const [categories, setCategories] = useState<
		{ label: string; value: string }[]
	>([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedPriority, setSelectedPriority] = useState("");
	const [subTasks, setSubTasks] = useState<SubTask[]>([]);
	const [images, setImages] = useState<string[]>([]);
	const [subTaskDates, setSubTaskDates] = useState<Date[]>([]);
	const [showSubTaskDatePickers, setShowSubTaskDatePickers] = useState<
		boolean[]
	>([]);

	useEffect(() => {
		const fetchTask = async () => {
			setLoading(true);
			try {
				const fetchedTask = await getToDoItemById(taskId);
				if (fetchedTask) {
					console.log("Fetched Task:", fetchedTask.subtasks);

					setTaskName(fetchedTask.taskName || "");
					setTaskDescription(fetchedTask.taskDescription || "");
					setDateCreated(new Date(fetchedTask.dateCreated));
					setDueDate(new Date(fetchedTask.dueDate));
					setSelectedCategory(fetchedTask.categoryId?.toString() || "");
					setSelectedPriority(fetchedTask.priority || "");
					setSubTasks(
						(fetchedTask.subtasks || []).map((subtask: any) => ({
							...subtask,
							SubtaskDescription: subtask.SubtaskDescription || "",
							SubtaskDueDate: subtask.SubtaskDueDate || "",
						}))
					);
					setImages(
						fetchedTask.attachments?.map((a: any) => a.attachmentPath) || []
					);

					setTask(fetchedTask);
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

	const selectImage = async () => {
		// Request permission if not already granted
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (status !== "granted") {
			Alert.alert(
				"Permission required",
				"Camera roll permissions are required to add images. Do you want to enable them in settings?",
				[
					{ text: "Cancel", style: "cancel" },
					{ text: "Open Settings", onPress: () => Linking.openSettings() },
				]
			);
			return;
		}

		// Launch image picker if permission is granted
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled && result.assets && result.assets.length > 0) {
			setImages([...images, result.assets[0].uri]);
		}
	};

	const handleDateChange = (
		event: any,
		selectedDate: Date | undefined,
		type: string
	) => {
		// Get the current date (without time for comparison)
		const now = new Date();
		now.setHours(0, 0, 0, 0);

		if (type === "startDate") {
			setShowStartDatePicker(Platform.OS === "ios");

			if (selectedDate) {
				// Ensure the created date is today or in the future
				if (selectedDate >= now && selectedDate <= dueDate) {
					setDateCreated(selectedDate);
				} else {
					Toast.show({
						type: "error",
						text1: "Invalid Date Created",
						text2:
							"The date cannot be in the past or later than the main task due date.",
					});
				}
			}
		} else if (type === "dueDate") {
			setShowDueDatePicker(Platform.OS === "ios");

			if (selectedDate) {
				// Ensure the due date is after the date created
				if (selectedDate >= dateCreated) {
					setDueDate(selectedDate);
				} else {
					Toast.show({
						type: "error",
						text1: "Invalid Due Date",
						text2: "The due date cannot be earlier than the created date.",
					});
				}
			}
		}
	};

	useEffect(() => {
		const fetchCategories = async () => {
			const fetchedCategories = await getCategories();
			if (fetchedCategories && Array.isArray(fetchedCategories.$values)) {
				const formattedCategories = fetchedCategories.$values.map(
					(category: any) => ({
						label: category.categoryName,
						value: category.categoryId.toString(),
					})
				);

				setCategories(formattedCategories);
			}
		};

		fetchCategories();
	}, []);

	const priorities = [
		{ label: "High", value: "High" },
		{ label: "Medium", value: "Medium" },
		{ label: "Low", value: "Low" },
	];

	const handleEditTask = async () => {
		const createdDateWithTime = new Date(dateCreated || new Date());
		createdDateWithTime.setUTCHours(23, 59, 59, 0);

		const dueDateWithTime = new Date(dueDate || new Date());
		dueDateWithTime.setUTCHours(23, 59, 59, 0);

		// Format the due date to ISO 8601 string
		const formattedDueDate = dueDateWithTime.toISOString();

		const formattedDateCreated = createdDateWithTime.toISOString();

		const updateTaskItem = {
			TaskName: taskName,
			TaskDescription: taskDescription,
			DateCreated: formattedDateCreated,
			DueDate: formattedDueDate,
			Priority: selectedPriority,
			CategoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
			CategoryName: selectedCategory || undefined,
			// Subtasks: subTasks.map((subtask) => ({
			// 	SubTaskName: subtask.subTaskName,
			// 	SubtaskDescription: subtask.subtaskDescription,
			// 	DueDate: subtask.subtaskDueDate,
			// })),
		};

		console.log("Task ID:", taskId);
		console.log("Update Task Item:", updateTaskItem);

		try {
			const response = await updateToDoItem(taskId, updateTaskItem);
			if (response) {
				Toast.show({
					type: "success",
					text1: "Task updated",
					text2: "Your task was updated successfully",
				});
				navigation.goBack();
			} else {
				Toast.show({
					type: "error",
					text1: "Task Update Failed",
					text2: "An error occurred while updating the task.",
				});
			}
		} catch (error) {
			Toast.show({
				type: "error",
				text1: "Task Update Failed",
				text2: "An error occurred while updating the task.",
			});
		}
	};

	return (
		<>
			<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
				<ScrollView style={{ flex: 1 }}>
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

					<View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
						<Text style={styles.label}>Task Name</Text>
						<TextInput
							style={styles.input}
							placeholderTextColor="#777"
							value={taskName}
							onChangeText={setTaskName}
						/>

						<Text style={styles.label}>Task Description</Text>
						<TextInput
							style={[styles.input, { height: 80, textAlignVertical: "top" }]}
							placeholder="Hey guys! 👋\nMake wireframe first & complete this task asap! Send me update daily!"
							placeholderTextColor="#777"
							multiline={true}
							value={taskDescription}
							onChangeText={setTaskDescription}
						/>

						<Text style={styles.label}>Start Date</Text>
						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#2c2c2c",
								borderRadius: 10,
								marginBottom: 20,
								paddingHorizontal: 15,
							}}
							onPress={() => setShowStartDatePicker(true)}
						>
							<Icon name="calendar" size={20} color="white" />

							<TextInput
								style={styles.input}
								placeholderTextColor="#777"
								value={
									dateCreated ? dateCreated.toDateString() : "Select Start Date"
								}
								// onChangeText={setDateCreated}
								editable={false}
							/>
						</TouchableOpacity>

						{showStartDatePicker && (
							<DateTimePicker
								value={dateCreated || new Date()}
								mode="date"
								display="default"
								onChange={(event: any, selectedDate: Date | undefined) =>
									handleDateChange(event, selectedDate, "startDate")
								}
							/>
						)}

						<Text style={styles.label}>Due Date</Text>
						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#2c2c2c",
								borderRadius: 10,
								marginBottom: 20,
								paddingHorizontal: 15,
							}}
							onPress={() => setShowDueDatePicker(true)}
						>
							<Icon name="calendar" size={20} color="white" />

							<TextInput
								style={styles.input}
								// placeholder="August 25, 2023"
								placeholderTextColor="#777"
								value={dueDate ? dueDate.toDateString() : "Select Due Date"}
								editable={false}
							/>
						</TouchableOpacity>

						{showDueDatePicker && (
							<DateTimePicker
								value={dueDate || new Date()}
								mode="date"
								display="default"
								onChange={(event: any, selectedDate: Date | undefined) =>
									handleDateChange(event, selectedDate, "dueDate")
								}
							/>
						)}

						<Text style={styles.label}>Select Category</Text>
						<RNPickerSelect
							onValueChange={(value) => setSelectedCategory(value)}
							items={categories}
							style={pickerSelectStyles}
							placeholder={{ label: "Select Category", value: null }}
							value={selectedCategory}
						/>

						<Text style={styles.label}>Select Priority</Text>
						<RNPickerSelect
							onValueChange={(value) => setSelectedPriority(value)}
							items={priorities}
							style={pickerSelectStyles}
							placeholder={{ label: "Select Priority", value: null }}
							value={selectedPriority}
						/>

						{/* <Text style={styles.label}>Attachments</Text>
						<ScrollView
							horizontal={true}
							style={{ flexDirection: "row", marginBottom: 20 }}
						>
							<TouchableOpacity
								style={{
									width: 60,
									height: 60,
									borderRadius: 10,
									backgroundColor: "#2c2c2c",
									justifyContent: "center",
									alignItems: "center",
									marginRight: 10,
								}}
								onPress={selectImage}
							>
								<Icon name="plus" size={20} color="white" />
							</TouchableOpacity>

							{images.map((uri, index) => (
								<Image
									key={index}
									source={{ uri }}
									style={{
										width: 60,
										height: 60,
										borderRadius: 10,
										marginRight: 10,
									}}
								/>
							))}
						</ScrollView> */}
					</View>
				</ScrollView>

				<TouchableOpacity
					style={{
						position: "absolute",
						bottom: 20,
						left: 20,
						right: 20,
						backgroundColor: "#f2e29b",
						paddingVertical: 15,
						borderRadius: 10,
						alignItems: "center",
					}}
					onPress={handleEditTask}
				>
					<Text style={{ color: "#1c1c1c", fontSize: 16, fontWeight: "bold" }}>
						Save Changes
					</Text>
				</TouchableOpacity>
			</View>
		</>
	);
}

const styles = {
	label: {
		color: "white",
		fontSize: 16,
		marginBottom: 8,
	},
	input: {
		backgroundColor: "#2c2c2c",
		color: "white",
		paddingHorizontal: 15,
		paddingVertical: 10,
		borderRadius: 10,
		marginBottom: 20,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#2c2c2c",
		borderRadius: 10,
		marginBottom: 20,
		paddingHorizontal: 15,
	},
	assignedToContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 20,
	},
	assignedUserImage: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 10,
	},
	addUserButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#2c2c2c",
		justifyContent: "center",
		alignItems: "center",
	},
	attachmentsContainer: {
		flexDirection: "row",
		marginBottom: 20,
	},
	attachmentImage: {
		width: 60,
		height: 60,
		borderRadius: 10,
		marginRight: 10,
	},
	addAttachmentButton: {
		width: 60,
		height: 60,
		borderRadius: 10,
		backgroundColor: "#2c2c2c",
		justifyContent: "center",
		alignItems: "center",
	},
	createTaskButton: {
		backgroundColor: "#f2e29b",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
	},
	createTaskButtonText: {
		color: "#1c1c1c",
		fontSize: 16,
		fontWeight: "bold",
	},
};

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingVertical: 12,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: "white",
		borderRadius: 4,
		color: "white",
		paddingRight: 30,
		marginBottom: 20,
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 1,
		borderColor: "gray",
		borderRadius: 4,
		color: "white",
		paddingRight: 30,
		marginBottom: 20,
	},
});
