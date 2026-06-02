import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          IRBA
        </Link>

        <nav className="flex gap-6">
          <Link href="/">Inicio</Link>

          <Link href="/catalog">Catálogo</Link>

          <Link href="/offers">Ofertas</Link>

          <Link href="/contact">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}
