import type { Dictionary } from "@/lib/i18n/get-dictionary";

type DashboardPagePlaceholderProps = {
  title: string;
  dictionary: Dictionary;
};

export function DashboardPagePlaceholder({
  title,
  dictionary,
}: DashboardPagePlaceholderProps) {
  return (
    <div className="rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-6 lg:p-8">
      <h1
        className="text-[24px] font-bold sm:text-[30px] lg:text-[34px]"
        style={{ color: "#133D3C" }}
      >
        {title}
      </h1>
      <p className="mt-3 text-[15px] leading-7 text-[#426463] sm:text-[16px]">
        {dictionary.dashboard.comingSoon}
      </p>
    </div>
  );
}
