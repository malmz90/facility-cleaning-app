"use client";

import { useActionState, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { createOrganizationAction } from "@/app/actions/create-organization";
import AppText from "@/components/ui/AppText";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { COLORS, SPACING } from "@/constants";
import styles from "./page.module.css";

export default function CreateOrganizationPage() {
  const { signOut } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [state, action, isPending] = useActionState(createOrganizationAction, null);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.signOutRow}>
          <AppButton variant="ghost" size="small" onPress={handleSignOut}>
            Logga ut
          </AppButton>
        </div>

        <AppText as="h1" variant="pageTitle" style={{ marginBottom: SPACING.x1 }}>
          Skapa din organisation
        </AppText>
        <AppText
          as="p"
          size="small"
          color={COLORS.textSecondary}
          style={{ marginBottom: SPACING.x6 }}
        >
          Ge din organisation ett namn för att komma igång. Du kan ändra det senare.
        </AppText>

        <form action={action} className={styles.form}>
          <AppInput
            id="name"
            name="name"
            label="Organisationsnamn"
            value={name}
            onChangeText={setName}
            placeholder="Ex. Städfirman AB"
            autoComplete="organization"
            required
          />

          {state?.error && (
            <div className={styles.errorBanner}>
              <AppText as="span" size="small" color={COLORS.error}>
                {state.error}
              </AppText>
            </div>
          )}

          <AppButton
            type="submit"
            loading={isPending}
            style={{ marginTop: SPACING.x1 }}
          >
            Kom igång
          </AppButton>
        </form>
      </div>
    </div>
  );
}
