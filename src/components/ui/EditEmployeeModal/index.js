"use client";

import { useState, useActionState, useEffect } from "react";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import {
  updateEmployeeNameAction,
  removeEmployeeAction,
} from "@/app/actions/edit-employee";
import AppModal from "@/components/ui/AppModal";
import AppButton from "@/components/ui/AppButton";
import AppInput from "@/components/ui/AppInput";
import AppText from "@/components/ui/AppText";
import { COLORS } from "@/constants";
import styles from "./styles.module.css";

/**
 * Renders a three-dots trigger button per employee row.
 * Opens a modal with two views:
 *   "edit"           — change name + link to remove
 *   "confirm-remove" — confirmation step before removing
 *
 * isCurrentUser prevents the logged-in user from removing themselves.
 */
export default function EditEmployeeModal({ userId, name, isCurrentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("edit");
  const [formKey, setFormKey] = useState(0);

  function handleOpen() {
    setFormKey((k) => k + 1);
    setView("edit");
    setIsOpen(true);
  }

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className={styles.dotsBtn}
        onClick={handleOpen}
        aria-label={`Redigera ${name ?? "anställd"}`}
      >
        <DotsThreeVerticalIcon
          size={24}
          weight="bold"
          color="#1d2935"
          className={styles.dotsIcon}
        />
      </button>

      <AppModal
        isOpen={isOpen}
        onClose={handleClose}
        title="Redigera anställd"
        titleId="edit-employee-title"
      >
        {view === "edit" ? (
          <EditForm
            key={formKey}
            userId={userId}
            name={name}
            isCurrentUser={isCurrentUser}
            onClose={handleClose}
            onRemoveRequest={() => setView("confirm-remove")}
          />
        ) : (
          <ConfirmRemove
            userId={userId}
            name={name}
            onClose={handleClose}
            onBack={() => setView("edit")}
          />
        )}
      </AppModal>
    </>
  );
}

function EditForm({ userId, name, isCurrentUser, onClose, onRemoveRequest }) {
  const [nameValue, setNameValue] = useState(name ?? "");
  const [state, formAction, isPending] = useActionState(
    updateEmployeeNameAction,
    null,
  );

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <div className={styles.editContent}>
      <form action={formAction} className={styles.form}>
        <input type="hidden" name="userId" value={userId} />

        <AppInput
          id="edit-emp-name"
          name="name"
          label="Namn"
          value={nameValue}
          onChangeText={setNameValue}
          placeholder="T.ex. Anna Svensson"
          autoComplete="off"
          required
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
            Spara
          </AppButton>
        </div>
      </form>

      {!isCurrentUser && (
        <div className={styles.dangerZone}>
          <button
            type="button"
            className={styles.removeLink}
            onClick={onRemoveRequest}
          >
            Ta bort från organisation
          </button>
        </div>
      )}
    </div>
  );
}

function ConfirmRemove({ userId, name, onClose, onBack }) {
  const [state, formAction, isPending] = useActionState(
    removeEmployeeAction,
    null,
  );

  useEffect(() => {
    if (state?.success) onClose();
  }, [state, onClose]);

  return (
    <form action={formAction} className={styles.confirmForm}>
      <input type="hidden" name="userId" value={userId} />

      <div className={styles.confirmText}>
        <AppText as="p" size="body">
          Ta bort <strong>{name ?? "anställd"}</strong> från organisationen?
        </AppText>
        <AppText as="p" size="small" color={COLORS.textSecondary}>
          De förlorar åtkomst till appen direkt.
        </AppText>
      </div>

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
          onPress={onBack}
          type="button"
        >
          Tillbaka
        </AppButton>
        <AppButton
          type="submit"
          size="small"
          loading={isPending}
          style={{ backgroundColor: COLORS.error }}
        >
          Ja, ta bort
        </AppButton>
      </div>
    </form>
  );
}
