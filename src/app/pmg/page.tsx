import React from "react";
import { getPmgItems } from "@/modules/pmg/queries";
import { PmgClientView } from "@/components/pmg/PmgClientView";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "PMG — Palihmana Gaming, Mainan & Komunitas Pop Culture",
  description:
    "Zona khusus gaming, review jujur, koleksi mainan (gunpla, diecast), turnamen esports lokal Tasikmalaya, dan komunitas mabar. Bagian dari ekosistem Palihmana.id.",
  openGraph: {
    title: "PMG — Palihmana Gaming & Toys Tasikmalaya",
    description:
      "Ulasan game, koleksi mainan hobi, turnamen esports lokal, dan ruang mabar seru di Priangan Timur.",
    url: `${SITE_CONFIG.url}/pmg`,
    siteName: "Palihmana.id",
    locale: "id_ID",
    type: "website",
  },
};

export const revalidate = 60; // ISR cache 60 seconds

export default async function PmgPage() {
  const items = await getPmgItems();

  return (
    <main className="w-full">
      <PmgClientView initialItems={items} />
    </main>
  );
}
