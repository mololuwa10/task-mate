import React, { useState, useEffect } from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, Text, View, StyleSheet } from "react-native";

const screenWidth = Dimensions.get("window").width;

export default function ProductivitySection() {
	// Data for the chart
	const data = {
		labels: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		datasets: [
			{
				data: [2, 6, 7, 5, 10, 3, 4],
				color: (opacity = 1) => `rgba(26, 188, 156, ${opacity})`, // Completed tasks
			},
			{
				data: [3, 8, 7, 6, 12, 5, 5],
				color: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`, // Planned tasks
			},
		],
		barColors: ["#1ABC9C", "#E0E0E0"],
	};
	return (
		<>
			<View style={{ marginBottom: 20 }}>
				<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
					Productivity
				</Text>

				<View
					style={{
						backgroundColor: "#F8F8F8",
						borderRadius: 10,
						padding: 20,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 5,
						elevation: 5,
					}}
				>
					<View
						style={{
							alignItems: "flex-start",
							marginBottom: 10,
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
							Overall
						</Text>
						<Text
							style={{
								fontSize: 32,
								fontWeight: "bold",
								marginLeft: 10,
								color: "#000",
							}}
						>
							39
						</Text>
					</View>

					<BarChart
						yAxisSuffix=""
						data={data}
						width={screenWidth - 60}
						height={220}
						yAxisLabel=""
						chartConfig={{
							backgroundColor: "#FFFFFF",
							backgroundGradientFrom: "#FFFFFF",
							backgroundGradientTo: "#FFFFFF",
							decimalPlaces: 0,
							color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
							labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
							style: {
								borderRadius: 16,
							},
							propsForBackgroundLines: {
								strokeWidth: 0,
							},
						}}
						style={{
							marginVertical: 8,
							borderRadius: 16,
						}}
						showBarTops={false}
						showValuesOnTopOfBars={false}
					/>

					<View style={styles.legendContainer}>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: "#E0E0E0" }]}
							/>
							<Text style={styles.legendText}>Planned</Text>
						</View>
						<View style={styles.legendItem}>
							<View
								style={[styles.legendColor, { backgroundColor: "#1ABC9C" }]}
							/>
							<Text style={styles.legendText}>Completed</Text>
						</View>
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	legendContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 10,
	},
	legendItem: {
		flexDirection: "row",
		alignItems: "center",
	},
	legendColor: {
		width: 12,
		height: 12,
		borderRadius: 3,
		marginRight: 5,
	},
	legendText: {
		fontSize: 14,
		color: "#888",
	},
});
