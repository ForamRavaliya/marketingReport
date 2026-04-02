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
    impressions: 1000
  });

  const [clients, setClients] = useState([]);
  const [chartData, setChartData] = useState([]);

  const [filteredClient, setFilteredClient] = useState("All");
  const [campaign, setCampaign] = useState("All");

  // ✅ FIXED DATE (OBJECT)
  const [date, setDate] = useState({ from: "", to: "" });

  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  // ✅ FETCH DATA WHEN FILTER CHANGES
  useEffect(() => {
    fetchData();
  }, [filteredClient, campaign, date]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
        console.log("TOKEN:", token);
      // ✅ DASHBOARD API
      const dashRes = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          from: date.from,
          to: date.to,
          clientId: filteredClient,
          campaign: campaign
        }
      });

      // ✅ CLIENT API (FIXED)
      const clientRes = await axios.get("http://localhost:5000/api/clients", {
        headers: { Authorization: `Bearer ${token}`}
      });

      setData({
        clients: dashRes.data.clients || 0,
        spend: dashRes.data.spend || 0,
        clicks: dashRes.data.clicks || 0,
        conversions: dashRes.data.conversions || 0,
        impressions: 1000
      });

      // ✅ CHART DATA
      setChartData(dashRes.data.chart || []);

      setClients(clientRes.data || []);
      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // 🔢 Calculations
  const ctr = ((data.clicks / data.impressions) * 100 || 0).toFixed(2);
  const cpc = (data.spend / (data.clicks || 1)).toFixed(2);
  const cpa = (data.spend / (data.conversions || 1)).toFixed(2);

  // ✅ PDF
  const downloadPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    pdf.text("Marketing Report", 60, 80);
    pdf.text("Date: " + new Date().toLocaleDateString(), 60, 100);

    pdf.addPage();

    const input = document.getElementById("dashboard-content");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);

    pdf.save("Report.pdf");
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>

      {/* 🔥 FILTERS */}
      <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>

        {/* DATE RANGE */}
        <input
          type="date"
          onChange={(e) => setDate({ ...date, from: e.target.value })}
        />

        <input
          type="date"
          onChange={(e) => setDate({ ...date, to: e.target.value })}
        />

        {/* CLIENT */}
        {role === "admin" && (
        <select onChange={(e) => setFilteredClient(e.target.value)}>
          <option value="All">All Clients</option>
          {clients.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
        )}

        {/* CAMPAIGN */}
        <select onChange={(e) => setCampaign(e.target.value)}>
          <option value="All">All Campaigns</option>
          <option value="Meta Ads">Meta Ads</option>
          <option value="Google Ads">Google Ads</option>
        </select>

      </div>

      {/* PDF */}
      <button onClick={downloadPDF} style={{
        padding: 10,
        background: "black",
        color: "white",
        borderRadius: 8
      }}>
        Download Report
      </button>

      {/* DASHBOARD */}
      <div id="dashboard-content">

        <h1>Marketing Dashboard</h1>

        <div style={{
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          marginTop: 20
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

        {/* ✅ REAL CHART */}
        <div style={{ marginTop: 30 }}>
          <ChartComponent data={chartData} />
        </div>

      </div>

      {/* 🔥 ADMIN ONLY */}
      {role === "admin" && (
        <>
          <h2 style={{ marginTop: 40 }}>Client Reports</h2>

          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {clients.map(client => (
              <div key={client._id} style={{
                border: "1px solid #ddd",
                padding: 20,
                margin: 20,
                borderRadius: 10,
                width: 300
              }}>
                <h3>{client.name}</h3>
                <p>Spend: ₹{client.spend || 0}</p>
                <p>Clicks: {client.clicks || 0}</p>
                <p>Conversions: {client.conversions || 0}</p>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

// CARD
function Card({ title, value }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 20,
      width: 200,
      background: "#f7f9fc"
    }}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}