"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useId, useState } from "react";
import {
  Calendar,
  ChevronDown,
  IdCard,
  Lock,
  Mail,
  Network,
  Phone,
  User,
} from "lucide-react";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import { AuthFormShell } from "@/components/auth/AuthFormShell";
import { SignupSuccessModal } from "@/components/auth/SignupSuccessModal";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/get-dictionary";

type SignupFormProps = {
  dictionary: Dictionary;
};

type BranchOption = {
  value: string;
  label: string;
};

const TEXT = "#170F49";
const GOLD = "#D5AF34";
const BORDER = "#D5AF34";
const INPUT_SHADOW = "0px 2px 6px 0px rgba(74, 58, 255, 0.1)";
const COUNTRY_CODE = "+966";

const inputClassName =
  "h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] sm:h-[50px] sm:text-[15px]";

const inputStyle = {
  borderColor: BORDER,
  color: TEXT,
  boxShadow: INPUT_SHADOW,
} as const;

function SaudiFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 16"
      className={className}
      aria-hidden
      focusable="false"
    >
      <rect width="24" height="16" rx="1.5" fill="#006C35" />
      <path
        fill="#fff"
        d="M5.2 6.2c1.4-.9 3-.9 4.2 0 .4.3.7.7.9 1.1.2-.4.5-.8.9-1.1 1.2-.9 2.8-.9 4.2 0 .2.1.3.4.2.6-.1.2-.4.3-.6.2-1.1-.7-2.4-.7-3.4 0-.5.3-.8.8-.9 1.3h1.5c.2 0 .4.2.4.4s-.2.4-.4.4H9.1c-.1.4-.4.8-.8 1.1l.7.7c.2.2.2.4 0 .6-.2.2-.4.2-.6 0l-.8-.8-.8.8c-.2.2-.4.2-.6 0-.2-.2-.2-.4 0-.6l.7-.7c-.4-.3-.7-.7-.8-1.1H4.8c-.2 0-.4-.2-.4-.4s.2-.4.4-.4h1.5c-.1-.5-.4-1-.9-1.3-1-.7-2.3-.7-3.4 0-.2.1-.5 0-.6-.2-.1-.2 0-.5.2-.6z"
      />
      <rect x="17.2" y="5.2" width="1.2" height="5.6" rx="0.4" fill="#fff" />
    </svg>
  );
}

function DropdownIndicator(props: DropdownIndicatorProps<BranchOption, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49]" strokeWidth={1.75} />
    </components.DropdownIndicator>
  );
}

