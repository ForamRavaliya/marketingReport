import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  PieChart, Pie, BarChart, Bar, Cell
} from "recharts";

export default function ChartComponent({ data = [] }) {

  // ✅ FORMAT DATA FROM BACKEND
  const formatted = data.map(d => ({
    name: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    clicks: Number(d.clicks)
  }));

  // ✅ PIE (dummy split)
  const pieData = [
    { name: "Meta", value: 60 },
    { name: "Google", value: 40 }
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div style={{
      display: "flex",
      gap: 30,
      flexWrap: "wrap",
      alignItems: "center"
    }}>

      {/* 📈 LINE */}
      <LineChart width={400} height={250} data={formatted}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="clicks" stroke="#8884d8" />
      </LineChart>

      {/* 🥧 PIE */}
      <PieChart width={250} height={250}>
        <Pie data={pieData} dataKey="value" outerRadius={80}>
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>

      {/* 📊 BAR */}
      <BarChart width={300} height={200} data={formatted}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="clicks" fill="#82ca9d" />
      </BarChart>

    </div>
  );
}