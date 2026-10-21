"use client";

import { useEffect, useMemo, useRef, useState, type ComponentType, type FormEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Camera,
  Check,
  Copy,
  Crown,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  Landmark,
  RefreshCw,
  Trash2,
  UserRound,
  type LucideProps,
} from "lucide-react";
import { UserMenu } from "@/components/layout/UserMenu";
import { DashboardSuccessModal } from "@/components/dashboard/events/DashboardSuccessModal";
import { BookingConfirmModal } from "@/components/dashboard/booking/BookingConfirmModal";
import { ProfileOtpModal } from "@/components/dashboard/profile/ProfileOtpModal";
import { ApiError } from "@/lib/api/client";
import {
  changePassword,
  deleteAccount,
  getBankAccounts,
  getProfile,
  updateProfile,
  updateSettings,
} from "@/lib/api/profile";
import { toApiPhone } from "@/lib/api/localized";
import {
  getSubscriptions,
  hasLiveActivePackage,
  subscribeToPackage,
  type SubscriptionPackage,
} from "@/lib/api/subscriptions";
import { useAuth } from "@/lib/auth/auth-context";
import type { FamilyBankAccount } from "@/lib/dashboard/dummy-profile";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";

type ProfilePageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

type TabId = "personal" | "banks" | "password" | "packages";

const TEXT = "#170F49";
const BORDER = "#E5E5E5";
const LOCALE_PREF_KEY = "elsh3aby_locale";

const inputClassName =
  "h-12 w-full rounded-[12px] border bg-white px-4 text-[14px] font-medium outline-none transition placeholder:font-normal placeholder:text-[#9CA3AF] focus:border-[#D5AF34] sm:h-14 sm:text-[15px]";

const cardClass =
  "rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(25,33,61,0.06)] sm:p-5 lg:p-6";

const labelClass = "text-[14px] font-bold";
const fieldGap = "flex flex-col gap-1.5";

