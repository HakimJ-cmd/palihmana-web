import { Pilar, ArticleStatus, GeoScope } from "@prisma/client";

export interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  pilar: Pilar;
  geoScope?: GeoScope;
  status?: ArticleStatus;
  isFeatured?: boolean;
  coverImage?: string | null;
  coverAlt?: string | null;
  coverCredit?: string | null;
  readingMinutes?: number | null;
  summaryPoints?: string[];
  bodyJson?: any;
  bodyText?: string | null;
  publishedAt?: Date | string | null;
  contentUpdatedAt?: Date | string | null;
  lastVerifiedAt?: Date | string | null;
  author?: {
    name: string | null;
    avatar?: string | null;
  } | null;
  tags?: Array<{
    tag?: { id?: string; name: string; slug: string };
    name?: string;
  }>;
  corrections?: Array<{
    id: string;
    note?: string;
    correction?: string;
    createdAt: Date | string;
  }>;
}
