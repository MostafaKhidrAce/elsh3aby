"use client";

import { ChevronDown, Phone, User } from "lucide-react";
import { FormEvent, useId, useState } from "react";
import Select, {
  components,
  type DropdownIndicatorProps,
  type StylesConfig,
} from "react-select";
import type { Dictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/config";
import type { ContactFormView } from "@/lib/api/website-view";
import { submitContactMessage } from "@/lib/api/website";
import { toApiPhone } from "@/lib/api/localized";

type ContactFormSectionProps = {
  locale: Locale;
  dictionary: Dictionary;
  data: ContactFormView;
};

type MessageTypeOption = {
  value: string;
  label: string;
};

const LABEL = "#170F49";
const GOLD = "#D5AF34";
const FORM_BG = "#F6EFE7";
const TITLE = "#133D3C";

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

function DropdownIndicator(props: DropdownIndicatorProps<MessageTypeOption, false>) {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 text-[#170F49] sm:h-5 sm:w-5" strokeWidth={1.75} />
    </components.DropdownIndicator>
  );
}

export function ContactFormSection({
  locale,
  dictionary,
  data,
}: ContactFormSectionProps) {
  const t = dictionary.contact.formSection;
  const isAr = locale === "ar";
  const selectId = useId();
  const [messageType, setMessageType] = useState<MessageTypeOption | null>(null);
  const [messageTypeError, setMessageTypeError] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  const options: MessageTypeOption[] = data.messageTypes;

  const selectStyles: StylesConfig<MessageTypeOption, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: 48,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: GOLD,
      boxShadow: "none",
      backgroundColor: "#fff",
      paddingInline: 4,
      "&:hover": { borderColor: GOLD },
      ...(state.isFocused ? { borderColor: GOLD, boxShadow: "none" } : {}),
      "@media (min-width: 640px)": {
        minHeight: 56,
      },
    }),
    valueContainer: (base) => ({
      ...base,
      paddingInline: 10,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#8A8A8A",
      fontWeight: 500,
      fontSize: 14,
      "@media (min-width: 640px)": {
        fontSize: 16,
      },
    }),
    singleValue: (base) => ({
      ...base,
      color: LABEL,
      fontWeight: 500,
      fontSize: 14,
      "@media (min-width: 640px)": {
        fontSize: 16,
      },
    }),
    input: (base) => ({
      ...base,
      color: LABEL,
      fontWeight: 500,
      fontSize: 14,
      margin: 0,
      padding: 0,
      "@media (min-width: 640px)": {
        fontSize: 16,
      },
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingInline: 10,
      color: LABEL,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 12,
      overflow: "hidden",
      zIndex: 20,
    }),
    option: (base, state) => ({
      ...base,
      fontWeight: 500,
      fontSize: 14,
      color: LABEL,
      backgroundColor: state.isSelected
        ? "#F6EFE7"
        : state.isFocused
          ? "#FBF7F2"
          : "#fff",
      cursor: "pointer",
      "@media (min-width: 640px)": {
        fontSize: 16,
      },
    }),
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!messageType) {
      setMessageTypeError(true);
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const messageTypeId = Number(messageType.value);
    if (!Number.isFinite(messageTypeId)) {
      setMessageTypeError(true);
      return;
    }

    setStatus("loading");
    try {
      await submitContactMessage(
        {
          name: String(formData.get("name") ?? ""),
          phone: toApiPhone(String(formData.get("phone") ?? "")),
          message_type_id: messageTypeId,
          subject: messageType.label,
          message: String(formData.get("message") ?? ""),
        },
        locale,
      );
      form.reset();
      setMessageType(null);
      setMessageTypeError(false);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const mapBlock = data.mapEmbedUrl ? (
    <div className="relative aspect-[4/3] w-full min-h-[220px] overflow-hidden rounded-[16px] sm:aspect-auto sm:min-h-[300px] sm:rounded-[20px] lg:min-h-full lg:h-full">
      <iframe
        title={t.mapTitle}
        src={data.mapEmbedUrl}
        className="absolute inset-0 h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  ) : null;

  const formBlock = (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-w-0 rounded-[16px] px-3 py-5 sm:rounded-[20px] sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      style={{ backgroundColor: FORM_BG }}
    >
      <h2
        className="text-[24px] font-bold leading-tight sm:text-[32px] md:text-[36px] lg:text-[46px]"
        style={{ color: TITLE }}
      >
        {data.title}
      </h2>
      <p
        className="mt-2 text-[14px] font-normal leading-6 sm:mt-3 sm:text-[17px] sm:leading-8 lg:text-[20px] lg:leading-9"
        style={{ color: TITLE }}
      >
        {data.description || t.description}
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3.5 sm:mt-8 sm:gap-5"
      >
        <label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <span
            className="text-[14px] font-bold sm:text-[16px]"
            style={{ color: LABEL }}
          >
            {t.nameLabel} <span className="text-[#E11D48]">*</span>
          </span>
          <div className="relative">
            <User
              className={`pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[#170F49] sm:h-5 sm:w-5 ${
                isAr ? "right-3 sm:right-4" : "left-3 sm:left-4"
              }`}
              strokeWidth={1.75}
            />
            <input
              name="name"
              required
              placeholder={t.namePlaceholder}
              className={`h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white text-[14px] font-medium text-[#170F49] outline-none placeholder:font-medium placeholder:text-[#8A8A8A] sm:h-14 sm:text-[16px] ${
                isAr ? "pr-10 pl-3 sm:pr-12 sm:pl-4" : "pl-10 pr-3 sm:pl-12 sm:pr-4"
              }`}
            />
          </div>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <span
            className="text-[14px] font-bold sm:text-[16px]"
            style={{ color: LABEL }}
          >
            {t.phoneLabel} <span className="text-[#E11D48]">*</span>
          </span>
          <div dir="ltr" className="flex min-w-0 gap-2">
            <div className="flex h-12 shrink-0 items-center gap-1.5 rounded-[12px] border border-[#D5AF34] bg-white px-2.5 sm:h-14 sm:gap-2 sm:px-3">
              <SaudiFlag className="h-3.5 w-5 sm:h-4 sm:w-6" />
              <span
                className="text-[13px] font-medium whitespace-nowrap sm:text-[15px]"
                style={{ color: LABEL }}
              >
                {t.countryCode}
              </span>
            </div>
            <div className="relative min-w-0 flex-1">
              <Phone
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#170F49] sm:left-4 sm:h-5 sm:w-5"
                strokeWidth={1.75}
              />
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                required
                placeholder={t.phonePlaceholder}
                className="h-12 w-full rounded-[12px] border border-[#D5AF34] bg-white pl-10 pr-3 text-left text-[14px] font-medium text-[#170F49] outline-none placeholder:font-medium placeholder:text-[#8A8A8A] sm:h-14 sm:pl-12 sm:pr-4 sm:text-[16px]"
              />
            </div>
          </div>
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <span
            className="text-[14px] font-bold sm:text-[16px]"
            style={{ color: LABEL }}
          >
            {t.messageTypeLabel} <span className="text-[#E11D48]">*</span>
          </span>
          <Select<MessageTypeOption, false>
            inputId={selectId}
            instanceId={selectId}
            options={options}
            value={messageType}
            onChange={(option) => {
              setMessageType(option);
              setMessageTypeError(false);
            }}
            placeholder={t.messageTypePlaceholder}
            isSearchable={false}
            isRtl={isAr}
            styles={selectStyles}
            components={{ DropdownIndicator }}
            classNamePrefix="contact-message-type"
            aria-invalid={messageTypeError || undefined}
          />
          {messageTypeError ? (
            <span className="text-[12px] font-medium text-[#E11D48] sm:text-[13px]">
              {dictionary.common.required}
            </span>
          ) : null}
        </label>

        <label className="flex min-w-0 flex-col gap-1.5 sm:gap-2">
          <span
            className="text-[14px] font-bold sm:text-[16px]"
            style={{ color: LABEL }}
          >
            {t.messageLabel} <span className="text-[#E11D48]">*</span>
          </span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder={t.messagePlaceholder}
            className="min-h-[110px] w-full resize-none rounded-[12px] border border-[#D5AF34] bg-white px-3 py-2.5 text-[14px] font-medium text-[#170F49] outline-none placeholder:font-medium placeholder:text-[#8A8A8A] sm:min-h-[140px] sm:px-4 sm:py-3 sm:text-[16px]"
          />
        </label>

        {status === "error" ? (
          <p className="text-[13px] font-medium text-[#E11D48]">{t.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-1 inline-flex h-12 w-full items-center justify-center rounded-[12px] text-[15px] font-bold text-[#133D3C] transition hover:brightness-105 disabled:opacity-70 sm:h-14 sm:text-[16px]"
          style={{ backgroundColor: GOLD }}
        >
          {t.submit}
        </button>
      </form>
    </div>
  );

  return (
    <section
      id="contact-form-section"
      className="overflow-hidden rounded-[16px] bg-white px-3 py-6 sm:rounded-[20px] sm:px-6 sm:py-12 lg:px-10 lg:py-20"
    >
      <div
        dir="ltr"
        className={`mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-4 sm:gap-6 xl:max-w-[1400px] ${
          data.mapEmbedUrl ? "lg:grid-cols-2 lg:gap-10 xl:gap-14" : ""
        }`}
      >
        {isAr ? (
          <>
            {mapBlock}
            {formBlock}
          </>
        ) : (
          <>
            {formBlock}
            {mapBlock}
          </>
        )}
      </div>
    </section>
  );
}
