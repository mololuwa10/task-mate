import {
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from "react-native";

type TaskStatusHeaderProps = {
	label: string;
	count: number;
	isActive: boolean;
	onPress: (label: string) => void;
};

export default function TaskStatusHeader({
	label,
	count,
	isActive,
	onPress,
}: TaskStatusHeaderProps) {
	return (
		<>
			<TouchableOpacity
				style={[
					styles.pillContainer,
					{
						backgroundColor: isActive ? "#303030" : "#fff",
						// borderColor: isActive ? "#000" : "#ccc",
					},
				]}
				activeOpacity={0.7}
				accessibilityLabel={`Filter by ${label}, ${count} tasks available`}
				accessible={true}
				onPress={() => onPress(label)}
			>
				<Text style={[styles.label, { color: isActive ? "#fff" : "#000" }]}>
					{label}
				</Text>
				<View
					style={[
						styles.countContainer,
						{ backgroundColor: isActive ? "#7FD18C" : "#ccc" },
					]}
				>
					<Text style={[styles.count, { color: isActive ? "#fff" : "#000" }]}>
						{count}
					</Text>
				</View>
			</TouchableOpacity>
		</>
	);
}

const styles = StyleSheet.create({
	pillContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 25,
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderWidth: 1,
		marginRight: 10,
		width: 170,
	},
	label: {
		fontSize: 14,
		fontWeight: "bold",
	},
	countContainer: {
		marginLeft: 10,
		borderRadius: 20,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	count: {
		fontSize: 14,
		fontWeight: "bold",
	},
});
