import {useState,useEffect} from "react";
import axios from "axios";

export default function Clients(){
 const[name,setName]=useState("");
 const[list,setList]=useState([]);

 const load=()=>axios.get("http://localhost:5000/api/clients")
   .then(r=>setList(r.data));

 useEffect(() => {
   load();
 }, []);

 const add = async () => {

   if(!name){
     alert("Enter client name");
     return;
   }

   try{
     await axios.post(
       "http://localhost:5000/api/clients",
       { name }
     );

     alert("Client added successfully ✅");

     setName("");
     load();

   }catch(err){
     alert("Failed to add client ❌");
   }
 };

 return(
 <div>
  <h2>Clients</h2>
  <input onChange={e=>setName(e.target.value)}/>
  <button onClick={add}>Add</button>

 {list.map(c=><div key={c.id}>{c.name}</div>)}
 </div>
 );
}