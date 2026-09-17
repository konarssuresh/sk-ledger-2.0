"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const ALLOWED_EXPRESSION = /^[0-9+\-*/().\s]+$/;

function sanitizeExpression(value) {
  return value.replace(/[^0-9+\-*/().\s]/g, "");
}

function evaluateExpression(expression) {
  const trimmed = expression.trim();
  if (!trimmed) {
    throw new Error("Enter an expression");
  }
  if (!ALLOWED_EXPRESSION.test(trimmed)) {
    throw new Error("Invalid characters in expression");
  }
  const result = Function(`"use strict"; return (${trimmed});`)();
  if (!Number.isFinite(result)) {
    throw new Error("Invalid calculation");
  }
  return result;
}

export default function Calculator({
  value,
  onSubmit,
  onCancel,
  className,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}) {
  const [expression, setExpression] = useState(() =>
    value === undefined || value === null ? "" : sanitizeExpression(String(value)),
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const initialValue =
      value === undefined || value === null ? "" : sanitizeExpression(String(value));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset when external value changes
    setExpression(initialValue);
    setError("");
  }, [value]);

  const keys = useMemo(
    () => ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "(", "+", ")", "C", "DEL", "="],
    [],
  );

  const evaluateOnly = () => {
    try {
      const value = evaluateExpression(expression);
      setError("");
      setExpression(String(value));
      return value;
    } catch (submissionError) {
      setError(submissionError.message);
      return null;
    }
  };

  const runSubmit = () => {
    const value = evaluateOnly();
    if (value === null) return;
    const formatted = `(${expression.trim()})`;
    if (typeof onSubmit === "function") {
      onSubmit(value, formatted);
    }
  };

  const handleKeyPress = (key) => {
    if (key === "C") {
      setExpression("");
      setError("");
      return;
    }
    if (key === "DEL") {
      setExpression((previous) => previous.slice(0, -1));
      return;
    }
    if (key === "=") {
      evaluateOnly();
      return;
    }
    setExpression((previous) => `${previous}${key}`);
  };

  return (
    <section
      className={clsx("calc-panel flex h-full flex-col rounded-2xl border p-4 shadow-sm", className)}
    >
      <div className="mb-3">
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Operation
        </label>
        <input
          type="text"
          value={expression}
          onChange={(event) => {
            setError("");
            setExpression(sanitizeExpression(event.target.value));
          }}
          placeholder="e.g. 1+2*(3-1)"
          className="calc-input w-full rounded-xl border px-3 py-2 text-base"
        />
        {error ? (
          <p className="mt-2 text-xs font-medium text-error">{error}</p>
        ) : (
          <p className="mt-2 text-xs text-slate-500">
            Use numbers and + - * / ( )
          </p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleKeyPress(key)}
            className={clsx(
              "btn h-11 rounded-xl",
              key === "=" && "btn-primary text-white",
              key !== "=" && key !== "C" && key !== "DEL" && "btn-outline",
              (key === "C" || key === "DEL") && "btn-warning",
            )}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onCancel?.()}
          className="btn btn-outline w-full rounded-xl"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={runSubmit}
          className="btn btn-secondary w-full rounded-xl text-white"
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
}
