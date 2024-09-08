import TaskCards from "@/components/TaskListComponents/TaskCards";
import { UserDetails, fetchUserDetails } from "@/lib/auth";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
	ScrollView,
	View,
	TouchableOpacity,
	Alert,
	StyleSheet,
	Text,
	Platform,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function UserTaskProfile() {
	const navigation = useNavigation();
	const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

	useEffect(() => {
		const getUserDetails = async () => {
			const details = await fetchUserDetails();
			if (details) {
				setUserDetails(details);
			}
		};

		getUserDetails();
	}, []);

	return (
		<View style={{ flexGrow: 1, backgroundColor: "#1c1c1c" }}>
			{/* Profile Header */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					paddingVertical: 20,
					paddingHorizontal: 20,
					paddingTop: Platform.OS === "ios" ? 50 : 45,
					zIndex: 10,
				}}
			>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Icon name="arrow-left" size={20} color="white" />
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
						Profile
					</Text>
				</View>
				<Icon
					name="ellipsis-v"
					size={20}
					color="#FFFFFF"
					onPress={() => {
						console.log("hello");
					}}
				/>
			</View>

			<ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
				<View style={{ alignItems: "center", marginBottom: 20, marginTop: 20 }}>
					<Text
						style={{
							color: "#fff",
							fontSize: 56,
							textAlign: "center",
							width: 130,
							height: 130,
							borderRadius: 200,
							borderWidth: 5,
							borderColor: "#fff",
							lineHeight: 120,
						}}
					>
						{userDetails?.firstName.charAt(0)}
					</Text>
				</View>

				{/* Action Grid */}
				{/* <View style={styles.grid}>
				<ActionIcon name="bookmark" label="Bookmarks" />
				<ActionIcon name="image" label="Images" />
				<ActionIcon name="file-text" label="Notes" />
				<ActionIcon name="pencil" label="Highlights" />
				<ActionIcon name="users" label="Friends" />
				<ActionIcon name="trophy" label="Badges" />
				<ActionIcon name="hand-paper-o" label="Pray" />
				<ActionIcon name="history" label="History" />
			</View> */}

				{/* Highlight Section */}
				<View style={styles.highlightSection}>
					<TaskCards />
					{/* <View style={styles.highlightHeader}>
					<Text style={styles.highlightName}>Michael S</Text>
					<Text style={styles.timeText}>2h ago</Text>
				</View>

				<View style={styles.highlightContent}>
					<Text style={styles.highlightText}>
						My brethren, have not the faith of our Lord Jesus Christ, the Lord
						of glory, with respect of persons...
					</Text>
					<Text style={styles.bibleVerse}>James 2:1 KJV</Text>
				</View> */}

					{/* <View style={styles.highlightFooter}>
					<TouchableOpacity>
						<Icon name="heart" size={20} color="#888" />
					</TouchableOpacity>
					<TouchableOpacity>
						<Icon name="comment" size={20} color="#888" />
					</TouchableOpacity>
				</View> */}
				</View>
			</ScrollView>
		</View>
	);
}

const ActionIcon = ({ name, label }: { name: string; label: string }) => (
	<TouchableOpacity style={styles.gridItem}>
		<Icon name={name} size={25} color="white" />
		<Text style={styles.gridText}>{label}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 30,
	},
	backIcon: {
		marginRight: 20,
	},
	profileInfo: {
		flex: 1,
		alignItems: "center",
	},
	profileName: {
		fontSize: 22,
		fontWeight: "bold",
		color: "white",
	},
	profileStats: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 5,
	},
	statText: {
		fontSize: 18,
		color: "white",
		marginLeft: 5,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
		marginBottom: 30,
	},
	gridItem: {
		width: "45%",
		backgroundColor: "#1c1c1c",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 20,
	},
	gridText: {
		marginTop: 10,
		fontSize: 14,
		color: "white",
	},
	highlightSection: {
		backgroundColor: "#1c1c1c",
		borderRadius: 10,
		padding: 20,
	},
	highlightHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	highlightName: {
		color: "white",
		fontSize: 16,
	},
	timeText: {
		color: "#888",
		fontSize: 12,
	},
	highlightContent: {
		marginTop: 10,
	},
	highlightText: {
		color: "white",
		fontSize: 16,
	},
	bibleVerse: {
		color: "#888",
		fontSize: 14,
		marginTop: 10,
	},
	highlightFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
});
