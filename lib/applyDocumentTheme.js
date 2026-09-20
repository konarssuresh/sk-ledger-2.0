/**
 * Applies SK Ledger theme to the document root (client-only).
 * Light mode uses data-theme="light" to block DaisyUI prefers-color-scheme dark.
 * Dark mode uses html.theme-dark CSS variable overrides (legacy parity).
 */
function applyDocumentTheme(theme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("theme-dark", isDark);
  root.setAttribute("data-theme", "light");
  root.style.colorScheme = isDark ? "dark" : "light";
}

module.exports = {
  applyDocumentTheme,
};
