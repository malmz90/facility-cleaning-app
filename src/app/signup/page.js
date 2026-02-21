"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppText from "@/components/ui/AppText";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import { COLORS, SPACING } from "@/constants";
import styles from "./page.module.css";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [router, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const data = await signUp(email, password);

      if (data.session) {
        router.push("/dashboard");
        return;
      }

      setMessage("Konto skapat. Verifiera e-post innan du loggar in.");
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <AppText as="span" size="large" weight="semiBold" color={COLORS.primary}>
            FacilityClean
          </AppText>
        </div>

        <AppText as="h1" variant="pageTitle" style={{ marginBottom: SPACING.x1 }}>
          Skapa konto
        </AppText>
        <AppText
          as="p"
          size="small"
          color={COLORS.textSecondary}
          style={{ marginBottom: SPACING.x6 }}
        >
          Kom igång gratis. Fyll i dina uppgifter nedan.
        </AppText>

        <form className={styles.form} onSubmit={handleSubmit}>
          <AppInput
            id="email"
            label="E-post"
            type="email"
            value={email}
            onChangeText={setEmail}
            placeholder="namn@foretag.se"
            autoComplete="email"
            signup
            required
          />

          <AppInput
            id="password"
            label="Lösenord"
            password
            value={password}
            onChangeText={setPassword}
            placeholder="Minst 6 tecken"
            autoComplete="new-password"
            minLength={6}
            signup
            required
          />

          {message && (
            <div className={styles.successBanner}>
              <AppText as="span" size="small" color={COLORS.success}>
                {message}
              </AppText>
            </div>
          )}

          {error && (
            <div className={styles.errorBanner}>
              <AppText as="span" size="small" color={COLORS.error}>
                {error}
              </AppText>
            </div>
          )}

          <AppButton type="submit" loading={isSubmitting} style={{ marginTop: SPACING.x1 }}>
            Skapa konto
          </AppButton>
        </form>

        <div className={styles.footer}>
          <AppText as="p" size="small" color={COLORS.textSecondary}>
            Har du redan konto?{" "}
            <Link href="/login" style={{ color: COLORS.link, fontWeight: 600 }}>
              Logga in
            </Link>
          </AppText>
        </div>
      </div>
    </div>
  );
}
