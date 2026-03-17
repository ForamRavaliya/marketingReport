import { useState } from "react";
import axios from "axios";

export default function Upload(){

  const [file,setFile]=useState(null);
  const [clientId,setClient]=useState("");
  const [loading,setLoading]=useState(false);

  const send = async ()=>{

    if(!clientId){
      alert("Enter Client ID");
      return;
    }

    if(!file){
      alert("Select CSV file");
      return;
    }

    const form=new FormData();
    form.append("file",file);
    form.append("clientId",clientId);

    try{
      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/reports/upload",
        form
      );

      alert("Upload successful ✅");
      setFile(null);
      setClient("");

    }catch(err){
      alert("Upload failed ❌");
    }

    setLoading(false);
  };

  return(
    <div style={{padding:20}}>

      <h2>Upload Report CSV</h2>

      <input
        placeholder="Client ID"
        value={clientId}
        onChange={e=>setClient(e.target.value)}
      />

      <br/><br/>

      <input
        type="file"
        accept=".csv"
        onChange={e=>setFile(e.target.files[0])}
      />

      <br/><br/>

      <button onClick={send} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

    </div>
  );
}