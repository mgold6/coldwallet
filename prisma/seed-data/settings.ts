export type SystemSettingSeed = {
  key: string;
  value: string;
  description: string;
};

export const settings: SystemSettingSeed[] = [
  {
    key: "site_name",
    value: "ColdWallet",
    description: "Application name",
  },
  {
    key: "maintenance_mode",
    value: "false",
    description: "Enable maintenance mode",
  },
  {
    key: "registration_enabled",
    value: "true",
    description: "Allow new user registrations",
  },
  {
    key: "deposits_enabled",
    value: "true",
    description: "Allow deposits",
  },
  {
    key: "withdrawals_enabled",
    value: "true",
    description: "Allow withdrawals",
  },
  {
    key: "default_currency",
    value: "USD",
    description: "Default fiat currency",
  },
  {
    key: "support_email",
    value: "support@coldwallet.io",
    description: "Support email address",
  },
  {
    key: "company_name",
    value: "ColdWallet",
    description: "Company name",
  },
  {
    key: "kyc_required",
    value: "false",
    description: "Require KYC before withdrawals",
  },
];