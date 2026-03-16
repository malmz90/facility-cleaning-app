"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CopySimpleIcon, CheckIcon, XIcon } from "@phosphor-icons/react";
import { addEmployeeAction } from "@/app/actions/add-employee";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { COLORS, SPACING } from "@/constants";
import styles from "./styles.module.css";

function CredentialRow({ label, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <div className={styles.credRow}>
      <div className={styles.credInfo}>
        <AppText as="span" size="small" color={COLORS.textSecondary}>
          {label}
        </AppText>
        <AppText as="span" size="body" weight="semiBold">
          {value}
        </AppText>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={styles.copyBtn}
        aria-label={`Kopiera ${label}`}
        title={copied ? "Kopierat!" : `Kopiera ${label}`}
      >
        {copied ? (
          <CheckIcon size={16} color={COLORS.success} weight="bold" />
        ) : (
          <CopySimpleIcon size={16} color={COLORS.textSecondary} />
        )}
      </button>
    </div>
  );
}

export default function AddEmployeeModal() {
  const [isOpen, setIsOpen] = useState(false);
  // key is bumped on each open to reset useActionState
  const [formKey, setFormKey] = useState(0);

  function handleOpen() {
    setFormKey((k) => k + 1);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen]);

  return (
    <>
      <AppButton variant="primary" size="small" onPress={handleOpen}>
        + Lägg till anställd
      </AppButton>

      {isOpen && (
        <div
          className={styles.backdrop}
          onClick={handleClose}
          role="presentation"
        >
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-employee-title"
          >
            <div className={styles.modalHeader}>
              <AppText
                as="h2"
                size="body"
                weight="semiBold"
                id="add-employee-title"
              >
                Lägg till anställd
              </AppText>
              <button
                type="button"
                onClick={handleClose}
                className={styles.closeBtn}
                aria-label="Stäng"
              >
                <XIcon size={20} color={COLORS.textSecondary} />
              </button>
            </div>

            <ModalForm key={formKey} onClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
}

function ModalForm({ onClose }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(addEmployeeAction, null);

  const success = state?.success && state?.credentials;

  // Refresh the server-rendered employee list in the background so it's
  // already up to date by the time the user closes the credentials view.
  useEffect(() => {
    if (success) router.refresh();
  }, [success, router]);

  if (success) {
    return (
      <div className={styles.successContent}>
        <AppText
          as="p"
          size="small"
          color={COLORS.textSecondary}
          style={{ marginBottom: SPACING.x4 }}
        >
          Anställd skapad! Spara inloggningsuppgifterna – de visas bara en gång.
        </AppText>

        <div className={styles.credList}>
          <CredentialRow
            label="Användarnamn"
            value={state.credentials.username}
          />
          <CredentialRow label="Lösenord" value={state.credentials.password} />
        </div>

        <div
          className={styles.warningBanner}
          style={{ marginTop: SPACING.x4 }}
        >
          <AppText as="span" size="small" color={COLORS.warningText}>
            Lösenordet kan inte hämtas igen. Kopiera det nu.
          </AppText>
        </div>

        <AppButton
          variant="ghost"
          size="small"
          onPress={onClose}
          style={{ marginTop: SPACING.x4 }}
        >
          Stäng
        </AppButton>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <AppText as="p" size="small" color={COLORS.textSecondary}>
        Fyll i den anställdes namn. Användarnamn genereras automatiskt om det lämnas tomt.
      </AppText>

      <AppInput
        id="emp-name"
        name="name"
        label="Namn"
        placeholder="T.ex. Anna Svensson"
        autoComplete="off"
        required
      />

      <AppInput
        id="emp-username"
        name="username"
        label="Användarnamn (valfritt)"
        placeholder="Genereras automatiskt"
        autoComplete="off"
      />

      {state?.error && (
        <div className={styles.errorBanner}>
          <AppText as="span" size="small" color={COLORS.error}>
            {state.error}
          </AppText>
        </div>
      )}

      <div className={styles.formActions}>
        <AppButton
          variant="ghost"
          size="small"
          onPress={onClose}
          type="button"
        >
          Avbryt
        </AppButton>
        <AppButton type="submit" size="small" loading={isPending}>
          Skapa anställd
        </AppButton>
      </div>
    </form>
  );
}
