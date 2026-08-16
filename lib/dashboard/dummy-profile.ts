export type FamilyBankAccount = {
  id: string;
  bankName: string;
  bankNameEn: string;
  accountType: string;
  accountTypeEn: string;
  maskedNumber: string;
  initial: string;
  color: string;
};

export const DUMMY_FAMILY_BANK_ACCOUNTS: FamilyBankAccount[] = [
  {
    id: "ba1",
    bankName: "مصرف الراجحي",
    bankNameEn: "Al Rajhi Bank",
    accountType: "عام",
    accountTypeEn: "General",
    maskedNumber: "4511 **** **** 1231",
    initial: "R",
    color: "#1B5E20",
  },
  {
    id: "ba2",
    bankName: "بنك الرياض",
    bankNameEn: "Riyad Bank",
    accountType: "زكاة",
    accountTypeEn: "Zakat",
    maskedNumber: "5221 **** **** 8842",
    initial: "RB",
    color: "#0D47A1",
  },
  {
    id: "ba3",
    bankName: "البنك الأهلي",
    bankNameEn: "SNB",
    accountType: "عام",
    accountTypeEn: "General",
    maskedNumber: "6011 **** **** 3309",
    initial: "N",
    color: "#B71C1C",
  },
  {
    id: "ba4",
    bankName: "بنك الإنماء",
    bankNameEn: "Alinma Bank",
    accountType: "زكاة",
    accountTypeEn: "Zakat",
    maskedNumber: "4111 **** **** 7710",
    initial: "A",
    color: "#4A148C",
  },
];

/** Demo mobile that triggers "already registered" modal when saved. */
export const PROFILE_TAKEN_MOBILE = "0500000000";
