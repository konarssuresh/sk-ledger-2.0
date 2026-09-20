"use client";

import { useState } from "react";
import { Dialog, FormButton } from "@/components";
import { useDeleteTransactionMutation } from "@/features/transactions/hooks";

const DeleteTransactionDialog = ({ onClose, transaction, onDeleted }) => {
  const [deleteError, setDeleteError] = useState("");
  const { mutateAsync: deleteTransaction, isPending: isLoading } =
    useDeleteTransactionMutation();

  return (
    <Dialog
      open
      width="small"
      title="Delete this transaction?"
      onClose={onClose}
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <FormButton variant="ghost" fullWidth={false} onClick={onClose}>
            Cancel
          </FormButton>
          <FormButton
            fullWidth={false}
            loading={isLoading}
            className="border-red-200 bg-red-500 text-white hover:bg-red-600"
            onClick={async () => {
              if (!transaction?._id) return;
              try {
                setDeleteError("");
                await deleteTransaction({
                  id: transaction._id,
                  date: transaction.date,
                });
                onClose?.();
                onDeleted?.();
              } catch (error) {
                setDeleteError(
                  error?.message ||
                    "Failed to delete transaction. Please try again.",
                );
              }
            }}
          >
            Delete
          </FormButton>
        </div>
      }
    >
      <p className="text-sm text-base-content/70">This action cannot be undone.</p>
      {deleteError ? (
        <p className="mt-2 text-sm text-error" role="alert">
          {deleteError}
        </p>
      ) : null}
    </Dialog>
  );
};

export default DeleteTransactionDialog;
