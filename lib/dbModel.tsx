"use client";
// setx /M REACT_NATIVE_PACKAGER_HOSTNAME your_ip_address
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import Constants from "expo-constants";

interface SubTask {
	subTaskId: number;
	subTaskName: string;
	subtaskDescription: string;
	subtaskDueDate: string;
	subtaskIsCompleted: boolean;
	taskId: number;
	task?: any;
}

interface Attachment {
	attachmentId: number;
	attachmentPath: string;
	attachmentType: string;
	taskId: number;
	attachmentName: string;
}

interface Recurrence {
	recurrenceId: number;
	interval: string;
	taskId: number;
}

interface ToDoItem {
	taskId: number;
	taskName: string;
	taskDescription: string;
	dateCreated: string; // Use Date if you prefer working with Date objects
	dueDate: string; // Use Date if you prefer working with Date objects
	priority: string;
	isCompleted: boolean;
	subtasks: SubTask[];
	recurrence?: Recurrence | null;
	attachments: Attachment[];
	categoryId: number;
	categoryName: string;
	userId: string;
}

export interface ToDoItemsResponse {
	$id: string;
	$values: ToDoItem[];
}

export interface IsCompletedToDoResponse {
	$id: string;
	count: number;
	items: {
		$id: string;
		$values: ToDoItem[];
	};
}

const ip = Constants.expoConfig?.extra?.apiHost || "http://localhost:5133";

// TO DO ITEMS ===================================================================
// GET ALL TASKS
export const getToDoItems = async () => {
	const token = await AsyncStorage.getItem("token");

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(`http://${ip}:5133/api/todoitems`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			const data: ToDoItemsResponse = await response.json();
			// console.log(data);
			return data;
		} else {
			Alert.alert("Error", "Failed to fetch tasks");
			return null;
		}
	} catch (error: any) {
		console.error("There was an error fetching task: ", error.message);
		return null;
	}
};

// GET ALL TASKS BY ID
export const getToDoItemById = async (id: number) => {
	const token = await AsyncStorage.getItem("token");
	if (!token) {
		throw new Error("No token found");
	}
	try {
		const response = await fetch(`http://${ip}:5133/api/todoitems/${id}`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
		if (response.ok) {
			const data: ToDoItem = await response.json();
			console.log("Task Item: ", data);
			return data;
		} else {
			Alert.alert("Error", "Failed to fetch tasks");
			return null;
		}
	} catch (error: any) {
		console.error("There was an error fetching task: ", error.message);
		return null;
	}
};

// GET ALL TASK BY IS-COMPLETED (FALSE)
export const getInProgressTasks = async () => {
	const token = await AsyncStorage.getItem("token");
	// const ip = getLocalHost;

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(
			`http://${ip}:5133/api/todoitems/in-progress`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);

		if (response.ok) {
			const data: IsCompletedToDoResponse = await response.json();
			// console.log(data);
			return data;
		} else {
			Alert.alert("Error", "Failed to fetch tasks");
			return null;
		}
	} catch (error: any) {
		console.error("There was an error fetching task: ", error.message);
		return null;
	}
};

// GET ALL TASK BY IS-COMPLETED (TRUE)
export const getCompletedTasks = async () => {
	const token = await AsyncStorage.getItem("token");
	// const ip = getLocalHost;

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(`http://${ip}:5133/api/todoitems/completed`, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			const data: IsCompletedToDoResponse = await response.json();
			// console.log(data);
			return data;
		} else {
			Alert.alert("Error", "Failed to fetch tasks");
			return null;
		}
	} catch (error: any) {
		console.error("There was an error fetching task: ", error.message);
		return null;
	}
};

// ========================================================

// CATEGORIES =====================================================
// GET ALL CATEGORIES
export const getCategories = async () => {
	try {
		const response = await fetch(`http://${ip}:5133/api/categories`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (response.ok) {
			const data = await response.json();
			console.log(data);
			return data;
		} else {
			Alert.alert("Error", "Failed to fetch categories");
			return null;
		}
	} catch (error: any) {
		console.error("There was an error fetching categories: ", error.message);
		return null;
	}
};
