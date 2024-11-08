"use client";

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getLocalHost from "react-native-localhost";
import { NetworkInfo } from "react-native-network-info";
import Constants from "expo-constants";

export interface SubTask {
	subTaskId: string | number;
	subTaskName: string;
	subtaskDescription: string;
	subtaskDueDate: string;
	subtaskIsCompleted: boolean;
}

export interface Recurrence {
	Interval: string;
}

export interface CreateToDoItemsDTO {
	TaskName: string;
	TaskDescription: string;
	DateCreated?: string;
	DueDate?: string;
	Priority: string;
	CategoryId?: number;
	CategoryName?: string;
	Subtasks?: CreateSubTaskDTO[];
	Recurrence?: Recurrence;
}

export interface CreateSubTaskDTO {
	SubTaskName: string;
	SubtaskDescription: string;
	DueDate: string;
	// SubtaskIsCompleted: boolean;
}

export const ip =
	Constants.expoConfig?.extra?.apiHost || "http://localhost:5133";

// TASK ==============================================================
export const postToDoItem = async (
	toDoItem: CreateToDoItemsDTO,
	attachments: File[]
) => {
	const token = await AsyncStorage.getItem("token");

	if (!token) {
		throw new Error("No token found");
	}

	const formData = new FormData();

	formData.append("ToDoItem", JSON.stringify(toDoItem));

	// Adding attachments
	attachments.forEach((attachment) => {
		formData.append("attachments", attachment);
	});

	try {
		const response = await fetch(`http://${ip}:5133/api/todoitems`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${token}`,
			},
			body: formData,
		});

		if (response.ok) {
			const data = await response.json();
			console.log("Task Created Successfully: ", data);
			return data;
		} else {
			const errorText = await response.text();
			console.error("Error creating task: ", errorText);
			return null;
		}
	} catch (error: any) {
		console.error("Error creating task: ", error.message);
		return null;
	}
};

// =====================================================================

// SUBTASK ==============================================================
// Create SubTask
export const postSubTask = async (subTaskData: any, taskId: number) => {
	const token = await AsyncStorage.getItem("token");

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(`http://${ip}:5133/api/subtasks`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				...subTaskData,
				taskId: taskId,
			}),
		});
		// Check if the response is not ok
		if (!response.ok) {
			const errorText = await response.text();
			console.error("Failed to create subtask", errorText);
			throw new Error("Failed to create subtask");
		}

		const jsonResponse = await response.json();
		console.log("Subtask created successfully", jsonResponse);
		return jsonResponse;
	} catch (error: any) {
		console.error("Error creating subtask: ", error.message);
		return null;
	}
};
