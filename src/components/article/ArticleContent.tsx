import React from "react";

interface TipTapNode {
  type: string;
  attrs?: Record<string, any>;
  content?: TipTapNode[];
  text?: string;
}

export function ArticleContent({ contentJson }: { contentJson?: string | null }) {
  if (!contentJson) {
    return (
      <div className="text-ink-muted italic">
        Belum ada isi konten untuk artikel ini.
      </div>
    );
  }

  let doc: TipTapNode | null = null;
  try {
    doc = JSON.parse(contentJson);
  } catch (e) {
    // If not JSON, it may be plain text or HTML
    return (
      <div className="prose max-w-none text-ink">
        <p>{contentJson}</p>
      </div>
    );
  }

  if (!doc || !doc.content) {
    return null;
  }

  const renderNode = (node: TipTapNode, index: number): React.ReactNode => {
    switch (node.type) {
      case "paragraph": {
        const textContent = node.content?.map((c) => c.text || "").join("") || "";
        return (
          <p key={index} className="mb-5 leading-relaxed text-ink">
            {textContent}
          </p>
        );
      }
      case "heading": {
        const level = node.attrs?.level || 2;
        const textContent = node.content?.map((c) => c.text || "").join("") || "";
        if (level === 2) {
          return (
            <h2 key={index} className="mt-8 mb-4 font-serif text-2xl font-bold tracking-tight text-ink">
              {textContent}
            </h2>
          );
        }
        return (
          <h3 key={index} className="mt-6 mb-3 font-serif text-xl font-semibold text-ink">
            {textContent}
          </h3>
        );
      }
      case "bulletList": {
        return (
          <ul key={index} className="mb-5 list-disc pl-6 space-y-2 text-ink">
            {node.content?.map((item, i) => renderNode(item, i))}
          </ul>
        );
      }
      case "orderedList": {
        return (
          <ol key={index} className="mb-5 list-decimal pl-6 space-y-2 text-ink">
            {node.content?.map((item, i) => renderNode(item, i))}
          </ol>
        );
      }
      case "listItem": {
        return (
          <li key={index}>
            {node.content?.map((child, i) => renderNode(child, i))}
          </li>
        );
      }
      case "blockquote": {
        return (
          <blockquote key={index} className="my-6 border-l-3 border-primary pl-4 italic text-ink-muted">
            {node.content?.map((child, i) => renderNode(child, i))}
          </blockquote>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="article-body font-sans text-[17px] leading-[1.7] text-ink sm:text-[18px]">
      {doc.content.map((node, i) => renderNode(node, i))}
    </div>
  );
}
