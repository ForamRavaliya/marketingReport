import { useState, useEffect } from "react";
import axios from "axios";

export default function Upload(){

  const [file, setFile] = useState(null);
  const [clientId, setClient] = useState("");
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ LOAD CLIENTS
  useEffect(() => {
    axios.get("http://localhost:5000/api/clients", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("CLIENTS DATA:", res.data); // 🔥
      setClients(res.data);
    })
    .catch(err => console.log(err));
  }, []);

  // ✅ UPLOAD
  const send = async () => {

    if(!clientId){
      alert("Select Client ❌");
      return;
    }

    if(!file){
      alert("Select file ❌");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("clientId", clientId);

    try{
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/reports/upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Upload successful ✅");
      setFile(null);
      setClient("");

    }catch(err){
       console.log("UPLOAD ERROR:", err.response?.data || err.message);
       alert(err.response?.data?.error || "Upload failed ❌");
     }

    setLoading(false);
  };

  return(
    <div style={{
      padding: 30,
      maxWidth: 500,
      margin: "auto",
      border: "1px solid #ddd",
      borderRadius: 12,
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
    }}>

      <h2 style={{ marginBottom: 20 }}>Upload Report</h2>

      {/* ✅ CLIENT DROPDOWN */}
      <select
        value={clientId}
        onChange={e => setClient(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          borderRadius: 8
        }}
      >
        <option value="">Select Client</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".csv"
        onChange={e => setFile(e.target.files[0])}
        style={{ marginBottom: 15 }}
      />

      {/* FILE NAME */}
      {file && (
        <p style={{ color: "green" }}>
          Selected: {file.name}
        </p>
      )}

      {/* BUTTON */}
      <button
        onClick={send}
        disabled={loading}
        style={{
          width: "100%",
          padding: 12,
          background: loading ? "gray" : "black",
          color: "white",
          borderRadius: 8,
          border: "none",
          cursor: "pointer"
        }}
      >
        {loading ? "Uploading..." : "Upload Report"}
      </button>

    </div>
  );
}