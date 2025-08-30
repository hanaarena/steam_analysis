type RangeKey =
  | "steamkey_positive"
  | "purchased_positive"
  | "steamkey_negative"
  | "purchased_negative";

type RangeData = {
  label: string;
  values: Record<RangeKey, number>;
};

interface ISaleStat {
  steamId: string;
  headerImageUrl: string;
  capsuleImageUrl: string;
  name: string;
  description: string;
  price: number;
  reviews: number;
  reviewsSteam: number;
  followers: number;
  avgPlaytime: number;
  reviewScore: number;
  tags: string[];
  genres: string[];
  features: string[];
  languages: string[];
  developers: string[];
  publishers: string[];
  releaseDate: number;
  EAReleaseDate: number;
  firstReleaseDate: number;
  unreleased: boolean;
  earlyAccess: boolean;
  countryData: Record<string, number>;
  playtimeData: boolean;
  history: SaleStatHistory[];
  copiesSold: number;
  revenue: number;
  totalRevenue: boolean;
  players: number;
  owners: number;
  steamPercent: number;
  accuracy: number;
  estimateDetails: SaleEstimateDetails;
  wishlists: boolean;
  itemType: string;
  itemCode: number;
  dlc: SaleStatDlc[];
}

interface SaleStatHistory {
  timeStamp: number;
  reviews: number;
  price: number;
  followers: number;
  wishlists: boolean;
  players: number;
  sales: number;
  revenue: number;
  topWish?: number;
  score?: number;
  rank?: number;
  avgPlaytime?: number;
  release?: boolean;
}

interface SaleEstimateDetails {
  rankBased: number;
  playtimeBased: number;
  reviewBased: number;
}

interface SaleStatDlc {
  steamId: number;
  name: string;
  headerUrl: string;
  releaseDate: number;
  price: number;
  genres: string[];
}
