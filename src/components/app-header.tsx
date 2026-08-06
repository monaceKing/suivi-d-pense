export function AppHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header
      className="sticky top-0 z-40 px-5 pb-4"
      style={{ paddingTop: "calc(var(--safe-top) + 1.25rem)", background: "var(--bg)" }}
    >
      <p className="text-xs tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {subtitle}
      </p>
      <h1
        className="text-2xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        {title}
      </h1>
    </header>
  );
}
