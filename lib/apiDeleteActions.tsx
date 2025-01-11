"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import Toast from "react-native-toast-message";
// import React, { useState, useEffect } from "react";

// sourcery skip: remove-redundant-boolean
const ip = Constants.expoConfig?.extra?.apiHost || "http://localhost:5133";

export const deleteToDoItem = async (taskId: string) => {
	const token = await AsyncStorage.getItem("token");
	if (!token) {
		throw new Error("No token found");
	}
	try {
		const response = await fetch(`http://${ip}:5133/api/todoitems/${taskId}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (response.status === 204) {
			console.log("Item deleted successfully.");
		} else if (response.status === 404) {
			console.log("Item not found.");
		} else {
			console.error("Failed to delete item.");
		}
	} catch (error: any) {}
};

export const deleteSubTask = async (subtaskId: number | string) => {
	const token = await AsyncStorage.getItem("token");

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(
			`http://${ip}:5133/api/subtasks/${subtaskId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.status === 204) {
			console.log("Subtask deleted successfully.");
		} else if (response.status === 404) {
			console.log("Subtask not found.");
		} else {
			console.error("Failed to delete subtask.");
		}
	} catch (error: any) {
		console.error("Error deleting subtask:", error);
	}
};

// USER DELETE OPERATIONS
export const deleteUser = async () => {
	const token = await AsyncStorage.getItem("token");

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(
			`http://${ip}:5133/api/UserAccount/delete-user`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.ok) {
			Toast.show({
				type: "success",
				text1: "Delete Successful",
				text2: "Your profile has been deleted successfully.",
			});
		} else {
			const errorMessage = `Failed to delete user: ${response.statusText}`;
			Toast.show({
				type: "error",
				text1: "Delete Failed",
				text2: errorMessage,
			});
			throw new Error(errorMessage);
		}
	} catch (error: any) {
		console.error("Error deleting user:", error.message);
		throw new Error("Failed to delete the user. Please try again.");
	}
};
