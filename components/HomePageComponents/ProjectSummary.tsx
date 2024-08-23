import { View, Text, Dimensions, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import { Icon } from "react-native-elements";

const screenWidth = Dimensions.get("window").width;

export default function ProjectSummary() {
	return (
		<>
			<View style={{ marginBottom: 20 }}>
				<Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
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
							backgroundColor: "#000000",
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
								style={{ fontSize: 25, fontWeight: "bold", color: "white" }}
							>
								24
							</Text>
							<Text style={{ fontSize: 15, fontWeight: "300", color: "white" }}>
								In Progress
							</Text>
						</View>

						<Icon name="arrow-right" size={22} color="white" />
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
							<Text style={{ fontSize: 25, fontWeight: "bold" }}>24</Text>
							<Text style={{ fontSize: 15, fontWeight: "300" }}>Completed</Text>
						</View>
						<Icon name="arrow-right" size={22} color="black" />
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
}