export function ProfilePage({ locale, dictionary }: ProfilePageProps) {
  const t = dictionary.dashboard.profilePage;
  const isAr = locale === "ar";
  const pathname = usePathname();
  const photoRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<TabId>("personal");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const { token, isReady, user } = useAuth();
  const [fullName, setFullName] = useState(user?.name || "");
  const [mobile, setMobile] = useState(user?.phone || "");
  const [initialMobile, setInitialMobile] = useState(user?.phone || "");
  const [banks, setBanks] = useState<FamilyBankAccount[]>([]);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [packageActive, setPackageActive] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [familyBranch, setFamilyBranch] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [notifications, setNotifications] = useState(true);
  const [appOpen, setAppOpen] = useState(true);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [otpOpen, setOtpOpen] = useState(false);
  const [mobileTakenOpen, setMobileTakenOpen] = useState(false);
  const [mobileSuccessOpen, setMobileSuccessOpen] = useState(false);
  const [passwordSuccessOpen, setPasswordSuccessOpen] = useState(false);
  const [unpaidOpen, setUnpaidOpen] = useState(false);
  const [error, setError] = useState("");

  const tabs: {
    id: TabId;
    label: string;
    icon: ComponentType<LucideProps>;
  }[] = [
    { id: "personal", label: t.tabPersonal, icon: UserRound },
    { id: "banks", label: t.tabBanks, icon: Landmark },
    { id: "password", label: t.tabPassword, icon: KeyRound },
    { id: "packages", label: t.tabPackages, icon: Crown },
  ];

  const nextLocale: Locale = locale === "ar" ? "en" : "ar";
  const languageHref =
    pathname.replace(`/${locale}`, `/${nextLocale}`) || `/${nextLocale}/home`;

  const cancelIcon = useMemo(
    () => (
      <div className="relative inline-flex h-20 w-20 items-center justify-center">
        <span className="absolute -top-1 start-2 h-3 w-0.5 rotate-45 bg-[#170F49]" />
        <span className="absolute -top-1 end-2 h-3 w-0.5 -rotate-45 bg-[#170F49]" />
        <span className="absolute -bottom-1 start-2 h-3 w-0.5 -rotate-45 bg-[#170F49]" />
        <span className="absolute -bottom-1 end-2 h-3 w-0.5 rotate-45 bg-[#170F49]" />
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#E11D48] text-3xl font-bold text-white">
          ×
        </span>
      </div>
    ),
    [],
  );

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  useEffect(() => {
    if (!isReady || !token) return;
    void Promise.all([
      getProfile(locale, token),
      getBankAccounts(locale, token),
      getSubscriptions(locale, token),
      hasLiveActivePackage(locale, token),
    ]).then(([profile, accounts, pkgs, active]) => {
      setFullName(profile.name);
      setMobile(profile.phone);
      setInitialMobile(profile.phone);
      setEmail(profile.email);
      setNationalId(profile.nationalId);
      setFamilyBranch(profile.familyBranch);
      setBirthDate(profile.birthDate);
      setGender(profile.gender);
      if (profile.image) setPhotoPreview(profile.image);
      setBanks(accounts);
      setPackages(pkgs);
      setPackageActive(active);
    });
  }, [isReady, token, locale]);

  async function saveProfile() {
    if (!token) return;
    try {
      await updateProfile(
        {
          name: fullName.trim(),
          gender: gender === "female" ? 1 : 0,
          phone: toApiPhone(mobile),
          image: photoFile,
        },
        locale,
        token,
      );
      await updateSettings(
        { language: locale, notifications_enabled: notifications },
        locale,
        token,
      );
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  function handlePersonalSave(event: FormEvent) {
    event.preventDefault();
    if (!fullName.trim() || !mobile.trim()) {
      setError(dictionary.common.required);
      return;
    }
    setError("");
    if (mobile.trim() !== initialMobile) {
      setOtpOpen(true);
      return;
    }
    void saveProfile();
  }

  async function handlePasswordSave(event: FormEvent) {
    event.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError(dictionary.common.required);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(dictionary.common.required);
      return;
    }
    if (!token) return;
    setError("");
    try {
      await changePassword(
        {
          old_password: oldPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        locale,
        token,
      );
      setPasswordSuccessOpen(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  async function handleSubscribe(packageId: number) {
    if (!token) return;
    try {
      await subscribeToPackage(packageId, locale, token);
      setUnpaidOpen(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : dictionary.common.loadError);
    }
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-5">
        <header
          className={`${cardClass} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
        >
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-[#133D3C] sm:text-2xl">
              {t.title}
            </h1>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#133D3C]">
              <UserRound className="h-4 w-4 text-[#D5AF34]" strokeWidth={2} />
              <span>{t.subtitle}</span>
            </div>
          </div>
          <UserMenu locale={locale} dictionary={dictionary} />
        </header>

        <section className={`${cardClass} space-y-6`}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {tabs.map((item) => {
              const active = tab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (item.id === "banks" && !packageActive) {
                      setUnpaidOpen(true);
                    }
                    setTab(item.id);
                    setError("");
                  }}
                  className={`inline-flex items-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-semibold transition sm:px-5 ${
                    active
                      ? "bg-[#133D3C] text-white shadow-[0_6px_16px_rgba(19,61,60,0.22)]"
                      : "bg-[#F6F1E8] text-[#D5AF34] hover:bg-[#EEE7DA]"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "personal" ? (
            <form onSubmit={handlePersonalSave} className="space-y-6">
              <h2 className="text-center text-lg font-bold text-[#133D3C]">
                {t.personalSettings}
              </h2>

              <div className="flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-[#D5AF34] bg-[#FBF6E6]"
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
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setPhotoFile(file);
                    setPhotoPreview((prev) => {
                      if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
                      return URL.createObjectURL(file);
                    });
                  }}
                />
              </div>

              <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.fullName}
                  </span>
                  <input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.fullNamePlaceholder}
                    className={inputClassName}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </label>
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.mobile}
                  </span>
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder={t.mobilePlaceholder}
                    className={inputClassName}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </label>
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.nationalId}
                  </span>
                  <input
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    placeholder={t.nationalIdPlaceholder}
                    className={inputClassName}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </label>
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.familyBranch}
                  </span>
                  <input
                    value={familyBranch}
                    onChange={(e) => setFamilyBranch(e.target.value)}
                    placeholder={t.familyBranchPlaceholder}
                    className={inputClassName}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </label>
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.email}
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={inputClassName}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </label>
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.birthDate}
                  </span>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className={inputClassName}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                </label>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setGender("male")}
                  aria-pressed={gender === "male"}
                  aria-label={t.male}
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-[14px] border transition sm:h-[72px] sm:w-[72px] ${
                    gender === "male"
                      ? "border-[#2563EB] bg-[#EEF6FF] ring-2 ring-[#2563EB]/30"
                      : "border-transparent bg-[#EEF6FF] hover:brightness-95"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logos/male.svg"
                    alt=""
                    className="h-12 w-12 object-contain"
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
                    className="h-12 w-12 object-contain"
                  />
                </button>
              </div>

              <div className="mx-auto max-w-3xl overflow-hidden rounded-[16px] border border-[#EFEFEF]">
                <button
                  type="button"
                  onClick={() => setAppOpen((v) => !v)}
                  className="flex w-full items-center justify-between bg-[#FAFAFA] px-4 py-3 text-sm font-bold text-[#170F49]"
                >
                  <span>{t.appSettings}</span>
                  <span className="text-[#9CA3AF]">{appOpen ? "−" : "+"}</span>
                </button>
                {appOpen ? (
                  <div className="divide-y divide-[#F0F0F0] bg-white">
                    <Link
                      href={languageHref}
                      onClick={() =>
                        localStorage.setItem(LOCALE_PREF_KEY, nextLocale)
                      }
                      className="flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-semibold text-[#170F49] transition hover:bg-[#FAFAFA]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-[#D5AF34]" />
                        {t.changeLanguage}
                      </span>
                      <span className="text-[#9CA3AF]">
                        {nextLocale === "ar" ? "العربية" : "English"}
                      </span>
                    </Link>
                    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#170F49]">
                        <Bell className="h-4 w-4 text-[#D5AF34]" />
                        {t.notifications}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={notifications}
                        onClick={() => setNotifications((v) => !v)}
                        className={`relative h-7 w-12 rounded-full transition ${
                          notifications ? "bg-[#D5AF34]" : "bg-[#D4D4D4]"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
                            notifications ? "start-5" : "start-0.5"
                          }`}
                        />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!token) return;
                        const password = window.prompt(t.tabPassword) || "";
                        if (!password) return;
                        try {
                          await deleteAccount({ password }, locale, token);
                        } catch (err) {
                          setError(
                            err instanceof ApiError
                              ? err.message
                              : dictionary.common.loadError,
                          );
                        }
                      }}
                      className="flex w-full items-center gap-2 px-4 py-3.5 text-sm font-semibold text-[#E11D48] transition hover:bg-[#FFF5F5]"
                    >
                      <Trash2 className="h-4 w-4" />
                      {t.deleteAccount}
                    </button>
                  </div>
                ) : null}
              </div>

              {error ? (
                <p className="text-center text-sm font-medium text-[#E11D48]">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="inline-flex min-w-[220px] items-center justify-center rounded-[12px] bg-[#D5AF34] px-8 py-3.5 text-base font-bold text-white transition hover:brightness-95"
                >
                  {t.saveChanges}
                </button>
              </div>
            </form>
          ) : null}

          {tab === "password" ? (
            <form
              onSubmit={handlePasswordSave}
              className="mx-auto max-w-2xl space-y-5"
            >
              <div className="space-y-2 text-start">
                <h2 className="text-lg font-bold text-[#133D3C]">
                  {t.passwordTitle}
                </h2>
                <ul className="list-disc space-y-1 ps-5 text-sm text-[#6B6B7B]">
                  {t.passwordRules.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.oldPassword}
                  </span>
                  <div className="relative">
                    <input
                      type={showOld ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className={`${inputClassName} pe-11`}
                      style={{ color: TEXT, borderColor: BORDER }}
                    />
                    <button
                      type="button"
                      aria-label={showOld ? t.hide : t.show}
                      onClick={() => setShowOld((v) => !v)}
                      className="absolute top-1/2 end-3 -translate-y-1/2 text-[#9CA3AF]"
                    >
                      {showOld ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>
                <label className={fieldGap}>
                  <span className={labelClass} style={{ color: TEXT }}>
                    {t.newPassword}
                  </span>
                  <div className="relative">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${inputClassName} pe-11`}
                      style={{ color: TEXT, borderColor: BORDER }}
                    />
                    <button
                      type="button"
                      aria-label={showNew ? t.hide : t.show}
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute top-1/2 end-3 -translate-y-1/2 text-[#9CA3AF]"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </label>
              </div>

              <label className={fieldGap}>
                <span className={labelClass} style={{ color: TEXT }}>
                  {t.confirmPassword}
                </span>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${inputClassName} pe-11`}
                    style={{ color: TEXT, borderColor: BORDER }}
                  />
                  <button
                    type="button"
                    aria-label={showConfirm ? t.hide : t.show}
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute top-1/2 end-3 -translate-y-1/2 text-[#9CA3AF]"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                  {t.saveChanges}
                </button>
              </div>
            </form>
          ) : null}

          {tab === "banks" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {banks.map((account) => {
                const bankName = isAr ? account.bankName : account.bankNameEn;
                const accountType = isAr
                  ? account.accountType
                  : account.accountTypeEn;
                return (
                  <article
                    key={account.id}
                    className="rounded-[16px] border border-[#EFEFEF] bg-white p-4 shadow-[0_4px_16px_rgba(25,33,61,0.04)] sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: account.color }}
                        >
                          {account.initial}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#170F49]">
                            {bankName}
                          </p>
                          <p className="mt-1 font-mono text-xs text-[#6B6B7B] sm:text-sm">
                            {account.maskedNumber}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-md bg-[#F4E8C0] px-2 py-1 text-[11px] font-semibold text-[#D5AF34]">
                        {accountType}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        aria-label={t.show}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-[#6B6B7B]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={t.refresh}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-[#6B6B7B]"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        aria-label={t.copy}
                        onClick={() =>
                          navigator.clipboard?.writeText(account.maskedNumber)
                        }
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5] text-[#6B6B7B]"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {tab === "packages" ? (
            <div className="space-y-6">
              <p className="mx-auto max-w-2xl text-center text-sm leading-7 text-[#5C5C6B]">
                {t.packagesIntro}
              </p>
              <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
                {packages.slice(0, 3).map((pkg, index) => {
                  const duration = isAr
                    ? `${pkg.durationMonths} شهر`
                    : `${pkg.durationMonths} months`;
                  const featured = index === 1;
                  return (
                    <article
                      key={pkg.id}
                      className={`flex flex-col overflow-hidden rounded-[16px] border ${
                        featured
                          ? "border-[#D5AF34] shadow-[0_8px_24px_rgba(213,175,52,0.2)]"
                          : "border-[#E8E8E8] bg-[#FBF8F0]"
                      }`}
                    >
                      {featured ? (
                        <div className="bg-[#D5AF34] px-4 py-3 text-center text-sm font-bold text-white">
                          {t.premiumPackage}
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col gap-4 bg-white p-5">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-base font-bold ${
                              featured ? "text-[#170F49]" : "text-[#D5AF34]"
                            }`}
                          >
                            {duration}
                          </span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/logos/crown.svg"
                            alt=""
                            width={24}
                            height={24}
                            className="h-6 w-6 object-contain"
                          />
                        </div>
                        <p className="text-2xl font-bold text-[#133D3C]">
                          {pkg.price.toLocaleString(isAr ? "ar-SA" : "en-US")}{" "}
                          <span className="text-base">{t.currency}</span>
                        </p>
                        <ul className="space-y-2">
                          {t.packageFeatures.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-2 text-sm text-[#5C5C6B]"
                            >
                              <Check
                                className="h-4 w-4 shrink-0 text-[#2563EB]"
                                strokeWidth={2.5}
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <button
                          type="button"
                          onClick={() => handleSubscribe(pkg.id)}
                          className={`mt-auto inline-flex w-full items-center justify-center rounded-[10px] px-4 py-2.5 text-sm font-bold transition ${
                            featured
                              ? "bg-[#D5AF34] text-white hover:brightness-95"
                              : "border border-[#133D3C] bg-white text-[#133D3C] hover:bg-[#F5F5F5]"
                          }`}
                        >
                          {t.subscribeNow}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : null}
        </section>
      </div>

      {otpOpen ? (
        <ProfileOtpModal
          locale={locale}
          title={t.otpTitle}
          description={t.otpDescription}
          resendLabel={t.otpResend}
          confirmLabel={t.ok}
          onClose={() => setOtpOpen(false)}
          onConfirm={() => {
            setOtpOpen(false);
            void saveProfile().then(() => {
              setInitialMobile(mobile);
              setMobileSuccessOpen(true);
            });
          }}
        />
      ) : null}

      {mobileTakenOpen ? (
        <BookingConfirmModal
          locale={locale}
          title={t.mobileTakenTitle}
          description={t.mobileTakenDescription}
          icon={cancelIcon}
          primaryLabel={t.tryAgain}
          secondaryLabel={t.contactUs}
          onPrimary={() => setMobileTakenOpen(false)}
          onSecondary={() => setMobileTakenOpen(false)}
        />
      ) : null}

      {mobileSuccessOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.mobileSuccessTitle}
          description={t.mobileSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => setMobileSuccessOpen(false)}
        />
      ) : null}

      {passwordSuccessOpen ? (
        <DashboardSuccessModal
          locale={locale}
          title={t.passwordSuccessTitle}
          description={t.passwordSuccessDescription}
          confirmLabel={t.ok}
          onConfirm={() => setPasswordSuccessOpen(false)}
        />
      ) : null}

      {unpaidOpen ? (
        <BookingConfirmModal
          locale={locale}
          title={t.unpaidTitle}
          description={t.unpaidDescription}
          icon={cancelIcon}
          primaryLabel={t.goToPackages}
          secondaryLabel={t.cancel}
          onPrimary={() => {
            setUnpaidOpen(false);
            setTab("packages");
          }}
          onSecondary={() => setUnpaidOpen(false)}
        />
      ) : null}
    </>
  );
}
