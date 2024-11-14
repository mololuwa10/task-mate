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

	const addSubTask = () => {
		setSubTasks([
			...subTasks,
			{
				subTaskId: "",
				subTaskName: "",
				subtaskDescription: "",
				subtaskDueDate: "",
				subtaskIsCompleted: false,
			},
		]);
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

	const updateSubTask = (
		index: number,
		field: keyof SubTask,
		value: string
	) => {
		const updatedSubTasks = [...subTasks];
		(updatedSubTasks[index] as any)[field] = value;
		setSubTasks(updatedSubTasks);
	};

	const updateSubTaskDate = (index: number, selectedDate: Date) => {
		const updatedDates = [...subTaskDates];
		updatedDates[index] = selectedDate || new Date();
		setSubTaskDates(updatedDates);
	};

	// Initialize the showDatePickers state when subtasks are added or modified
	useEffect(() => {
		setShowSubTaskDatePickers(subTasks.map(() => false));
	}, [subTasks]);

	// Function to remove a subtask
	const removeSubtask = (index: number) => {
		setSubTasks(subTasks.filter((_, i) => i !== index));
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

	const handleCreateTask = async () => {
		// Create a new Date object with specific time
		const createdDateWithTime = new Date(dateCreated);
		createdDateWithTime.setUTCHours(23, 59, 59, 0);

		const dueDateWithTime = new Date(dueDate);
		dueDateWithTime.setUTCHours(23, 59, 59, 0);

		// Format the due date to ISO 8601 string
		const formattedDueDate = dueDateWithTime.toISOString();

		const formattedDateCreated = dateCreated.toISOString();
		console.log(formattedDateCreated);

		// Prepare the ToDo item data
		const toDoItem = {
			TaskName: taskName,
			TaskDescription: taskDescription,
			DateCreated: formattedDateCreated,
			DueDate: formattedDueDate, // Correctly formatted due date
			Priority: selectedPriority,
			CategoryId: selectedCategory ? parseInt(selectedCategory) : undefined,
			Subtasks: subTasks.map((subtask) => ({
				SubTaskName: subtask.subTaskName,
				SubtaskDescription: subtask.subtaskDescription,
				DueDate: subtask.subtaskDueDate,
			})),
		};

		// Convert image uris to file objects
		const attachments: File[] = images.map((uri) => {
			const filename = uri.split("/").pop()!;
			const fileType = filename.split(".").pop()!;
			return {
				uri,
				name: filename,
				type: `image/${fileType}`,
			} as any as File;
		});

		try {
			const response = await postToDoItem(toDoItem, attachments);

			if (response) {
				// Assuming if response is truthy, the task was created successfully
				Toast.show({
					type: "success",
					text1: "Task created",
					text2: "Your task was created successfully",
				});
				// Alert.alert("Task Created", "Your task was created successfully");
				navigation.goBack();
			} else {
				Toast.show({
					type: "error",
					text1: "Task Creation Failed",
					text2: "An error occurred while creating the task.",
				});
				Alert.alert(
					"Task Creation Failed",
					"An error occurred while creating the task."
				);
			}
		} catch (error: any) {
			Toast.show({
				type: "error",
				text1: "Task Creation Failed",
				text2: error.message,
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
								onChange={(event, selectedDate) =>
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
								editable={false} // Assuming you'll implement a date picker here
							/>
						</TouchableOpacity>

						{showDueDatePicker && (
							<DateTimePicker
								value={dueDate || new Date()}
								mode="date"
								display="default"
								onChange={(event, selectedDate) =>
									handleDateChange(event, selectedDate, "dueDate")
								}
							/>
						)}

						{/* <Text style={styles.label}>Sub-task</Text>

						<TouchableOpacity
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: "#2c2c2c",
								borderRadius: 10,
								marginBottom: 20,
								padding: 10,

								paddingHorizontal: 15,
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
									value={subtask.subTaskName}
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
									value={subtask.SubtaskDescription}
									onChangeText={(text) =>
										updateSubTask(index, "SubtaskDescription", text)
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
									}}
									onPress={() => toggleSubTaskDatePicker(index)}
								>
									<Icon name="calendar" size={20} color="white" />
									<TextInput
										style={styles.input}
										placeholder={`Due Date ${index + 1}`}
										placeholderTextColor="#777"
										value={
											subTaskDates[index]
												? subTaskDates[index].toDateString()
												: "Select Date"
										}
										editable={false}
									/>
								</TouchableOpacity>

								{showSubTaskDatePickers[index] && (
									<DateTimePicker
										value={subTaskDates[index] || new Date()}
										mode="date"
										display="default"
										onChange={(event, selectedDate) =>
											onSubTaskDateChange(event, selectedDate, index)
										}
									/>
								)}

								<TouchableOpacity onPress={() => removeSubtask(index)}>
									<Icon name="trash" size={20} color="red" />
								</TouchableOpacity>
							</View>
						))} */}

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
					onPress={handleCreateTask}
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
