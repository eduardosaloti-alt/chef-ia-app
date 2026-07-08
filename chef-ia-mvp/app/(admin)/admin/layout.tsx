export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cacau px-6 py-10 text-cream md:px-16">
      <p className="mb-8 font-display text-xl italic text-dourado-light">Chef IA — Painel Administrativo</p>
      {children}
    </div>
  );
}
