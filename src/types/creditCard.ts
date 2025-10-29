export interface CreditCard {
  _id: string;
  name: string;
  accountNumber: string;
  cardType: string;
  user: string;
  logo?: string; // Bank logo URL from API
  createdAt: string;
  updatedAt: string;
}

export interface BankInfo {
  bin: string;
  shortName: string;
  name: string;
  bankLogoUrl: string;
  isVietQr: boolean;
  isNapas: boolean;
  isDisburse: boolean;
}

// API Response interfaces
export interface BankInfoApiResponse {
  success: boolean;
  data: {
    code: string;
    desc: string;
    data: Array<{
      bin: string;
      shortName: string;
      name: string;
      logo: string; // API trả về 'logo', chúng ta sẽ map thành 'bankLogoUrl'
      isVietQr: boolean;
      isNapas: boolean;
      isDisburse: boolean;
    }>;
  };
}

export interface BankInfoResponse {
  code: string;
  desc: string;
  data: BankInfo[];
}

// Alternative response formats (để handle các format khác nhau từ API)
export interface AlternativeBankResponse {
  data: BankInfo[];
}

export interface BanksArrayResponse {
  banks: BankInfo[];
}