"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import { ArrowRight, Camera, ChevronDown, Upload } from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { ApiError } from "@/lib/api/client";
import { getActiveElection, nominateCandidate } from "@/lib/api/elections";
import { useAuth } from "@/lib/auth/auth-context";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type Option = { value: string; label: string };

type NominateFormProps = {
  locale: Locale;
  dictionary: Dictionary;
};

const TEXT = "#170F49";
const BORDER = "#E5E5E5";

const inputClassName =
  "h-12 w-full rounded-[12px] border bg-white px-4 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:h-14 sm:text-[15px]";

const textareaClassName =
  "min-h-[160px] w-full resize-y rounded-[12px] border bg-white px-4 py-3 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:text-[15px]";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

function DropdownIndicator(props: DropdownIndicatorProps<Option, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49]" strokeWidth={2} />
    </components.DropdownIndicator>
  );
}

export function NominateForm({ locale, dictionary }: NominateFormProps) {
  const t = dictionary.dashboard.electionsPage;
  const isAr = locale === "ar";
  const router = useRouter();
  const positionSelectId = useId();
  const photoRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [position, setPosition] = useState<Option | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [cvName, setCvName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [electionId, setElectionId] = useState<number | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    void getActiveElection(locale, token).then((election) => {
      if (election) setElectionId(election.id);
    });
  }, [locale, token]);

  const positionOptions: Option[] = t.positions;
  const electionsHref = `/${locale}/dashboard/elections`;

  const selectStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: BORDER,
      boxShadow: "none",
      backgroundColor: "#fff",
      "&:hover": { borderColor: BORDER },
      ...(state.isFocused
        ? { borderColor: "#D5AF34", boxShadow: "none" }
        : {}),
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9CA3AF",
      fontWeight: 400,
      fontSize: 14,
    }),
    singleValue: (base) => ({
      ...base,
      color: TEXT,
      fontWeight: 500,
      fontSize: 14,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 30,
    }),
    option: (base, state) => ({
      ...base,
      fontWeight: 500,
      fontSize: 14,
      color: TEXT,
      backgroundColor: state.isSelected
        ? "#F6EFE7"
        : state.isFocused
          ? "#FBF7F2"
          : "#fff",
      cursor: "pointer",
    }),
  };

  function handlePhotoChange(file: File | undefined) {
    if (!file) {
      setPhotoPreview(null);
      setPhotoFile(null);
      return;
    }
    setPhotoFile(file);
    const url = URL.createObjectURL(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!position || !bio.trim() || !termsAccepted || !token || !electionId) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    try {
      await nominateCandidate(
        {
          election_id: electionId,
          position: position.value,
          bio: bio.trim(),
          image: photoFile,
          files: cvFile ? [cvFile] : [],
        },
        locale,
        token,
      );
      setSuccessOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  const labelClass = "text-[14px] font-bold";
  const fieldGap = "flex flex-col gap-1.5";

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-3">
            <Link
              href={electionsHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#133D3C] transition hover:text-[#D5AF34]"
            >
              <ArrowRight
                className={`h-4 w-4 ${isAr ? "" : "rotate-180"}`}
                strokeWidth={2.25}
              />
              {t.back}
            </Link>
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {t.nominateFormTitle}
            </h1>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={cardClass}>
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-5">
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => photoRef.current?.click()}
                className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#D5AF34] bg-[#FBF6E6] transition hover:brightness-95"
                aria-label={t.uploadPhotoHint}
              >
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera className="h-8 w-8 text-[#D5AF34]" strokeWidth={1.75} />
                )}
              </button>
              <p className="text-center text-sm text-[#6B6B7B]">
                {t.uploadPhotoHint}
              </p>
              <input
                ref={photoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files?.[0])}
              />
            </div>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.choosePosition}
              </span>
              <Select<Option, false>
                inputId={positionSelectId}
                instanceId={positionSelectId}
                options={positionOptions}
                value={position}
                onChange={(option) => setPosition(option)}
                placeholder={t.positionPlaceholder}
                components={{ DropdownIndicator }}
                styles={selectStyles}
                isSearchable={false}
              />
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.name}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePlaceholder}
                className={inputClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>

            <label className={fieldGap}>
              <span className={labelClass} style={{ color: TEXT }}>
                {t.bio}
              </span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={t.bioPlaceholder}
                className={textareaClassName}
                style={{ color: TEXT, borderColor: BORDER }}
              />
            </label>

            <div className={fieldGap}>
              <button
                type="button"
                onClick={() => cvRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-[14px] border border-dashed border-[#D5AF34] bg-[#FBF6E6] px-4 py-8 text-center transition hover:brightness-95"
              >
                <Upload className="h-7 w-7 text-[#D5AF34]" strokeWidth={1.75} />
                <span className="text-sm font-bold text-[#170F49]">
                  {cvName || t.uploadZoneLabel}
                </span>
                <span className="text-xs text-[#9CA3AF]">
                  {t.uploadZoneFormats}
                </span>
              </button>
              <input
                ref={cvRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setCvFile(file ?? null);
                  setCvName(file?.name ?? "");
                }}
              />
            </div>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 rounded border-[#D5AF34] accent-[#D5AF34]"
              />
              <span className="text-sm font-semibold text-[#170F49]">
                {t.termsAgree}
              </span>
            </label>

            {error ? (
              <p className="text-center text-sm font-medium text-[#E11D48]">
                {error}
              </p>
            ) : null}

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="inline-flex min-w-[220px] items-center justify-center rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95"
              >
                {t.submit}
              </button>
            </div>
          </form>
        </section>
      </div>

      {successOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.nominateSuccessTitle}
          description={t.nominateSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => {
            setSuccessOpen(false);
            router.push(electionsHref);
          }}
        />
      ) : null}
    </>
  );
}
