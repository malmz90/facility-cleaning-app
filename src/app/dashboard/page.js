"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <main className="container">
      <h1>Dashboard</h1>
      <p>Inloggad som: {user?.email}</p>
      <button onClick={handleLogout}>Logga ut</button>
    </main>
  );
}
