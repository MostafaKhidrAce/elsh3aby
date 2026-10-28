export function WebsitePageLoading({ label }: { label: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-white px-4 py-16">
      <p className="text-sm font-medium text-[#426463]">{label}</p>
    </div>
  );
}
