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
