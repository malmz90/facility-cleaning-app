import Link from "next/link";
import AppText from "@/components/ui/AppText";

export default function HomePage() {
  return (
    <main className="container">
      <AppText as="h1" variant="pageTitle">
        Facility Cleaning App
      </AppText>
      <AppText as="p" variant="body">
        App Router version with Supabase auth flow.
      </AppText>
      <div className="row">
        <Link href="/signup">
          <AppText as="span" variant="body" color="#13797D">
            Skapa konto
          </AppText>
        </Link>
        <Link href="/login">
          <AppText as="span" variant="body" color="#13797D">
            Logga in
          </AppText>
        </Link>
        <Link href="/dashboard">
          <AppText as="span" variant="body" color="#13797D">
            Dashboard
          </AppText>
        </Link>
      </div>
    </main>
  );
}
