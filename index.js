export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Transportportalen</h1>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Företagsnamn"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex items-center justify-between text-sm text-gray-700">
            <label className="flex items-center">
              <input type="radio" name="type" className="mr-2" defaultChecked /> Transportföretag
            </label>
            <label className="flex items-center">
              <input type="radio" name="type" className="mr-2" /> Uppdragsgivare
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
}
