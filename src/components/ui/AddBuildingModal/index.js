"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { XIcon } from "@phosphor-icons/react";
import { addBuildingAction } from "@/app/actions/add-building";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./styles.module.css";

export default function AddBuildingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function handleOpen() {
    setFormKey((k) => k + 1);
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

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
        + Lägg till byggnad
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
            aria-labelledby="add-building-title"
          >
            <div className={styles.modalHeader}>
              <AppText
                as="h2"
                size="body"
                weight="semiBold"
                id="add-building-title"
              >
                Lägg till byggnad
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
  const [state, formAction, isPending] = useActionState(addBuildingAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      onClose();
    }
  }, [state, router, onClose]);

  return (
    <form action={formAction} className={styles.form}>
      <AppText as="p" size="small" color={COLORS.textSecondary}>
        Ange byggnadens namn och valfri adress.
      </AppText>

      <AppInput
        id="building-name"
        name="name"
        label="Namn"
        placeholder="T.ex. Huvudkontoret"
        autoComplete="off"
        required
      />

      <AppInput
        id="building-address"
        name="address"
        label="Adress (valfritt)"
        placeholder="T.ex. Kungsgatan 14"
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
          Spara byggnad
        </AppButton>
      </div>
    </form>
  );
}
