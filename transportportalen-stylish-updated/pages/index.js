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
  const [missions, setMissions] = useState([]);
  const [newMission, setNewMission] = useState({
    date: "",
    time: "",
    from: "",
    to: "",
    description: "",
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
      fetchMissions();
    }
  };

  const fetchMissions = async () => {
    const { data } = await supabase.from("missions").select("*");
    if (data) setMissions(data);
  };

  const createMission = async () => {
    const { data: company } = await supabase
      .from("companies")
      .select("id")
      .eq("name", companyName)
      .maybeSingle();

    if (company) {
      await supabase.from("missions").insert({
        company_id: company.id,
        date: newMission.date,
        time: newMission.time,
        location_from: newMission.from,
        location_to: newMission.to,
        description: newMission.description,
      });
      fetchMissions();
      setNewMission({ date: "", time: "", from: "", to: "", description: "" });
    }
  };

  useEffect(() => {
    if (loggedIn) fetchMissions();
  }, [loggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Transportportalen</h1>
        {!loggedIn ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Företagsnamn"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex items-center justify-between text-sm text-gray-700">
              <label className="flex items-center">
                <input type="radio" name="type" className="mr-2" defaultChecked onChange={() => setCompanyType("transport")} /> Transportföretag
              </label>
              <label className="flex items-center">
                <input type="radio" name="type" className="mr-2" onChange={() => setCompanyType("uppdragsgivare")} /> Uppdragsgivare
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Logga in
            </button>
          </form>
        ) : (
          <>
            {companyType === "uppdragsgivare" && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Skapa uppdrag</h3>
                <input
                  type="text"
                  placeholder="Datum"
                  value={newMission.date}
                  onChange={(e) => setNewMission({ ...newMission, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Tid"
                  value={newMission.time}
                  onChange={(e) => setNewMission({ ...newMission, time: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Från"
                  value={newMission.from}
                  onChange={(e) => setNewMission({ ...newMission, from: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Till"
                  value={newMission.to}
                  onChange={(e) => setNewMission({ ...newMission, to: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <textarea
                  placeholder="Beskrivning"
                  value={newMission.description}
                  onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={createMission}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Publicera uppdrag
                </button>
              </div>
            )}
            <h3 className="text-xl font-semibold mt-6">Tillgängliga uppdrag</h3>
            <ul className="space-y-4 mt-4">
              {missions.map((mission) => (
                <li key={mission.id} className="border p-4 rounded-lg shadow">
                  <p className="text-lg font-medium">{mission.location_from} → {mission.location_to}</p>
                  <p>{mission.date} - {mission.time}</p>
                  <p>{mission.description}</p>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
