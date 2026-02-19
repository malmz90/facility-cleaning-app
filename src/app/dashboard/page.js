"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppButton from "@/components/ui/AppButton";
import AppButtonShowcase from "@/components/ui/AppButtonShowcase";
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
      <AppText as="h1" variant="pageTitle">
        Dashboard
      </AppText>
      <AppTextShowcase />
      <AppButtonShowcase />
      <AppText as="p" variant="body">
        Inloggad som: {user?.email}
      </AppText>
      <AppButton variant="ghost" size="small" onPress={handleLogout}>
        Logga ut
      </AppButton>
    </main>
  );
}
