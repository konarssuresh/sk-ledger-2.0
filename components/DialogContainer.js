"use client";

import { useLayoutEffect, useRef, useState } from "react";

const dialogBridge = {
  show: null,
};

export function showDialog(newView) {
  if (!dialogBridge.show) {
    return () => {};
  }
  return dialogBridge.show(newView);
}

export default function DialogContainer() {
  const [views, setViews] = useState([]);
  const idRef = useRef(0);

  useLayoutEffect(() => {
    dialogBridge.show = (newView) => {
      const dialogId = ++idRef.current;
      setViews((previous) => [...previous, { id: dialogId, view: newView }]);

      return () => {
        setViews((previous) =>
          previous.filter((dialogView) => dialogView.id !== dialogId),
        );
      };
    };

    return () => {
      dialogBridge.show = null;
    };
  }, []);

  return (
    <>
      {views.map((dialogView) => (
        <div key={dialogView.id}>{dialogView.view}</div>
      ))}
    </>
  );
}
