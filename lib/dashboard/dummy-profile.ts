export type FamilyBankAccount = {
  id: string;
  bankName: string;
  bankNameEn: string;
  accountType: string;
  accountTypeEn: string;
  accountNumber: string;
  logoUrl: string | null;
  initial: string;
  color: string;
};

export const DUMMY_FAMILY_BANK_ACCOUNTS: FamilyBankAccount[] = [
  {
    id: "ba1",
    bankName: "مصرف الراجحي",
    bankNameEn: "Al Rajhi Bank",
    accountType: "اشتراكات",
    accountTypeEn: "Subscriptions",
    accountNumber: "SA28800000515608010911111",
    logoUrl: null,
    initial: "ر",
    color: "#1B5E20",
  },
  {
    id: "ba2",
    bankName: "مصرف الراجحي",
    bankNameEn: "Al Rajhi Bank",
    accountType: "صدقة",
    accountTypeEn: "Charity",
    accountNumber: "SA32800000515608010984662",
    logoUrl: null,
    initial: "ر",
    color: "#0D47A1",
  },
  {
    id: "ba3",
    bankName: "مصرف الراجحي",
    bankNameEn: "Al Rajhi Bank",
    accountType: "زكاة",
    accountTypeEn: "Zakat",
    accountNumber: "SA8080000051560801065617",
    logoUrl: null,
    initial: "ر",
    color: "#B71C1C",
  },
];

/** Demo mobile that triggers "already registered" modal when saved. */
export const PROFILE_TAKEN_MOBILE = "0500000000";
