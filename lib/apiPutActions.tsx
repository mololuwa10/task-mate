"use client";

import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getLocalHost from "react-native-localhost";
import { NetworkInfo } from "react-native-network-info";
import Constants from "expo-constants";

export interface SubTask {
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
	DueDate?: string;
	Priority: string;
	CategoryId?: number;
	CategoryName?: string;
	Subtasks?: SubTask[];
	Recurrence?: Recurrence;
}

const ip = Constants.expoConfig?.extra?.apiHost || "http://localhost:5133";

// Update SubTask
export const updateSubTask = async (subTask: SubTask, subTaskId: number) => {
	const token = await AsyncStorage.getItem("token");

	if (!token) {
		throw new Error("No token found");
	}

	try {
		const response = await fetch(
			`http://${ip}:5133/api/subtasks/${subTaskId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subTask),
			}
		);

		if (response.ok) {
			const data = await response.json();
			console.log("SubTask Updated Successfully: ", data);
			return data;
		} else {
			const errorText = await response.text();
			console.error("Error updating subtask: ", errorText);
			return null;
		}
	} catch (error: any) {
		console.error("Error updating subtask: ", error.message);
		return null;
	}
};