export function SignupForm({ dictionary }: SignupFormProps) {
  const params = useParams();
  const locale = params.locale as Locale;
  const isAr = locale === "ar";
  const t = dictionary.auth;
  const selectId = useId();

  const [familyBranch, setFamilyBranch] = useState<BranchOption | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    if (!successOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [successOpen]);

  const branchOptions: BranchOption[] = t.familyBranches;

  const selectStyles: StylesConfig<BranchOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: BORDER,
      boxShadow: INPUT_SHADOW,
      backgroundColor: "#fff",
      paddingInlineStart: 36,
      "&:hover": { borderColor: BORDER },
      ...(state.isFocused
        ? { borderColor: BORDER, boxShadow: INPUT_SHADOW }
        : {}),
    }),
    valueContainer: (base) => ({
      ...base,
      paddingInline: 8,
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
    input: (base) => ({
      ...base,
      color: TEXT,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingInline: 12,
      color: TEXT,
    }),
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!familyBranch || !gender) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    console.log({
      familyBranch: familyBranch.value,
      name,
      countryCode: COUNTRY_CODE,
      phone,
      email,
      password,
      nationalId,
      birthDate,
      gender,
    });
    setSuccessOpen(true);
  }

  return (
    <>
    <AuthFormShell
      locale={locale}
      title={t.signupTitle}
      subtitle={t.signupSubtitle}
      wide
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.familyBranch} <span className="text-[#E11D48]">*</span>
          </span>
          <div className="relative">
            <Network
              className="pointer-events-none absolute top-1/2 left-4 z-10 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              strokeWidth={1.75}
            />
            <Select<BranchOption, false>
              inputId={selectId}
              instanceId={selectId}
              options={branchOptions}
              value={familyBranch}
              onChange={(option) => setFamilyBranch(option)}
              placeholder={t.familyBranchPlaceholder}
              isSearchable={false}
              isRtl={isAr}
              styles={selectStyles}
              components={{ DropdownIndicator }}
              classNamePrefix="signup-branch"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.name} <span className="text-[#E11D48]">*</span>
          </span>
          <div className="relative">
            <User
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              strokeWidth={1.75}
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t.namePlaceholder}
              className={`${inputClassName} pl-11 pr-4`}
              style={inputStyle}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.phone} <span className="text-[#E11D48]">*</span>
          </span>
          <div dir="ltr" className="flex min-w-0 gap-2">
            <div
              className="flex h-12 shrink-0 items-center gap-1.5 rounded-[12px] border border-[#D5AF34] bg-white px-2.5 sm:h-[50px] sm:px-3"
              style={{ borderColor: BORDER, boxShadow: INPUT_SHADOW }}
            >
              <SaudiFlag className="h-3.5 w-5" />
              <span
                className="text-[13px] font-medium whitespace-nowrap"
                style={{ color: TEXT }}
              >
                {t.countryCode}
              </span>
            </div>
            <div className="relative min-w-0 flex-1">
              <Phone
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                strokeWidth={1.75}
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                type="tel"
                inputMode="tel"
                placeholder={t.phonePlaceholder}
                className={`${inputClassName} pl-11 pr-4 text-left`}
                style={inputStyle}
              />
            </div>
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.email}
          </span>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
              strokeWidth={1.75}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className={`${inputClassName} pl-11 pr-4`}
              style={inputStyle}
            />
          </div>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.password} <span className="text-[#E11D48]">*</span>
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 left-3 z-10 -translate-y-1/2 p-1 text-[#9CA3AF] hover:text-[#170F49]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Lock className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t.passwordPlaceholder}
              className={`${inputClassName} pl-11 pr-4`}
              style={inputStyle}
            />
          </div>
        </label>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 sm:gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-bold" style={{ color: TEXT }}>
              {t.nationalId} <span className="text-[#E11D48]">*</span>
            </span>
            <div className="relative">
              <IdCard
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                strokeWidth={1.75}
              />
              <input
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                required
                inputMode="numeric"
                placeholder={t.nationalIdPlaceholder}
                className={`${inputClassName} pl-11 pr-4`}
                style={inputStyle}
              />
            </div>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[14px] font-bold" style={{ color: TEXT }}>
              {t.birthDate}
            </span>
            <div className="relative">
              <Calendar
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]"
                strokeWidth={1.75}
              />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder={t.birthDatePlaceholder}
                className={`${inputClassName} pl-11 pr-4`}
                style={inputStyle}
              />
            </div>
          </label>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-bold" style={{ color: TEXT }}>
            {t.gender} <span className="text-[#E11D48]">*</span>
          </span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender("male")}
              aria-pressed={gender === "male"}
              aria-label={t.male}
              className={`inline-flex h-16 w-16 items-center justify-center rounded-[14px] border transition sm:h-[72px] sm:w-[72px] ${
                gender === "male"
                  ? "border-[#D5AF34] bg-[#EEF6FF] ring-2 ring-[#D5AF34]/40"
                  : "border-transparent bg-[#EEF6FF] hover:brightness-95"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/male.svg"
                alt=""
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
            </button>
            <button
              type="button"
              onClick={() => setGender("female")}
              aria-pressed={gender === "female"}
              aria-label={t.female}
              className={`inline-flex h-16 w-16 items-center justify-center rounded-[14px] border transition sm:h-[72px] sm:w-[72px] ${
                gender === "female"
                  ? "border-[#D5AF34] bg-[#FFF0F5] ring-2 ring-[#D5AF34]/40"
                  : "border-transparent bg-[#FFF0F5] hover:brightness-95"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/female.svg"
                alt=""
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
            </button>
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-[12px] text-[15px] font-bold transition hover:brightness-105 sm:h-14 sm:text-[16px]"
          style={{ backgroundColor: GOLD, color: TEXT }}
        >
          {t.signupCta}
        </button>

        <p className="text-center text-[13px] sm:text-[14px]" style={{ color: TEXT }}>
          {t.haveAccount}{" "}
          <Link
            href={`/${locale}/login`}
            className="font-bold hover:underline"
            style={{ color: "#133D3C" }}
          >
            {t.login}
          </Link>
        </p>
      </form>
    </AuthFormShell>

    {successOpen ? (
      <SignupSuccessModal
        locale={locale}
        title={t.signupSuccess.title}
        description={t.signupSuccess.description}
        loginLabel={t.signupSuccess.login}
      />
    ) : null}
    </>
  );
}
