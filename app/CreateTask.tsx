"use client";

import React, { useState } from "react";
import { postToDoItem } from "@/lib/apiPostActions";
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

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

	return (
		<>
			<ScrollView style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
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

				<View style={{ paddingHorizontal: 20 }}>
					<Text style={styles.label}>Task Name</Text>
					<TextInput
						style={styles.input}
						placeholder="Task Name"
						placeholderTextColor="#777"
						value={taskName}
						onChangeText={setTaskName}
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
					>
						<TextInput
							style={styles.input}
							placeholder="August 12, 2023"
							placeholderTextColor="#777"
							value={startDate}
							onChangeText={setStartDate}
							editable={false} // Assuming you'll implement a date picker here
						/>
						<Icon name="calendar" size={20} color="white" />
					</TouchableOpacity>

					<Text style={styles.label}>End Date</Text>
					<TouchableOpacity
						style={{
							flexDirection: "row",
							alignItems: "center",
							backgroundColor: "#2c2c2c",
							borderRadius: 10,
							marginBottom: 20,
							paddingHorizontal: 15,
						}}
					>
						<TextInput
							style={styles.input}
							placeholder="August 25, 2023"
							placeholderTextColor="#777"
							value={endDate}
							onChangeText={setEndDate}
							editable={false} // Assuming you'll implement a date picker here
						/>
						<Icon name="calendar" size={20} color="white" />
					</TouchableOpacity>

					<Text style={styles.label}>Description</Text>
					<TextInput
						style={[styles.input, { height: 80, textAlignVertical: "top" }]}
						placeholder="Hey guys! 👋\nMake wireframe first & complete this task asap! Send me update daily!"
						placeholderTextColor="#777"
						multiline={true}
						value={description}
						onChangeText={setDescription}
					/>

					<Text style={styles.label}>Attachments</Text>
					<ScrollView
						horizontal={true}
						style={{ flexDirection: "row", marginBottom: 20 }}
					>
						{/* {[1, 2, 3].map((_, index) => (
							<Image
								key={index}
								source={{ uri: "https://placekitten.com/100/100" }} // Replace with actual attachments
								style={{
									width: 60,
									height: 60,
									borderRadius: 10,
									marginRight: 10,
								}}
							/>
						))} */}
						<TouchableOpacity
							style={{
								width: 60,
								height: 60,
								borderRadius: 10,
								backgroundColor: "#2c2c2c",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Icon name="plus" size={20} color="white" />
						</TouchableOpacity>
					</ScrollView>

					<TouchableOpacity
						style={{
							backgroundColor: "#f2e29b",
							paddingVertical: 15,
							borderRadius: 10,
							alignItems: "center",
						}}
					>
						<Text
							style={{ color: "#1c1c1c", fontSize: 16, fontWeight: "bold" }}
						>
							Create Task
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
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
