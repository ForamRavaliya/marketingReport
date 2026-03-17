import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard(){

  const [data, setData] = useState({
    clients: 0,
    spend: 0,
    clicks: 0,
    conversions: 0
  });
  const [loading,setLoading]=useState(true);

 useEffect(() => {

   let isMounted = true;

   const fetchDashboard = async () => {
     try {
       const res = await axios.get(
         "http://localhost:5000/api/reports/dashboard"
       );

       if (!isMounted) return;

       const dashboard = res.data || {};

       setData({
         clients: dashboard.clients || 0,
         spend: dashboard.spend || 0,
         clicks: dashboard.clicks || 0,
         conversions: dashboard.conversions || 0
       });

       setLoading(false);

     } catch (err) {
       if (isMounted) setLoading(false);
     }
   };

   fetchDashboard();

   return () => {
     isMounted = false;   // proper cleanup
   };

 }, []);

  if(loading) return <h2 style={{padding:20}}>Loading dashboard...</h2>;

  return(
    <div style={{padding:20}}>
      <h1>Marketing Dashboard</h1>

      <div style={{
        display:"flex",
        gap:20,
        marginTop:20,
        flexWrap:"wrap"
      }}>

        <Card title="Clients" value={data?.clients ?? 0}/>
        <Card title="Total Spend" value={"₹"+data.spend}/>
        <Card title="Clicks" value={data.clicks}/>
        <Card title="Conversions" value={data.conversions}/>

      </div>
      <div id="dashboard-content" style={{ padding: 20 }}>
        <h1>Marketing Dashboard</h1>

        <div style={{ display: "flex", gap: 20 }}>
          <Card title="Clients" value={data.clients} />
          <Card title="Spend" value={"₹" + data.spend} />
          <Card title="Clicks" value={data.clicks} />
          <Card title="Conversions" value={data.conversions} />
        </div>

        {/* Graph */}
        <ChartComponent />
      </div>
    </div>
  );
}

function Card({title,value}){
  return(
    <div style={{
      border:"1px solid #ddd",
      borderRadius:12,
      padding:20,
      width:200,
      background:"#f7f9fc",
      boxShadow:"0 2px 6px rgba(0,0,0,0.05)"
    }}>
      <h3 style={{marginBottom:10}}>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}