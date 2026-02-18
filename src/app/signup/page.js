"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AppText from "@/components/ui/AppText";

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
    <main className="container">
      <AppText as="h1" variant="screenTitle">
        Skapa konto
      </AppText>
      <form className="authForm" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={6}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Skapar konto..." : "Skapa konto"}
        </button>
      </form>
      {message && (
        <AppText as="p" variant="bodyText" color="#10773f">
          {message}
        </AppText>
      )}
      {error && (
        <AppText as="p" variant="bodyText" color="#c62828">
          {error}
        </AppText>
      )}
      <AppText as="p" variant="bodyText">
        Har du redan konto? <Link href="/login">Logga in</Link>
      </AppText>
    </main>
  );
}
