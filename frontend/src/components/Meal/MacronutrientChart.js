import React, { useEffect } from "react";
import Chart from "chart.js/auto";

const MacronutrientChart = ({ data }) => {
	useEffect(() => {
		// Calculate the sum of data values
		const sumOfData = data.datasets.reduce((acc, dataset) => {
			return (
				acc +
				dataset.data.reduce(
					(datasetSum, value) => datasetSum + value,
					0
				)
			);
		}, 0);

		// Check if the sum of data values is greater than 0
		if (sumOfData > 0) {
			// Create a pie chart when the component mounts
			const ctx = document
				.getElementById("macronutrientChart")
				.getContext("2d");
			const macronutrientChart = new Chart(ctx, {
				type: "doughnut",
				data: data,
				options: {
					// Additional options for customization
					// For example, you can add a title, legend, etc.
				},
			});

			// Cleanup chart on component unmount
			return () => {
				macronutrientChart.destroy();
			};
		} else {
			// Render a default chart (e.g., a gray circle) when the sum of data values is 0
			const ctx = document
				.getElementById("macronutrientChart")
				.getContext("2d");
			const defaultChart = new Chart(ctx, {
				type: "doughnut", // You can use 'doughnut' for a gray circle
				data: {
					labels: ["Empty Chart"],
					datasets: [
						{
							data: [100],
							backgroundColor: ["lightgray"],
						},
					],
				},
				options: {
					// Additional options for customization
					// For example, you can add a title, legend, etc.
				},
			});

			// Cleanup default chart on component unmount
			return () => {
				defaultChart.destroy();
			};
		}
	}, [data]);

	return <canvas id="macronutrientChart" width="400" height="400"></canvas>;
};

export default MacronutrientChart;
