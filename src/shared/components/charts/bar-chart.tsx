// BarChartCard.tsx
import React from "react";
import "./bar-chart.scss"; // Keep the styles for the bar chart
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Sample data for the bar chart
const data = [
  { program: "Marvs Digital", students: 10 },
  { program: "Skyride", students: 8 },
  { program: "BISU", students: 5 },
];

const BarChartCard: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="program" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="students" fill="rgb(184, 84, 84)" barSize={90} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartCard;
