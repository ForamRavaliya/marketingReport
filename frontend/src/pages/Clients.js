import { useState, useEffect } from "react";
import axios from "axios";

export default function Clients() {
  const [name, setName] = useState("");
  const [list, setList] = useState([]);

  const token = localStorage.getItem("token");

  // ✅ LOAD CLIENTS (USER-WISE)
  const load = () =>
    axios.get("http://localhost:5000/api/clients", {
      headers: { Authorization: token }
    })
    .then((r) => setList(r.data));

  useEffect(() => {
    if (token) load();
  }, []);

  // ✅ ADD CLIENT
  const add = async () => {
    if (!name) {
      alert("Enter client name");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/clients",
        { name }, // ❌ userId removed
        {
          headers: { Authorization: token } // ✅ added
        }
      );

      alert("Client added successfully ✅");
      setName("");
      load();

    } catch (err) {
      alert("Failed to add client ❌");
    }
  };

  // ✅ DELETE CLIENT
  const remove = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/clients/${id}`,
        {
          headers: { Authorization: token } // ✅ added
        }
      );

      load();

    } catch {
      alert("Delete failed ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Clients</h2>

      {/* INPUT */}
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter client name"
        style={{ padding: 8, marginRight: 10 }}
      />

      <button onClick={add}>Add</button>

      {/* LIST */}
      <div style={{ marginTop: 20 }}>
        {list.map((c) => (
          <div
            key={c._id}   // ✅ fixed
            style={{
              border: "1px solid #ddd",
              padding: 10,
              marginBottom: 10,
              borderRadius: 6
            }}
          >
            {c.name}

            <button
              onClick={() => remove(c._id)} // ✅ fixed
              style={{
                marginLeft: 10,
                background: "red",
                color: "white",
                borderRadius: 5
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}