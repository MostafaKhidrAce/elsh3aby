export type MarketProduct = {
  id: string;
  title: string;
  titleEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  price: number;
  images: string[];
};

const CERAMIC_1 =
  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1200&q=80";
const CERAMIC_2 =
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=1200&q=80";
const CERAMIC_3 =
  "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1200&q=80";
const VASE_1 =
  "https://images.unsplash.com/photo-1490312274585-df5c1ee5e59e?w=1200&q=80";
const POT_1 =
  "https://images.unsplash.com/photo-1459411552884-841db9b3cb2a?w=1200&q=80";

const DESC_AR =
  "هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.\n\nإذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية.";
const DESC_EN =
  "This is sample placeholder text that can be replaced in the same space. It describes a high-quality ceramic product crafted for home decoration and family heritage collections.\n\nAdditional paragraphs can be added as needed. The text is intended for UI demonstration only.";

export const DUMMY_MARKET_PRODUCTS: MarketProduct[] = [
  {
    id: "mp1",
    title: "منتج خزفي مزخرف",
    titleEn: "Decorated ceramic product",
    shortDescription: "منتج خزفي عالي الجودة لتزيين المنزل",
    shortDescriptionEn: "High-quality ceramic product for home decoration",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    category: "منتجات رمزية",
    categoryEn: "Symbolic products",
    price: 42,
    images: [CERAMIC_1, CERAMIC_2, CERAMIC_3],
  },
  {
    id: "mp2",
    title: "منتج خزفي مزخرف",
    titleEn: "Decorated ceramic product",
    shortDescription: "منتج خزفي عالي الجودة لتزيين المنزل",
    shortDescriptionEn: "High-quality ceramic product for home decoration",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    category: "منتجات رمزية",
    categoryEn: "Symbolic products",
    price: 42,
    images: [VASE_1, CERAMIC_1, CERAMIC_2],
  },
  {
    id: "mp3",
    title: "منتج خزفي مزخرف",
    titleEn: "Decorated ceramic product",
    shortDescription: "منتج خزفي عالي الجودة لتزيين المنزل",
    shortDescriptionEn: "High-quality ceramic product for home decoration",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    category: "منتجات رمزية",
    categoryEn: "Symbolic products",
    price: 42,
    images: [CERAMIC_2, CERAMIC_3, VASE_1],
  },
  {
    id: "mp4",
    title: "مشجرة العائلة",
    titleEn: "Family tree",
    shortDescription: "منتج تذكاري أنيق لعرض شجرة العائلة",
    shortDescriptionEn: "Elegant commemorative product to display the family tree",
    description: DESC_AR,
    descriptionEn: DESC_EN,
    category: "منتجات رمزية",
    categoryEn: "Symbolic products",
    price: 1000,
    images: [POT_1, CERAMIC_1, VASE_1],
  },
];

export function getMarketProductById(id: string): MarketProduct | undefined {
  return DUMMY_MARKET_PRODUCTS.find((p) => p.id === id);
}
