import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <h1>Facility Cleaning App</h1>
      <p>App Router version with Supabase auth flow.</p>
      <div className="row">
        <Link href="/signup">Skapa konto</Link>
        <Link href="/login">Logga in</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </main>
  );
}
