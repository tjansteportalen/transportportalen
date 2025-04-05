import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tcxcufwbxueidltoixgi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjeGN1ZndieHVlaWRsdG9peGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4Nzk1MzksImV4cCI6MjA1OTQ1NTUzOX0.VA5Dp8QbA9rUuSD9RySMi8n9nMBMZs2XlDNfVKRmD1Q"
);

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("transport");
  const [uppdrag, setUppdrag] = useState([]);
  const [nyttUppdrag, setNyttUppdrag] = useState({
    datum: "",
    tid: "",
    från: "",
    till: "",
    beskrivning: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!companyName) return;
    const { data, error } = await supabase
      .from("companies")
      .insert([{ name: companyName, type: companyType }])
      .select();
    if (!error) {
      setLoggedIn(true);
      fetchUppdrag();
    }
  };

  const fetchUppdrag = async () => {
    const { data } = await supabase.from("missions").select("*");
    if (data) setUppdrag(data);
  };

  const skapaUppdrag = async () => {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("name", companyName)
      .maybeSingle();

    if (company) {
      await supabase.from("missions").insert({
        company_id: company.id,
        date: nyttUppdrag.datum,
        time: nyttUppdrag.tid,
        location_from: nyttUppdrag.från,
        location_to: nyttUppdrag.till,
        description: nyttUppdrag.beskrivning,
      });
      fetchUppdrag();
      setNyttUppdrag({ datum: "", tid: "", från: "", till: "", beskrivning: "" });
    }
  };

  useEffect(() => {
    if (loggedIn) fetchUppdrag();
  }, [loggedIn]);

  return (
    <main style={{ padding: 20 }}>
      <h1>Transportportalen</h1>
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <input placeholder="Företagsnamn" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <div>
            <label>
              <input type="radio" checked={companyType === "transport"} onChange={() => setCompanyType("transport")} />
              Transportföretag
            </label>
            <label>
              <input type="radio" checked={companyType === "uppdragsgivare"} onChange={() => setCompanyType("uppdragsgivare")} />
              Uppdragsgivare
            </label>
          </div>
          <button type="submit">Logga in</button>
        </form>
      ) : (
        <>
          {companyType === "uppdragsgivare" && (
            <div>
              <h3>Skapa uppdrag</h3>
              <input placeholder="Datum" value={nyttUppdrag.datum} onChange={(e) => setNyttUppdrag({ ...nyttUppdrag, datum: e.target.value })} />
              <input placeholder="Tid" value={nyttUppdrag.tid} onChange={(e) => setNyttUppdrag({ ...nyttUppdrag, tid: e.target.value })} />
              <input placeholder="Från" value={nyttUppdrag.från} onChange={(e) => setNyttUppdrag({ ...nyttUppdrag, från: e.target.value })} />
              <input placeholder="Till" value={nyttUppdrag.till} onChange={(e) => setNyttUppdrag({ ...nyttUppdrag, till: e.target.value })} />
              <textarea placeholder="Beskrivning" value={nyttUppdrag.beskrivning} onChange={(e) => setNyttUppdrag({ ...nyttUppdrag, beskrivning: e.target.value })} />
              <button onClick={skapaUppdrag}>Publicera uppdrag</button>
            </div>
          )}
          <h3>Tillgängliga uppdrag</h3>
          <ul>
            {uppdrag.map((u) => (
              <li key={u.id}>
                {u.location_from} → {u.location_to} ({u.date}) – {u.description}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
