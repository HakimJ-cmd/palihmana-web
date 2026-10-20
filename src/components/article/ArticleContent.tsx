import React from "react";
import Image from "next/image";
import { sanitizeTipTapDoc, sanitizeUrl } from "@/lib/sanitize";

interface TipTapMark {
  type: string;
  attrs?: Record<string, any>;
}

interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  marks?: TipTapMark[];
  text?: string;
}

export function ArticleContent({ contentJson }: { contentJson?: string | Record<string, any> | null }) {
  if (!contentJson) {
    return (
      <div className="text-ink-muted italic">
        Belum ada isi konten untuk artikel ini.
      </div>
    );
  }

  let rawDoc: any = null;
  if (typeof contentJson === "string") {
    try {
      rawDoc = JSON.parse(contentJson);
    } catch (e) {
      // Plain text fallback (React escapes content safely, preventing HTML injection)
      return (
        <div className="article-body font-sans text-[17px] leading-[1.7] text-ink sm:text-[18px]">
          <p className="mb-5 leading-relaxed">{contentJson}</p>
        </div>
      );
    }
  } else if (typeof contentJson === "object") {
    rawDoc = contentJson;
  }

  // Deep sanitization against malicious attributes, javascript: URLs, and script injections
  const doc = sanitizeTipTapDoc(rawDoc);

  if (!doc || !Array.isArray(doc.content)) {
    return null;
  }

  const renderInlineContent = (nodes?: TipTapNode[]): React.ReactNode => {
    if (!nodes || !Array.isArray(nodes)) return null;

    return nodes.map((node, i) => {
      let textNode: React.ReactNode = node.text || "";

      if (node.marks && Array.isArray(node.marks)) {
        node.marks.forEach((mark) => {
          if (mark.type === "bold") {
            textNode = <strong key={`b-${i}`}>{textNode}</strong>;
          } else if (mark.type === "italic") {
            textNode = <em key={`i-${i}`}>{textNode}</em>;
          } else if (mark.type === "strike") {
            textNode = <s key={`s-${i}`}>{textNode}</s>;
          } else if (mark.type === "code") {
            textNode = (
              <code
                key={`c-${i}`}
                className="rounded bg-surface-alt px-1.5 py-0.5 font-mono text-xs text-primary"
              >
                {textNode}
              </code>
            );
          } else if (mark.type === "link") {
            const safeHref = sanitizeUrl(mark.attrs?.href);
            const isExternal = safeHref.startsWith("http");
            textNode = (
              <a
                key={`a-${i}`}
                href={safeHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="font-medium text-primary underline underline-offset-3 hover:text-primary-hover transition-colors"
              >
                {textNode}
              </a>
            );
          }
        });
      }

      return <React.Fragment key={i}>{textNode}</React.Fragment>;
    });
  };

  const renderNode = (node: TipTapNode, index: number): React.ReactNode => {
    switch (node.type) {
      case "paragraph": {
        return (
          <p key={index} className="mb-5 leading-relaxed text-ink">
            {renderInlineContent(node.content)}
          </p>
        );
      }
      case "heading": {
        const level = node.attrs?.level || 2;
        if (level === 2) {
          return (
            <h2
              key={index}
              className="mt-8 mb-4 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl"
            >
              {renderInlineContent(node.content)}
            </h2>
          );
        }
        if (level === 3) {
          return (
            <h3
              key={index}
              className="mt-6 mb-3 font-serif text-xl font-semibold text-ink sm:text-2xl"
            >
              {renderInlineContent(node.content)}
            </h3>
          );
        }
        return (
          <h4
            key={index}
            className="mt-5 mb-2 font-serif text-lg font-semibold text-ink"
          >
            {renderInlineContent(node.content)}
          </h4>
        );
      }
      case "bulletList": {
        return (
          <ul key={index} className="mb-6 list-disc pl-6 space-y-2 text-ink">
            {node.content?.map((item, i) => renderNode(item, i))}
          </ul>
        );
      }
      case "orderedList": {
        return (
          <ol key={index} className="mb-6 list-decimal pl-6 space-y-2 text-ink">
            {node.content?.map((item, i) => renderNode(item, i))}
          </ol>
        );
      }
      case "listItem": {
        return (
          <li key={index} className="leading-relaxed">
            {node.content?.map((child, i) => renderNode(child, i))}
          </li>
        );
      }
      case "blockquote": {
        return (
          <blockquote
            key={index}
            className="my-6 border-l-4 border-primary bg-primary/5 dark:bg-primary/10 py-3 px-4 italic text-ink rounded-r-lg"
          >
            {node.content?.map((child, i) => renderNode(child, i))}
          </blockquote>
        );
      }
      case "image": {
        const src = sanitizeUrl(node.attrs?.src);
        if (src === "#") return null;
        const alt = node.attrs?.alt || "Foto artikel Palihmana";
        const title = node.attrs?.title || "";

        return (
          <figure key={index} className="my-8 overflow-hidden rounded-xl border border-line bg-surface">
            <div className="relative aspect-video w-full">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover"
                unoptimized={src.startsWith("http")}
              />
            </div>
            {(alt || title) && (
              <figcaption className="p-3 text-center text-xs text-ink-muted border-t border-line">
                {title ? `${alt} — ${title}` : alt}
              </figcaption>
            )}
          </figure>
        );
      }
      case "table": {
        return (
          <div key={index} className="my-6 overflow-x-auto rounded-lg border border-line">
            <table className="w-full text-left text-sm text-ink border-collapse">
              {node.content?.map((child, i) => renderNode(child, i))}
            </table>
          </div>
        );
      }
      case "tableRow": {
        return (
          <tr key={index} className="border-b border-line hover:bg-surface-alt/50 transition-colors">
            {node.content?.map((child, i) => renderNode(child, i))}
          </tr>
        );
      }
      case "tableHeader": {
        return (
          <th key={index} className="bg-surface-alt px-4 py-3 font-semibold text-ink text-xs uppercase tracking-wider">
            {renderInlineContent(node.content)}
          </th>
        );
      }
      case "tableCell": {
        return (
          <td key={index} className="px-4 py-3 text-ink">
            {renderInlineContent(node.content)}
          </td>
        );
      }
      default:
        // Safely skip unrecognized node types
        return null;
    }
  };

  return (
    <div className="article-body font-sans text-[17px] leading-[1.7] text-ink sm:text-[18px]">
      {doc.content.map((node: TipTapNode, i: number) => renderNode(node, i))}
    </div>
  );
}
