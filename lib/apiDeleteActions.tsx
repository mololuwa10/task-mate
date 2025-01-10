"use client";

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
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
