import { View, Text, Dimensions, TouchableOpacity, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { Icon } from "react-native-elements";

import {
	getInProgressTasks,
	getCompletedTasks,
	IsCompletedToDoResponse,
} from "@/lib/dbModel";

const screenWidth = Dimensions.get("window").width;

export default function ProjectSummary() {
	const [inProgressCount, setInProgressCount] = useState<number>(0);
	const [completedCount, setCompletedCount] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchTasks = async () => {
			try {
				const inProgressTasksResponse = await getInProgressTasks();
				const completedTasksResponse = await getCompletedTasks();

				if (inProgressTasksResponse && completedTasksResponse) {
					setInProgressCount(inProgressTasksResponse.count);
					setCompletedCount(completedTasksResponse.count);
				}
			} catch (error: any) {
				console.error("Error fetching tasks: ", error.message);
				// Alert.alert("Error", "Failed to fetch tasks");
			} finally {
				setIsLoading(false);
			}
		};

		fetchTasks();
	}, []);

	return (
		<>
			<View style={{ marginBottom: 20 }}>
				<Text
					style={{
						fontSize: 18,
						fontWeight: "bold",
						marginBottom: 10,
						color: "#FFFFFF",
					}}
				>
					Project Summary
				</Text>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 5,
					}}
				>
					<TouchableOpacity
						style={{
							// backgroundColor: "#000000",
							backgroundColor: "#f2e29b",
							borderRadius: 10,
							padding: 20,
							marginRight: 15,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.1,
							shadowRadius: 5,
							elevation: 5,
							flex: 1,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View style={{ flexGrow: 1, justifyContent: "center" }}>
							<Text
								style={{ fontSize: 25, fontWeight: "bold", color: "black" }}
							>
								{isLoading ? "Loading..." : inProgressCount}
							</Text>
							<Text style={{ fontSize: 15, fontWeight: "300", color: "black" }}>
								In Progress
							</Text>
						</View>

						<Icon name="arrow-right" size={22} color="black" />
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							backgroundColor: "#F8F8F8",
							borderRadius: 10,
							padding: 20,
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.1,
							shadowRadius: 5,
							elevation: 5,
							flex: 1,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 25, fontWeight: "bold" }}>
								{isLoading ? "Loading..." : completedCount}
							</Text>
							<Text style={{ fontSize: 15, fontWeight: "300" }}>Completed</Text>
						</View>
						<Icon name="arrow-right" size={22} color="black" />
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}
