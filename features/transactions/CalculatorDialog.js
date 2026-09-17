"use client";

import { Calculator, Dialog } from "@/components";

function CalculatorDialog({ value, onSelect, onClose }) {
  return (
    <Dialog
      open
      width="small"
      onClose={onClose}
      showHeader={false}
      closeOnBackdropClick={false}
      panelClassName="h-[70dvh] max-h-[100dvh] rounded-none border-0 sm:h-auto sm:max-h-[90vh] sm:rounded-2xl sm:border"
      bodyClassName="h-full max-h-none p-3 sm:p-4"
      onOpen={() => {}}
      footer={null}
    >
      <Calculator
        value={value}
        onSubmit={(value) => {
          onSelect(value);
          onClose();
        }}
        onCancel={onClose}
        submitLabel="Done"
        cancelLabel="Cancel"
      />
    </Dialog>
  );
}

export default CalculatorDialog;
