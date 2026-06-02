export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Contacto</h1>

      <div className="space-y-4">
        <p>Teléfono: +591 XXXXXXXX</p>

        <p>Email: contacto@irba.com</p>

        <a
          href="https://wa.me/591XXXXXXXX"
          target="_blank"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded"
        >
          Escribir por WhatsApp
        </a>
      </div>
    </main>
  );
}
