import { getToDoItemById } from "@/lib/dbModel";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	ScrollView,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
	Platform,
	ActivityIndicator,
	Image, // Add this import statement
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Constants from "expo-constants";
import { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
	TaskList: undefined;
	IndividualTaskPage: { taskId: number };
};

type IndividualTaskPageRouteProp = RouteProp<
	RootStackParamList,
	"IndividualTaskPage"
> & { taskId: number };

const SubTask = ({
	title,
	isCompleted,
	onToggle,
}: {
	title: string;
	isCompleted: boolean;
	onToggle: () => void;
}) => {
	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				marginBottom: 15,
				borderRadius: 10,
				borderWidth: 1,
				padding: 20,
				borderColor: "#FFFFFF",
			}}
		>
			<TouchableOpacity onPress={onToggle} style={{ marginRight: 10 }}>
				<Ionicons
					name={isCompleted ? "checkmark-circle" : "ellipse-outline"}
					size={25}
					color={isCompleted ? "#4CAF50" : "#B0B0B0"}
				/>
			</TouchableOpacity>
			<Text
				style={[styles.subtaskText, isCompleted && styles.subtaskCompleted]}
			>
				{title}
			</Text>
		</View>
	);
};

export default function IndividualTaskPage() {
	const route = useRoute();
	const { taskId } = (route.params as IndividualTaskPageRouteProp) || {};
	const navigation = useNavigation<StackNavigationProp<any>>();
	const [task, setTask] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		const fetchTask = async () => {
			setLoading(true);
			try {
				const fetchedTask = await getToDoItemById(taskId);
				if (fetchedTask) {
					console.log("Fetched Task:", fetchedTask.subtasks);
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

	if (loading) {
		return (
			<View>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	if (error) {
		return (
			<View>
				<Text>{error}</Text>
			</View>
		);
	}

	if (!task) {
		return (
			<View>
				<Text>No task data available</Text>
			</View>
		);
	}

	const descriptionLimit = 15; // Set a limit for words
	const descriptionWords = task.taskDescription.split(" ");
	const isDescriptionLong = descriptionWords.length > descriptionLimit;
	const shortDescription =
		descriptionWords.slice(0, descriptionLimit).join(" ") +
		(isDescriptionLong ? "..." : "");

	const attachments = task.attachments?.$values || [];
	const ip = Constants.expoConfig?.extra?.apiHost || "http://localhost:5133";
	const baseUrl = `http://${ip}:5133/`;

	// Extract subtasks from the fetched task
	const subtasks = task.subtasks?.$values || [];

	return (
		<>
			<View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						paddingVertical: 20,
						justifyContent: "space-between",
						paddingHorizontal: 20,
						paddingTop: Platform.OS === "ios" ? 50 : 45,
						zIndex: 10,
					}}
				>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<Icon name="arrow-left" size={20} color="white" />
					</TouchableOpacity>
					<Text style={{ color: "white", alignItems: "center", fontSize: 20 }}>
						Task Details
					</Text>
					<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
						<TouchableOpacity>
							<Ionicons
								name="share-social-outline"
								size={25}
								color={"#FFFFFF"}
								style={{
									color: "#fff",
									textAlign: "center",
									width: 50,
								}}
							/>
						</TouchableOpacity>

						<Ionicons
							name="pencil-outline"
							size={25}
							color="#FFFFFF"
							onPress={() => {
								navigation.navigate("EditTask", { taskId: taskId });
							}}
						/>
					</View>
				</View>

				<View
					style={{
						paddingStart: 20,
						paddingHorizontal: 20,
						paddingBottom: 30,
						// marginTop: -150,
					}}
				>
					<Text
						style={{
							color: "white",
							fontSize: 14,
							fontWeight: "300",
							marginBottom: 10,
						}}
					>
						Task Title
					</Text>
					<Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
						{task.taskName}
					</Text>

					<View
						style={{
							flexDirection: "row",
							marginTop: 20,
							gap: 100,
						}}
					>
						<Text style={{ color: "white", fontSize: 14, fontWeight: "300" }}>
							Start Date:
						</Text>
						<Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
							{moment(task.dateCreated).format("MMMM D, YYYY")}
						</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							marginTop: 20,
							gap: 107,
						}}
					>
						<Text style={{ color: "white", fontSize: 14, fontWeight: "300" }}>
							Due Date:
						</Text>
						<Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
							{moment(task.dueDate).format("MMMM D, YYYY")}
						</Text>
					</View>

					<View
						style={{
							flexDirection: "row",
							marginTop: 20,
							gap: 120,
						}}
					>
						<Text style={{ color: "white", fontSize: 14, fontWeight: "300" }}>
							Priority:
						</Text>
						<Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
							{task.priority}
						</Text>
					</View>
				</View>

				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						paddingHorizontal: 20,
						backgroundColor: "#303030",
					}}
				>
					<View style={{ marginTop: 20 }}>
						<Text
							style={{
								color: "white",
								fontSize: 14,
								fontWeight: "300",
								marginBottom: 10,
							}}
						>
							Task Description
						</Text>
						<Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
							{expanded ? task.taskDescription : shortDescription}
						</Text>
						{isDescriptionLong && (
							<TouchableOpacity
								onPress={() => setExpanded(!expanded)}
								style={{ marginTop: 10 }}
							>
								<Text style={{ color: "#1e90ff", fontSize: 16 }}>
									{expanded ? "See Less" : "See More"}
								</Text>
							</TouchableOpacity>
						)}
					</View>

					{/* Attachments Section */}
					<View style={{ marginTop: 30 }}>
						<Text
							style={{
								color: "white",
								fontSize: 16,
								fontWeight: "bold",
								marginBottom: 20,
							}}
						>
							Attachments
						</Text>
						<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
							<TouchableOpacity
								style={{
									width: 50,
									height: 50,
									backgroundColor: "#303030",
									borderRadius: 10,
									borderWidth: 1,
									borderColor: "#FFFFFF",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Ionicons name="add-outline" size={30} color="white" />
							</TouchableOpacity>

							{attachments.length > 0 ? (
								attachments.map(
									(attachment: any, index: number) => (
										console.log(`${baseUrl}${attachment.attachmentPath}`),
										(
											<View
												key={index}
												style={{
													width: 50,
													height: 50,
													marginRight: 10,
													marginBottom: 10,
													borderRadius: 10,
													borderWidth: 1,
													borderColor: "#FFFFFF",
													overflow: "hidden",
												}}
											>
												<Image
													source={{
														uri: `${baseUrl}${attachment.attachmentPath}`,
													}}
													// style={{ width: "100%", height: "100%" }}
												/>
											</View>
										)
									)
								)
							) : (
								<Text
									style={{ color: "white", fontSize: 14, fontStyle: "italic" }}
								>
									No attachments
								</Text>
							)}
						</View>
					</View>

					{/* Subtasks */}
					<View
						style={{
							marginTop: 30,
							marginBottom: 20,
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
						<Text
							style={{
								fontSize: 18,
								fontWeight: "bold",
								color: "white",
								marginTop: -4,
							}}
						>
							Subtasks
						</Text>

						<TouchableOpacity>
							<Text
								style={{ color: "#f2e29b" }}
								onPress={() =>
									navigation.navigate("EditSubTask", { taskId: taskId })
								}
							>
								Edit/Add Subtask
							</Text>
						</TouchableOpacity>
					</View>

					{subtasks.map((subtask: any, index: any) => (
						<SubTask
							key={index}
							title={subtask.subTaskName}
							isCompleted={subtask.subtaskIsCompleted}
							onToggle={() => {
								// Handle subtask completion toggle logic here
							}}
						/>
					))}
				</ScrollView>
			</View>
		</>
	);
}

// {
// 	// uri: `${baseUrl}${attachment.attachmentPath}`,
// }
const styles = StyleSheet.create({
	subtaskText: {
		fontSize: 16,
		color: "white",
	},
	subtaskCompleted: {
		textDecorationLine: "line-through",
		color: "#999",
	},
});
