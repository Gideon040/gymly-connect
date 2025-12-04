export default function ProeflesPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Boek een Proefles</h1>
        <p className="text-gray-600 mb-4">Test de Gymly widget - als je een proefles boekt zou je WhatsApp moeten krijgen.</p>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <iframe
            title="Gymly Kalender"
            src="https://admin.gymly.io/embed/calendar/210f4d5d-250e-4175-8f4b-6d709ee518e1"
            width="100%"
            height="800"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </div>
  );
}