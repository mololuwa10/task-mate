"use client";

import React, { useEffect, useState } from "react";
import { postToDoItem, SubTask } from "@/lib/apiPostActions";
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
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { getCategories } from "@/lib/dbModel";
import RNPickerSelect from "react-native-picker-select";
// import DatePicker from "react-native-date-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

type RootStackParamList = {
	Navigation: undefined;
};

type CreateTaskNavigationProp = StackNavigationProp<
	RootStackParamList,
	"Navigation"
>;

export default function CreateTask() {
	const navigation = useNavigation();
	const [taskName, setTaskName] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [categories, setCategories] = useState<
		{ label: string; value: string }[]
	>([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedPriority, setSelectedPriority] = useState("");
	const [subTasks, setSubTasks] = useState<SubTask[]>([]);
	const [date, setDate] = useState(new Date());
	const [show, setShow] = useState(false);

	const [images, setImages] = useState<string[]>([]);

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

	const onChange = (event: any, selectedDate: any) => {
		setShow(Platform.OS === "ios");
		if (selectedDate) {
			setDate(selectedDate);
		}
	};

	const addSubTask = () => {
		setSubTasks([
			...subTasks,
			{ subTaskName: "", SubtaskDescription: "", SubtaskDueDate: "" },
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
		{ label: "High", value: "high" },
		{ label: "Medium", value: "medium" },
		{ label: "Low", value: "low" },
	];

	return (
		<>
			<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
				<ScrollView style={{ flex: 1 }}>
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
								Create New Task
							</Text>
						</View>
					</View>

					<View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
						<Text style={styles.label}>Task Name</Text>
						<TextInput
							style={styles.input}
							placeholder="Task Name"
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
							value={description}
							onChangeText={setDescription}
						/>

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
							onPress={() => setShow(true)}
						>
							<TextInput
								style={styles.input}
								// placeholder="August 25, 2023"
								placeholderTextColor="#777"
								value={date.toDateString()}
								// onChangeText={setEndDate}
								editable={false} // Assuming you'll implement a date picker here
							/>
							<Icon name="calendar" size={20} color="white" />
						</TouchableOpacity>

						{show && (
							<DateTimePicker
								value={date}
								mode="date"
								display="default"
								onChange={onChange}
							/>
						)}

						<Text style={styles.label}>Sub-task</Text>

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

						{/** Render the subtasks */}
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
										paddingHorizontal: 15,
									}}
									onPress={() => setShow(true)}
								>
									<TextInput
										style={styles.input}
										// placeholder="August 12, 2023"
										placeholder={`Due Date ${index + 1}`}
										placeholderTextColor="#777"
										value={subtask.SubtaskDueDate}
										onChangeText={(text) =>
											updateSubTask(index, "SubtaskDueDate", text)
										}
										editable={false} // Assuming you'll implement a date picker here
									/>
									<Icon name="calendar" size={20} color="white" />
								</TouchableOpacity>

								<TouchableOpacity onPress={() => removeSubtask(index)}>
									<Icon name="trash" size={20} color="red" />
								</TouchableOpacity>
							</View>
						))}

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

						<Text style={styles.label}>Attachments</Text>
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
						</ScrollView>
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
				>
					<Text style={{ color: "#1c1c1c", fontSize: 16, fontWeight: "bold" }}>
						Create Task
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
		paddingRight: 30, // to ensure the text is never behind the icon
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
		paddingRight: 30, // to ensure the text is never behind the icon
		marginBottom: 20,
	},
});
