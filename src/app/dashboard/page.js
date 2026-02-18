"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppText from "@/components/ui/AppText";
import AppTextShowcase from "@/components/ui/AppTextShowcase";

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <main className="container">
      <AppText as="h1" variant="screenTitle">
        Dashboard
      </AppText>
      <AppTextShowcase />
      <AppText as="p" variant="bodyText">
        Inloggad som: {user?.email}
      </AppText>
      <button onClick={handleLogout}>Logga ut</button>
    </main>
  );
}
