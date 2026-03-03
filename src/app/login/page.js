"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppText from "@/components/ui/AppText";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppLoader from "@/components/ui/AppLoader";
import { COLORS, SPACING } from "@/constants";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, router, user]);

  // Show loader while checking session OR while already authenticated
  // (covers both fresh page loads and client-side navigation from mainpage)
  if (loading || user) {
    return <AppLoader fullScreen label="Kontrollerar inloggning..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link href="/" className={styles.backLink}>
          <ArrowLeftIcon size={18} weight="bold" />
          Tillbaka
        </Link>

        <AppText
          as="h1"
          variant="pageTitle"
          style={{ marginBottom: SPACING.x1 }}
        >
          Logga in
        </AppText>
        <AppText
          as="p"
          size="small"
          color={COLORS.textSecondary}
          style={{ marginBottom: SPACING.x6 }}
        >
          Välkommen tillbaka! Fyll i dina uppgifter nedan.
        </AppText>

        <form className={styles.form} onSubmit={handleSubmit}>
          <AppInput
            id="email"
            label="E-post"
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="namn@email.se"
            autoComplete="email"
            required
          />

          <AppInput
            id="password"
            label="Lösenord"
            password
            value={password}
            onChangeText={setPassword}
            placeholder="Ditt lösenord"
            autoComplete="current-password"
            required
          />

          {error && (
            <div className={styles.errorBanner}>
              <AppText as="span" size="small" color={COLORS.error}>
                {error}
              </AppText>
            </div>
          )}

          <AppButton
            type="submit"
            loading={isSubmitting}
            style={{ marginTop: SPACING.x1 }}
          >
            Logga in
          </AppButton>
        </form>

        <div className={styles.footer}>
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            Inget konto?{" "}
            <Link
              href="/signup"
              style={{ color: COLORS.link, fontWeight: 600 }}
            >
              Skapa konto
            </Link>
          </AppText>
        </div>
      </div>
    </div>
  );
}
