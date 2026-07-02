export type BrandKey = "kindhealth" | "jaalyantra";

export type BrandConfig = {
  key: BrandKey;
  wordmark: string;
  shortName: string;
  tagline: string;
  platformBrandName: string;
  raise: { amount: string; round: string; year: number };
  emails: { primary: string; founder: string };
  geographies: string[];
  seo: {
    name: string;
    domain: string;
    description: string;
  };
};

const BRANDS: Record<BrandKey, BrandConfig> = {
  kindhealth: {
    key: "kindhealth",
    wordmark: "Kind Health",
    shortName: "Kind",
    tagline: "A confidence engine for custom clothing.",
    platformBrandName: "JaalYantra",
    raise: { amount: "€500K", round: "Seed", year: 2026 },
    emails: { primary: "hi@kindhealth.com", founder: "saransh@kindhealth.com" },
    geographies: ["Florence", "Bagru", "Sydney"],
    seo: {
      name: "Kind Health Tech",
      domain: "kindhealth.com",
      description:
        "A garment with provenance, made by hands you can name. Kind Health Tech is the production OS for fashion — design, produce, and sell with verifiable traceability.",
    },
  },
  jaalyantra: {
    key: "jaalyantra",
    wordmark: "Jaal Yantra",
    shortName: "JYT",
    tagline: "Three surfaces. One source of truth.",
    platformBrandName: "JaalYantra",
    raise: { amount: "€500K", round: "Seed", year: 2026 },
    emails: { primary: "hi@jaalyantra.com", founder: "saransh@jaalyantra.com" },
    geographies: ["Florence", "Bagru", "Sydney"],
    seo: {
      name: "Jaal Yantra Textiles",
      domain: "jaalyantra.com",
      description:
        "A garment with provenance, made by hands you can name. JYT is the production OS for fashion — design, produce, and sell with verifiable traceability.",
    },
  },
};

export function brandFromHost(host: string | null | undefined): BrandConfig {
  if (!host) return BRANDS.jaalyantra;
  if (host.toLowerCase().includes("kindhealth")) return BRANDS.kindhealth;
  return BRANDS.jaalyantra;
}

export function brandFromKey(key: string | null | undefined): BrandConfig {
  if (key === "kindhealth" || key === "jaalyantra") return BRANDS[key];
  return BRANDS.jaalyantra;
}

export function brandFromHostOrOverride(
  host: string | null | undefined,
  override?: string | null,
): BrandConfig {
  if (override === "kindhealth" || override === "jaalyantra") return BRANDS[override];
  return brandFromHost(host);
}

export { BRANDS };
