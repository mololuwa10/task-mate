import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	StyleSheet,
} from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import moment from "moment";
import { getToDoItems } from "@/lib/dbModel";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function TaskProgressCards() {
	const { width } = Dimensions.get("window");

	const [taskData, setTaskData] = useState({
		totalTasks: 0,
		completedTasks: 0,
	});

	// Fetch tasks for the current day
	const fetchTodayTasks = async () => {
		try {
			const response = await getToDoItems();
			if (response && response.$values) {
				const today = moment().startOf("day");
				console.log("Today date:", today.format());

				// Filter tasks for the current day
				const todayTasks = response.$values.filter((task) => {
					const taskDate = moment(task.dateCreated).startOf("day");
					return taskDate.isSame(today, "day");
				});

				const totalTasks = todayTasks.length;
				const completedTasks = todayTasks.filter(
					(task) => task.isCompleted
				).length;

				// Set the task data for the progress bar
				setTaskData({
					totalTasks,
					completedTasks,
				});
			}
		} catch (error) {
			console.error("Error fetching today's tasks:", error);
		}
	};

	useFocusEffect(
		useCallback(() => {
			let isMounted = true;
			fetchTodayTasks();

			// Cleanup function when screen is unfocused
			return () => {
				isMounted = false;
			};
		}, [])
	);

	// Fetch tasks on initial load
	// useEffect(() => {
	// 	fetchTodayTasks();
	// }, []);

	// Calculate progress percentage
	const progressPercentage =
		taskData.totalTasks === 0
			? 0
			: Math.round((taskData.completedTasks / taskData.totalTasks) * 100);

	return (
		<>
			<Text
				style={{
					fontSize: 18,
					fontWeight: "bold",
					marginBottom: 10,
					color: "white",
				}}
			>
				Today's Progress
			</Text>
			<View style={[styles.card, { width: width * 0.9 }]}>
				<View style={{ flex: 1 }}>
					<Text style={{ fontSize: 15, fontWeight: "500", color: "white" }}>
						Your today's tasks
					</Text>

					<TouchableOpacity
						style={{
							marginTop: 15,
							backgroundColor: "#3b3b3b",
							paddingVertical: 10,
							borderRadius: 5,
							width: 100,
							padding: 10,
						}}
					>
						<Text
							style={{ color: "#ffffff", fontSize: 14, fontWeight: "bold" }}
						>
							View tasks
						</Text>
					</TouchableOpacity>
				</View>

				<View style={{ alignItems: "center", justifyContent: "center" }}>
					<CircularProgress
						value={progressPercentage}
						radius={40}
						valueSuffix={"%"}
						activeStrokeColor={"#f2e29b"}
						inActiveStrokeColor={"#f0f0f0"}
						inActiveStrokeOpacity={0.5}
						inActiveStrokeWidth={8}
						activeStrokeWidth={8}
					/>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	card: {
		flexDirection: "row",
		padding: 15,
		backgroundColor: "#303030",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
		elevation: 5,
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
});
