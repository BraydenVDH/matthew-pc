export function isAdmin() {
  if (typeof document === "undefined") return false;
  return (
    document
      .querySelector('meta[name="is-admin"]')
      ?.getAttribute("content") === "true"
  );
}

export function getCsrfToken() {
  if (typeof document === "undefined") return "";
  return (
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
    ""
  );
}
