import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { BookmarkButton } from "@/components/article/BookmarkButton";
import { Badge } from "@/components/ui/Badge";
import { PILAR_LABELS, PILAR_SLUGS } from "@/lib/constants";
import { formatFreshness, estimateReadingTime } from "@/lib/utils";
import { ArticleItem } from "@/types";

interface ArticleCardProps {
  article: ArticleItem;
  variant?: "hero" | "standard" | "compact";
  priority?: boolean;
}

export function ArticleCard({
  article,
  variant = "standard",
  priority = false,
}: ArticleCardProps) {
  const pilarSlug = PILAR_SLUGS[article.pilar] || (article.pilar as string).toLowerCase().replace("_", "-");
  const pilarLabel = PILAR_LABELS[article.pilar] || (article.pilar as string);
  const articleUrl = `/${pilarSlug}/${article.slug}`;
  const isUtility = article.pilar === "UTILITY";

  const readingTime = article.readingMinutes || (
    article.bodyJson ? estimateReadingTime(JSON.stringify(article.bodyJson)) : 3
  );

  const freshness = formatFreshness(
    article.contentUpdatedAt ? new Date(article.contentUpdatedAt) : null,
    article.publishedAt ? new Date(article.publishedAt) : null,
    article.lastVerifiedAt ? new Date(article.lastVerifiedAt) : null
  );

  const imageUrl =
    article.coverImage ||
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop";
  const imageAlt = article.coverAlt || article.title;

  if (variant === "hero") {
    return (
      <article className="group relative flex flex-col overflow-hidden rounded border border-line bg-surface transition-all hover:border-ink-muted/40">
        <Link href={articleUrl} className="block relative aspect-video w-full overflow-hidden bg-surface-alt">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 800px"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </Link>

        <div className="flex flex-1 flex-col p-5 sm:p-6 lg:p-8">
          <div className="mb-3 flex items-center gap-2.5">
            <Badge variant={isUtility ? "utility" : "default"}>
              {pilarLabel}
            </Badge>
            <span className="text-xs text-ink-muted">·</span>
            <span className="flex items-center gap-1 text-xs text-ink-muted">
              <Clock className="h-3 w-3" /> {readingTime} mnt baca
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-ink group-hover:text-primary sm:text-3xl lg:text-4xl">
            <Link href={articleUrl}>{article.title}</Link>
          </h2>

          {article.subtitle && (
            <p className="mt-3 line-clamp-3 text-base text-ink-muted">
              {article.subtitle}
            </p>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              {article.author?.name && (
                <span className="font-medium text-ink">{article.author.name}</span>
              )}
              {article.author?.name && <span>·</span>}
              <span>{freshness}</span>
            </div>

            <BookmarkButton article={article} />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "compact") {
    return (
      <article className="group flex items-start gap-4 border-b border-line/60 py-4 last:border-b-0">
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <Badge variant={isUtility ? "utility" : "outline"} size="sm">
              {pilarLabel}
            </Badge>
            <span className="text-[11px] text-ink-muted">· {readingTime} mnt</span>
          </div>

          <h3 className="font-serif text-base font-semibold leading-snug text-ink group-hover:text-primary sm:text-lg">
            <Link href={articleUrl} className="line-clamp-2">
              {article.title}
            </Link>
          </h3>

          <div className="mt-2 text-xs text-ink-muted">
            <span>{freshness}</span>
          </div>
        </div>

        <Link
          href={articleUrl}
          className="relative aspect-video w-24 shrink-0 overflow-hidden rounded bg-surface-alt sm:w-32"
        >
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="128px"
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      </article>
    );
  }

  // Standard vertical card
  return (
    <article className="group flex flex-col overflow-hidden rounded border border-line bg-surface transition-all hover:border-ink-muted/40">
      <Link href={articleUrl} className="relative aspect-video w-full overflow-hidden bg-surface-alt">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={priority ? "eager" : "lazy"}
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant={isUtility ? "utility" : "default"}>
            {pilarLabel}
          </Badge>
          <span className="text-xs text-ink-muted">·</span>
          <span className="text-xs text-ink-muted">{readingTime} mnt baca</span>
        </div>

        <h3 className="line-clamp-3 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-primary sm:text-xl">
          <Link href={articleUrl}>{article.title}</Link>
        </h3>

        {article.subtitle && (
          <p className="mt-2 line-clamp-2 text-xs text-ink-muted sm:text-sm">
            {article.subtitle}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-line/60 pt-3 text-xs text-ink-muted">
          <span>{freshness}</span>
          <BookmarkButton article={article} size="sm" />
        </div>
      </div>
    </article>
  );
}
