import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function StatsChart({ data }) {
  const chartData = [
    { name: "Easy", value: data.combined.easy },
    { name: "Medium", value: data.combined.medium },
    { name: "Hard", value: data.combined.hard }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StatsChart;