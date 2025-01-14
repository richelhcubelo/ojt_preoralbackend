import React from "react";
import "./donut-chart.scss";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#f44336"];

const data = [
  { name: "BSCS", value: 25 },
  { name: "BSIT", value: 35 },
  { name: "BSF", value: 20 },
  { name: "BSED", value: 20 },
];

const DonutChartCard: React.FC = () => {
  return (
    <div className="donut-chart-card">
      <div className="donut-chart-card-label"></div>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChartCard;
