import { useState } from "react";
import axios from "axios";

export default function Upload(){

  const [file, setFile] = useState(null);
  const [clientId, setClient] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {

    if(!clientId){
      alert("Enter Client ID");
      return;
    }

    if(!file){
      alert("Select file");
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
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Upload successful ✅");
      setFile(null);
      setClient("");

    }catch(err){
      console.log(err);
      alert("Upload failed ❌");
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

      {/* CLIENT INPUT */}
      <input
        placeholder="Enter Client ID"
        value={clientId}
        onChange={e => setClient(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 15,
          borderRadius: 8,
          border: "1px solid #ccc"
        }}
      />

      {/* FILE INPUT */}
      <input
        type="file"
        accept=".csv,.pdf,.png,.jpg,.jpeg"
        onChange={e => setFile(e.target.files[0])}
        style={{ marginBottom: 15 }}
      />

      {/* FILE NAME PREVIEW */}
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