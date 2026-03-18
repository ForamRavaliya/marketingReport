import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ChartComponent from "../components/ChartComponent";

export default function Dashboard() {

  const [data, setData] = useState({
    clients: 0,
    spend: 0,
    clicks: 0,
    conversions: 0,
    impressions: 1000 // dummy (later backend)
  });

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const dashRes = await axios.get("http://localhost:5000/api/reports/dashboard");
        const clientRes = await axios.get("http://localhost:5000/api/clients");

        const dashboard = dashRes.data || {};

        setData({
          clients: dashboard.clients || 0,
          spend: dashboard.spend || 0,
          clicks: dashboard.clicks || 0,
          conversions: dashboard.conversions || 0,
          impressions: dashboard.impressions || 1000
        });

        setClients(clientRes.data || []);
        setLoading(false);

      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  // 🔢 Calculations
  const ctr = ((data.clicks / data.impressions) * 100).toFixed(2);
  const cpc = (data.spend / (data.clicks || 1)).toFixed(2);
  const cpa = (data.spend / (data.conversions || 1)).toFixed(2);

  // ✅ GLOBAL PDF
  const downloadPDF = async () => {
    const input = document.getElementById("dashboard-content");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    pdf.setFontSize(16);
    pdf.text("Marketing Report", 20, 15);

    pdf.addImage(imgData, "PNG", 10, 20, 190, 100);

    pdf.save("Marketing_Report.pdf");
  };

  // ✅ CLIENT PDF
  const downloadClientPDF = async (id, name) => {
    const element = document.getElementById(`client-${id}`);

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text(`Report - ${name}`, 20, 15);

    pdf.addImage(imgData, "PNG", 10, 25, 180, 100);

    pdf.save(`${name}_Report.pdf`);
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading dashboard...</h2>;

  return (
    <div style={{ padding: 20 }}>

      {/* 🔥 FILTERS */}
      <div style={{ marginBottom: 20 }}>
        <input type="date" />
        <select>
          <option>All Clients</option>
        </select>
        <select>
          <option>Meta Ads</option>
          <option>Google Ads</option>
        </select>
      </div>

      {/* 🔥 GLOBAL PDF BUTTON */}
      <button
        onClick={downloadPDF}
        style={{
          padding: 10,
          background: "black",
          color: "white",
          borderRadius: 8,
          marginBottom: 20
        }}
      >
        Download Full Report
      </button>

      {/* ✅ DASHBOARD CONTENT */}
      <div id="dashboard-content">

        <h1>Marketing Dashboard</h1>

        {/* ✅ CARDS */}
        <div style={{
          display: "flex",
          gap: 20,
          marginTop: 20,
          flexWrap: "wrap"
        }}>
          <Card title="Clients" value={data.clients} />
          <Card title="Spend" value={"₹" + data.spend} />
          <Card title="Clicks" value={data.clicks} />
          <Card title="Conversions" value={data.conversions} />
          <Card title="Impressions" value={data.impressions} />
          <Card title="CTR" value={ctr + "%"} />
          <Card title="CPC" value={"₹" + cpc} />
          <Card title="CPA" value={"₹" + cpa} />
        </div>

        {/* ✅ COMPARISON */}
        <div style={{ marginTop: 20 }}>
          <h3>Performance Growth</h3>
          <p style={{ color: "green" }}>+20% Clicks ↑</p>
          <p style={{ color: "green" }}>+15% Conversions ↑</p>
          <p style={{ color: "red" }}>-10% CPC ↓</p>
        </div>

        {/* ✅ GRAPH */}
        <div style={{ marginTop: 30 }}>
          <ChartComponent />
        </div>

      </div>

      {/* 🔥 CLIENT SECTION */}
      <h2 style={{ marginTop: 40 }}>Client Reports</h2>

      <div style={{ display: "flex", flexWrap: "wrap" }}>

        {clients.map(client => (
          <div key={client.id} style={{
            border: "1px solid #ddd",
            padding: 20,
            margin: 20,
            borderRadius: 10,
            width: 300
          }}>

            <h3>{client.name}</h3>
            <p>Platform: {client.platform || "Meta Ads"}</p>
            <p>Campaign: {client.campaign || "Summer Sale"}</p>
            <p>Spend: ₹{client.spend || 0}</p>
            <p>Clicks: {client.clicks || 0}</p>
            <p>Conversions: {client.conversions || 0}</p>

            {/* ✅ PDF CONTENT */}
            <div id={`client-${client.id}`}>
              <h3>{client.name}</h3>
              <p>Spend: ₹{client.spend || 0}</p>
              <p>Clicks: {client.clicks || 0}</p>
              <p>Conversions: {client.conversions || 0}</p>

              <ChartComponent client={client} />
            </div>

            {/* ✅ BUTTON */}
            <button
              onClick={() => downloadClientPDF(client.id, client.name)}
              style={{
                marginTop: 10,
                padding: 8,
                background: "blue",
                color: "white",
                borderRadius: 6
              }}
            >
              Download PDF
            </button>

          </div>
        ))}

      </div>

      {/* 🔥 HISTORY */}
      <h3 style={{ marginTop: 40 }}>Previous Reports</h3>
      <ul>
        <li>Jan Report - Download</li>
        <li>Feb Report - Download</li>
      </ul>

    </div>
  );
}

// ✅ CARD
function Card({ title, value }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 20,
      width: 200,
      background: "#f7f9fc",
      boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}