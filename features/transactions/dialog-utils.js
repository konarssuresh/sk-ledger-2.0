import { showDialog } from "@/components/DialogContainer";

export function mountDialog(renderContent) {
  let close = () => {};
  close = showDialog(renderContent(() => close()));
  return close;
}
