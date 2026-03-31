import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, BarChart, Bar, Cell
} from "recharts";

export default function ChartComponent({ data, campaign }) {

  const chartData = [
    { name: "Mon", clicks: data.clicks * 0.2 },
    { name: "Tue", clicks: data.clicks * 0.3 },
    { name: "Wed", clicks: data.clicks * 0.25 },
    { name: "Thu", clicks: data.clicks * 0.15 },
    { name: "Fri", clicks: data.clicks * 0.1 }
  ];

  const pieData = [
    { name: "Meta", value: campaign === "Meta Ads" ? data.clicks : 300 },
    { name: "Google", value: campaign === "Google Ads" ? data.clicks : 200 }
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div style={{ display: "flex", gap: 30, flexWrap: "wrap" }}>

      {/* LINE */}
      <LineChart width={400} height={250} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
      </LineChart>

      {/* PIE */}
      <PieChart width={250} height={250}>
        <Pie data={pieData} dataKey="value" outerRadius={80}>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      {/* BAR */}
      <BarChart width={300} height={200} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="clicks" fill="#82ca9d" />
      </BarChart>

    </div>
  );
}