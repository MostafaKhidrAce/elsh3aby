import type { Dictionary } from "@/lib/i18n/get-dictionary";

type PublicFooterProps = {
  dictionary: Dictionary;
};

export function PublicFooter({ dictionary }: PublicFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-foreground">{dictionary.footer.family}</p>
        <p>
          © {year} {dictionary.brand.name}. {dictionary.footer.rights}
        </p>
      </div>
    </footer>
  );
}
