import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";

export default function TaskCards() {
	return (
		<>
			<TouchableOpacity
				style={{
					backgroundColor: "#303030",
					borderRadius: 15,
					padding: 21,
					marginRight: 15,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 5,
					elevation: 5,
					width: 350,
				}}
				// key={item.id}
			>
				<View>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<Text
							style={{
								color: "white",
								fontWeight: "bold",
								marginBottom: 10,
							}}
						>
							{/* {(item as { title: string }).title} */} Task Title
						</Text>
						<TouchableOpacity>
							<Icon name="ellipsis-h" size={20} color="#FFFFFF" />
						</TouchableOpacity>
					</View>

					<Text
						style={{
							color: "white",
							borderRadius: 50,
							backgroundColor: "#7FD18C",
							paddingVertical: 5,
							paddingHorizontal: 10,
							alignSelf: "flex-start",
						}}
					>
						{/* {(item as { priority: string }).priority} */} High
					</Text>

					<View style={{ marginTop: 10, flex: 1, flexDirection: "row" }}>
						<Ionicons name="time-outline" size={20} color="#adaaaa" />
						<Text style={{ color: "#adaaaa", marginLeft: 10 }}>
							{/* {(item as { time: string }).time} */} time
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 20,
					}}
				>
					<Text style={{ color: "white" }}> Due Date: August 25th, 2023</Text>
					<Icon name="user-circle" size={20} color="#FFFFFF" />
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					backgroundColor: "#303030",
					borderRadius: 15,
					marginTop: 10,

					padding: 21,
					marginRight: 15,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 5,
					elevation: 5,
					width: 350,
				}}
				// key={item.id}
			>
				<View>
					<Text
						style={{
							color: "white",
							borderRadius: 50,
							backgroundColor: "#7FD18C",
							paddingVertical: 5,
							paddingHorizontal: 10,
							alignSelf: "flex-start",
						}}
					>
						{/* {(item as { priority: string }).priority} */} High
					</Text>

					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							marginTop: 10,
						}}
					>
						{/* {(item as { title: string }).title} */} Task Title
					</Text>

					<View style={{ marginTop: 10, flex: 1, flexDirection: "row" }}>
						<Ionicons name="time-outline" size={20} color="#adaaaa" />
						<Text style={{ color: "#adaaaa", marginLeft: 10 }}>
							{/* {(item as { time: string }).time} */} time
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 20,
					}}
				>
					<Text style={{ color: "white" }}> Due Date: August 25th, 2023</Text>
					<Icon name="user-circle" size={20} color="#FFFFFF" />
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					backgroundColor: "#303030",
					borderRadius: 15,
					padding: 21,
					marginRight: 15,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 5,
					elevation: 5,
					width: 350,
					marginTop: 10,
				}}
				// key={item.id}
			>
				<View>
					<Text
						style={{
							color: "white",
							borderRadius: 50,
							backgroundColor: "#7FD18C",
							paddingVertical: 5,
							paddingHorizontal: 10,
							alignSelf: "flex-start",
						}}
					>
						{/* {(item as { priority: string }).priority} */} High
					</Text>

					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							marginTop: 10,
						}}
					>
						{/* {(item as { title: string }).title} */} Task Title
					</Text>

					<View style={{ marginTop: 10, flex: 1, flexDirection: "row" }}>
						<Ionicons name="time-outline" size={20} color="#adaaaa" />
						<Text style={{ color: "#adaaaa", marginLeft: 10 }}>
							{/* {(item as { time: string }).time} */} time
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 20,
					}}
				>
					<Text style={{ color: "white" }}> Due Date: August 25th, 2023</Text>
					<Icon name="user-circle" size={20} color="#FFFFFF" />
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					backgroundColor: "#303030",
					borderRadius: 15,
					padding: 21,
					marginRight: 15,
					marginTop: 10,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 5,
					elevation: 5,
					width: 350,
				}}
				// key={item.id}
			>
				<View>
					<Text
						style={{
							color: "white",
							borderRadius: 50,
							backgroundColor: "#7FD18C",
							paddingVertical: 5,
							paddingHorizontal: 10,
							alignSelf: "flex-start",
						}}
					>
						{/* {(item as { priority: string }).priority} */} High
					</Text>

					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							marginTop: 10,
						}}
					>
						{/* {(item as { title: string }).title} */} Task Title
					</Text>

					<View style={{ marginTop: 10, flex: 1, flexDirection: "row" }}>
						<Ionicons name="time-outline" size={20} color="#adaaaa" />
						<Text style={{ color: "#adaaaa", marginLeft: 10 }}>
							{/* {(item as { time: string }).time} */} time
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 20,
					}}
				>
					<Text style={{ color: "white" }}> Due Date: August 25th, 2023</Text>
					<Icon name="user-circle" size={20} color="#FFFFFF" />
				</View>
			</TouchableOpacity>

			<TouchableOpacity
				style={{
					backgroundColor: "#303030",
					borderRadius: 15,
					padding: 21,
					marginRight: 15,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 5,
					elevation: 5,
					width: 350,
					marginTop: 10,
				}}
				// key={item.id}
			>
				<View>
					<Text
						style={{
							color: "white",
							borderRadius: 50,
							backgroundColor: "#7FD18C",
							paddingVertical: 5,
							paddingHorizontal: 10,
							alignSelf: "flex-start",
						}}
					>
						{/* {(item as { priority: string }).priority} */} High
					</Text>

					<Text
						style={{
							color: "white",
							fontWeight: "bold",
							marginTop: 10,
						}}
					>
						{/* {(item as { title: string }).title} */} Task Title
					</Text>

					<View style={{ marginTop: 10, flex: 1, flexDirection: "row" }}>
						<Ionicons name="time-outline" size={20} color="#adaaaa" />
						<Text style={{ color: "#adaaaa", marginLeft: 10 }}>
							{/* {(item as { time: string }).time} */} time
						</Text>
					</View>
				</View>

				<View
					style={{
						flex: 1,
						flexDirection: "row",
						justifyContent: "space-between",
						marginTop: 20,
					}}
				>
					<Text style={{ color: "white" }}> Due Date: August 25th, 2023</Text>
					<Icon name="user-circle" size={20} color="#FFFFFF" />
				</View>
			</TouchableOpacity>
		</>
	);
}
