import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, BarChart, Bar, Cell
} from "recharts";

export default function ChartComponent() {

  const data = [
    { name: "Mon", clicks: 30 },
    { name: "Tue", clicks: 50 },
    { name: "Wed", clicks: 40 },
    { name: "Thu", clicks: 70 },
    { name: "Fri", clicks: 60 }
  ];

  const pieData = [
    { name: "Meta", value: 300 },
    { name: "Google", value: 200 }
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div style={{
      display: "flex",
      gap: 30,
      flexWrap: "wrap",
      alignItems: "center"
    }}>

      {/* 📈 LINE CHART */}
      <LineChart width={400} height={250} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
      </LineChart>

      {/* 🥧 PIE CHART */}
      <PieChart width={250} height={250}>
        <Pie
          data={pieData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={80}
        >
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      {/* 📊 BAR CHART */}
      <BarChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="clicks" fill="#82ca9d" />
      </BarChart>

    </div>
  );
}