import React, { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag, User, X, Plus, Minus, ArrowLeft, Check, Package,
  Heart, Home, Grid3x3, Bell, Star, Link2, Gift, ChevronRight, Truck,
  Settings, Trash2, Pencil, Lock, Tag
} from "lucide-react";
import { supabase } from "./lib/supabase";

const INK = "#14171F";
const COBALT = "#2B4EFF";
const PAPAYA = "#FF6B35";
const JADE = "#1F9D75";
const PAPER = "#F7F6F3";
const MUTED = "#8A877D";
const CARD = "#EDEAE3";

const BRANDS = [
  "Hollister", "Princess Polly", "Abercrombie & Fitch", "American Eagle", "Aerie",
  "Brandy Melville", "PacSun", "Edikted", "SKIMS", "Nike", "Adidas", "New Balance",
  "Coach", "Sephora", "Ulta Beauty", "Rhode", "Rare Beauty", "Sol de Janeiro",
  "CeraVe", "The Ordinary", "Paula's Choice", "La Roche-Posay", "Stanley", "Owala",
];

const BRAND_COLOR = {
  "Hollister": "#C9CFE0", "Princess Polly": "#E7C6D0", "Abercrombie & Fitch": "#D3C9BC",
  "American Eagle": "#BFD3E0", "Aerie": "#F0D3DC", "Brandy Melville": "#E5DCD0",
  "PacSun": "#CFE0DA", "Edikted": "#D6C9DE", "SKIMS": "#D9C9BE", "Nike": "#D8D5CC",
  "Adidas": "#CBD2D6", "New Balance": "#D6D9C9", "Coach": "#E3D2C3", "Sephora": "#1A1A1A",
  "Ulta Beauty": "#EAD4E0", "Rhode": "#F3D4C6", "Rare Beauty": "#E8C7CE",
  "Sol de Janeiro": "#FCE8B8", "CeraVe": "#F6DDBE", "The Ordinary": "#DCDCDC",
  "Paula's Choice": "#CDE0DC", "La Roche-Posay": "#C6DCE0", "Stanley": "#C6DCE0", "Owala": "#C9D9EE",
};

const DEFAULT_PRODUCTS = [
  { id: "h1", brand: "Hollister", name: "Áo Hoodie Nỉ Half-Zip", price: 54, img: null, cat: "Thời trang", sizes: "S, M, L, XL", rating: 4.8 },
  { id: "h2", brand: "Hollister", name: "Quần Jeans Baggy Cạp Cao", price: 68, img: null, cat: "Thời trang", sizes: "26, 27, 28, 29", rating: 4.6 },
  { id: "p1", brand: "Princess Polly", name: "Đầm Mini Belles", price: 79, img: null, cat: "Thời trang", sizes: "XS, S, M", rating: 4.9 },
  { id: "af1", brand: "Abercrombie & Fitch", name: "Áo Len Cổ Lọ", price: 72, img: null, cat: "Thời trang", sizes: "XS, S, M, L", rating: 4.7 },
  { id: "ae1", brand: "American Eagle", name: "Quần Short Denim", price: 39, img: null, cat: "Thời trang", sizes: "26, 28, 30", rating: 4.5 },
  { id: "ar1", brand: "Aerie", name: "Áo Bra Thể Thao", price: 32, img: null, cat: "Thời trang", sizes: "S, M, L", rating: 4.6 },
  { id: "bm1", brand: "Brandy Melville", name: "Áo Croptop Basic", price: 26, img: null, cat: "Thời trang", sizes: "One size", rating: 4.4 },
  { id: "ps1", brand: "PacSun", name: "Quần Jeans Ống Rộng", price: 58, img: null, cat: "Thời trang", sizes: "28, 30, 32", rating: 4.5 },
  { id: "ed1", brand: "Edikted", name: "Đầm Ôm Dáng", price: 62, img: null, cat: "Thời trang", sizes: "XS, S, M", rating: 4.6 },
  { id: "sk1", brand: "SKIMS", name: "Áo Bra Fits Everybody", price: 48, img: null, cat: "Thời trang", sizes: "S, M, L", rating: 4.7 },
  { id: "n1", brand: "Nike", name: "Giày Air Force 1", price: 110, img: null, cat: "Giày dép", sizes: "36, 37, 38, 39", rating: 4.9 },
  { id: "ad1", brand: "Adidas", name: "Giày Samba OG", price: 100, img: null, cat: "Giày dép", sizes: "36, 37, 38, 39", rating: 4.8 },
  { id: "nb1", brand: "New Balance", name: "Giày 550", price: 120, img: null, cat: "Giày dép", sizes: "36, 37, 38", rating: 4.7 },
  { id: "cc1", brand: "Coach", name: "Túi Đeo Chéo Tabby", price: 195, img: null, cat: "Túi xách", sizes: "", rating: 4.9 },
  { id: "sp1", brand: "Sephora", name: "Bảng Phấn Mắt Sephora Collection", price: 28, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.5 },
  { id: "ub1", brand: "Ulta Beauty", name: "Cọ Trang Điểm Bộ 5 Món", price: 24, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.4 },
  { id: "rh1", brand: "Rhode", name: "Peptide Lip Treatment", price: 20, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.8 },
  { id: "rb1", brand: "Rare Beauty", name: "Soft Pinch Liquid Blush", price: 23, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.9 },
  { id: "sdj1", brand: "Sol de Janeiro", name: "Bum Bum Cream 240ml", price: 48, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.9 },
  { id: "cr1", brand: "CeraVe", name: "Kem Dưỡng Ẩm Ceramide", price: 22, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.7 },
  { id: "to1", brand: "The Ordinary", name: "Niacinamide 10% + Zinc 1%", price: 12, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.6 },
  { id: "pc1", brand: "Paula's Choice", name: "BHA Liquid Exfoliant", price: 36, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.8 },
  { id: "lrp1", brand: "La Roche-Posay", name: "Kem Chống Nắng Anthelios", price: 26, img: null, cat: "Chăm sóc da", sizes: "", rating: 4.7 },
  { id: "st1", brand: "Stanley", name: "Bình Giữ Nhiệt Quencher 40oz", price: 45, img: null, cat: "Lifestyle", sizes: "", rating: 4.6 },
  { id: "ow1", brand: "Owala", name: "Bình Nước FreeSip 24oz", price: 33, img: null, cat: "Lifestyle", sizes: "", rating: 4.7 },
];

const CATEGORIES = ["Tất cả", "Thời trang", "Chăm sóc da", "Giày dép", "Túi xách", "Lifestyle"];
// Admin access is now handled by Supabase Auth (see tryAdminLogin below) —
// there is no hardcoded passcode anymore.

const FX = 25400;
const SERVICE_RATE = 0.12;
const SHIP_FLAT = 14;

function money(usd) { return `$${usd.toFixed(2)}`; }
function vnd(usd) { return `≈₫${Math.round(usd * FX).toLocaleString("en-US")}`; }
function randomId() { return "p" + Math.random().toString(36).slice(2, 9); }
function brandColor(b) { return BRAND_COLOR[b] || "#DDD"; }

function Stamp({ size = 96 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
      <circle cx="50" cy="50" r="46" fill="none" stroke={JADE} strokeWidth="2.5" strokeDasharray="4 3" />
      <circle cx="50" cy="50" r="38" fill="none" stroke={JADE} strokeWidth="1.5" />
      <text x="50" y="42" textAnchor="middle" fill={JADE} fontSize="8.5" fontFamily="'IBM Plex Mono', monospace" fontWeight="600" letterSpacing="1">CHÍNH HÃNG</text>
      <text x="50" y="56" textAnchor="middle" fill={JADE} fontSize="8.5" fontFamily="'IBM Plex Mono', monospace" fontWeight="600" letterSpacing="1">100%</text>
      <text x="50" y="70" textAnchor="middle" fill={JADE} fontSize="7" fontFamily="'IBM Plex Mono', monospace" letterSpacing="2">USA ⟶ VN</text>
    </svg>
  );
}

function ProductImage({ product, rounded = true }) {
  if (product.img) {
    return (
      <img src={product.img} alt={product.name} className={rounded ? "rounded-2xl" : ""}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
        onError={(e) => { e.target.style.display = "none"; }} />
    );
  }
  return <div className={rounded ? "rounded-2xl" : ""} style={{ background: product.color || brandColor(product.brand), width: "100%", height: "100%" }} />;
}

const TRACKING_STEPS = [
  { key: "mua", label: "Đã mua tại Mỹ" },
  { key: "nhapkho", label: "Nhập kho" },
  { key: "quocte", label: "Vận chuyển quốc tế" },
  { key: "thongquan", label: "Thông quan" },
  { key: "giao", label: "Giao hàng thành công" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [view, setView] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [payMethod, setPayMethod] = useState("momo");
  const [orderNum] = useState(() => "XIN-" + Math.floor(100000 + Math.random() * 900000));
  const [linkInput, setLinkInput] = useState("");
  const [linkSubmitted, setLinkSubmitted] = useState(false);

  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmailInput, setAdminEmailInput] = useState("");
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [linkFetchLoading, setLinkFetchLoading] = useState(false);
  const [linkFetchInput, setLinkFetchInput] = useState("");

  // Load products from Supabase (falls back to the built-in demo list if the
  // table is empty or Supabase isn't reachable yet, so the app never looks broken).
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at");
      if (!error && data && data.length > 0) {
        setProducts(data);
      } else {
        setProducts(DEFAULT_PRODUCTS);
      }
      setLoadingProducts(false);
    })();

    // Restore admin session if the browser already has one (Supabase persists it)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setIsAdmin(true);
    });
  }, []);

  async function refreshProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at");
    if (data) setProducts(data);
  }
  async function upsertProduct(p) {
    setSavingProduct(true);
    const { error } = await supabase.from("products").upsert(p);
    if (error) { console.error(error); setSavingProduct(false); return; }
    await refreshProducts();
    setSavingProduct(false);
    setEditingProduct(null);
  }
  async function deleteProduct(id) {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  // Paste a product link → calls our /api/fetch-product serverless function →
  // pre-fills the form with photo/name/price so the admin just double-checks it.
  async function fetchFromLink() {
    if (!linkFetchInput) return;
    setLinkFetchLoading(true);
    try {
      const res = await fetch(`/api/fetch-product?url=${encodeURIComponent(linkFetchInput)}`);
      const data = await res.json();
      setEditingProduct((prev) => ({
        ...(prev || { id: randomId(), brand: BRANDS[0], cat: CATEGORIES[1], sizes: "", rating: 5 }),
        name: data.name || prev?.name || "",
        img: data.img || prev?.img || "",
        price: data.price ?? prev?.price ?? 0,
        source_url: linkFetchInput,
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setLinkFetchLoading(false);
    }
  }

  const filtered = useMemo(() => (activeCategory === "Tất cả" ? products : products.filter((p) => p.cat === activeCategory)), [activeCategory, products]);
  const brandProducts = useMemo(() => products.filter((p) => p.brand === selectedBrand), [products, selectedBrand]);

  const cartItems = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((c) => c.product);
  const subtotal = cartItems.reduce((s, c) => s + c.product.price * c.qty, 0);
  const serviceFee = subtotal * SERVICE_RATE;
  const shipping = cartItems.length ? SHIP_FLAT : 0;
  const total = subtotal + serviceFee + shipping;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(id) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing) return prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id, qty: 1 }];
    });
  }
  function changeQty(id, delta) { setCart((prev) => prev.map((c) => (c.id === id ? { ...c, qty: c.qty + delta } : c)).filter((c) => c.qty > 0)); }
  function toggleWishlist(id) { setWishlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id])); }
  function goCheckout() { if (!loggedIn) { setShowLogin(true); return; } setView("checkout"); }
  async function placeOrder() {
    await supabase.from("orders").insert({
      customer_email: email || null,
      items: cartItems.map((c) => ({ id: c.id, name: c.product.name, qty: c.qty, price: c.product.price })),
      subtotal, total, payment_method: payMethod,
    });
    setView("confirmation");
    setCart([]);
  }
  async function startStripeCheckout() {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems, total }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }
  async function tryAdminLogin() {
    setAdminError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: adminEmailInput,
      password: adminPasswordInput,
    });
    if (error) { setAdminError("Sai email hoặc mật khẩu."); return; }
    setIsAdmin(true);
    setView("admin");
  }
  async function adminLogout() {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setView(null);
  }
  function openProduct(p) { setSelectedProduct(p); setSelectedSize(null); setView("product"); }
  function openBrand(b) { setSelectedBrand(b); setView("brand"); }

  const wishItems = products.filter((p) => wishlist.includes(p.id));

  const navItems = [
    { key: "home", icon: Home, label: "Trang chủ" },
    { key: "categories", icon: Grid3x3, label: "Danh mục" },
    { key: "cart", icon: ShoppingBag, label: "Giỏ hàng", badge: cartCount },
    { key: "wishlist", icon: Heart, label: "Yêu thích", badge: wishlist.length },
    { key: "profile", icon: User, label: "Hồ sơ" },
  ];

  return (
    <div style={{ background: PAPER, minHeight: "100%", fontFamily: "'Inter', system-ui, sans-serif", color: INK, paddingBottom: 72 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');`}</style>

      <header className="flex items-center justify-between px-5 py-4 sticky top-0 z-20" style={{ background: PAPER, borderBottom: "1px solid #E4E1DA" }}>
        <button onClick={() => { setTab("home"); setView(null); }} style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold tracking-tight">
          XỊN<span style={{ color: PAPAYA }}>.</span>
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => setView("muaho")}><Link2 size={19} /></button>
          <button><Bell size={19} /></button>
          <button onClick={() => (isAdmin ? setView("admin") : setView("adminlogin"))} title="Quản trị"><Settings size={19} /></button>
          <button onClick={() => setShowLogin(true)} className="flex items-center gap-1.5 text-sm font-medium"><User size={18} /></button>
        </div>
      </header>

      {!view && tab === "home" && (
        <main className="max-w-5xl mx-auto px-5 py-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: JADE, fontFamily: "'IBM Plex Mono', monospace" }}>Hàng thật · Từ Mỹ về VN</p>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-3xl font-bold leading-tight max-w-md mb-2">Đồ chính hãng Mỹ, mua tận nơi, ship về Việt Nam.</h1>
          <p className="text-sm max-w-md mb-6" style={{ color: MUTED }}>Không hàng giả, không hàng nhái — mọi đơn hàng đều được mua trực tiếp và kiểm tra trước khi gửi về.</p>

          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide" style={{ color: MUTED }}>Thương hiệu</h2>
            <button onClick={() => setView("brands")} className="text-xs font-semibold flex items-center gap-0.5" style={{ color: COBALT }}>Xem tất cả <ChevronRight size={13} /></button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
            {BRANDS.map((b) => (
              <button key={b} onClick={() => openBrand(b)} className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap" style={{ background: CARD }}>{b}</button>
            ))}
          </div>

          <h2 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: MUTED }}>Đang thịnh hành</h2>
          {loadingProducts ? <p className="text-sm" style={{ color: MUTED }}>Đang tải sản phẩm...</p> :
            <ProductGrid products={products.slice(0, 8)} wishlist={wishlist} toggleWishlist={toggleWishlist} onSelect={openProduct} />}
        </main>
      )}

      {/* ALL BRANDS GRID */}
      {view === "brands" && (
        <main className="max-w-5xl mx-auto px-5 py-6">
          <button onClick={() => setView(null)} className="flex items-center gap-1 text-sm font-medium mb-5"><ArrowLeft size={16} /> Quay lại</button>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-5">Tất cả thương hiệu</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BRANDS.map((b) => {
              const count = products.filter((p) => p.brand === b).length;
              return (
                <button key={b} onClick={() => openBrand(b)} className="rounded-2xl p-4 text-left" style={{ background: CARD }}>
                  <div className="w-9 h-9 rounded-full mb-3" style={{ background: brandColor(b) }} />
                  <p className="text-sm font-semibold leading-snug mb-0.5">{b}</p>
                  <p className="text-xs" style={{ color: MUTED }}>{count} sản phẩm</p>
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* SINGLE BRAND PAGE */}
      {view === "brand" && selectedBrand && (
        <main className="max-w-5xl mx-auto px-5 py-6">
          <button onClick={() => setView("brands")} className="flex items-center gap-1 text-sm font-medium mb-5"><ArrowLeft size={16} /> Tất cả thương hiệu</button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex-shrink-0" style={{ background: brandColor(selectedBrand) }} />
            <div>
              <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold">{selectedBrand}</h1>
              <p className="text-xs" style={{ color: MUTED }}>{brandProducts.length} sản phẩm chính hãng có sẵn</p>
            </div>
          </div>
          {brandProducts.length === 0 ? (
            <div className="rounded-2xl p-6 text-center" style={{ background: CARD }}>
              <Tag size={22} className="mx-auto mb-2" style={{ color: MUTED }} />
              <p className="text-sm font-medium mb-1">Chưa có sản phẩm {selectedBrand} trong danh mục</p>
              <p className="text-xs mb-4" style={{ color: MUTED }}>Dán liên kết sản phẩm bạn muốn, chúng tôi sẽ báo giá cho bạn.</p>
              <button onClick={() => setView("muaho")} className="py-2 px-4 rounded-lg font-semibold text-white text-sm" style={{ background: COBALT }}>Yêu cầu mua hộ</button>
            </div>
          ) : (
            <ProductGrid products={brandProducts} wishlist={wishlist} toggleWishlist={toggleWishlist} onSelect={openProduct} />
          )}
        </main>
      )}

      {!view && tab === "categories" && (
        <main className="max-w-5xl mx-auto px-5 py-6">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-4">Danh mục</h1>
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap"
                style={activeCategory === cat ? { background: INK, color: "#fff" } : { background: CARD, color: INK }}>{cat}</button>
            ))}
          </div>
          <ProductGrid products={filtered} wishlist={wishlist} toggleWishlist={toggleWishlist} onSelect={openProduct} />
        </main>
      )}

      {!view && tab === "wishlist" && (
        <main className="max-w-5xl mx-auto px-5 py-6">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-4">Sản phẩm yêu thích</h1>
          {wishItems.length === 0 ? <p className="text-sm" style={{ color: MUTED }}>Chưa có sản phẩm yêu thích nào.</p> :
            <ProductGrid products={wishItems} wishlist={wishlist} toggleWishlist={toggleWishlist} onSelect={openProduct} />}
        </main>
      )}

      {!view && tab === "cart" && (
        <main className="max-w-2xl mx-auto px-5 py-6">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-5">Giỏ hàng</h1>
          {cartItems.length === 0 ? <p className="text-sm" style={{ color: MUTED }}>Giỏ hàng trống.</p> : (
            <>
              <div className="space-y-4 mb-6">
                {cartItems.map((c) => (
                  <div key={c.id} className="flex items-center gap-4">
                    <div className="rounded-xl w-16 h-16 flex-shrink-0 overflow-hidden"><ProductImage product={c.product} rounded={false} /></div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold" style={{ color: MUTED }}>{c.product.brand}</p>
                      <p className="text-sm font-medium">{c.product.name}</p>
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-sm">{money(c.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full px-1" style={{ background: CARD }}>
                      <button onClick={() => changeQty(c.id, -1)} className="w-7 h-7 flex items-center justify-center"><Minus size={13} /></button>
                      <span className="text-sm w-4 text-center">{c.qty}</span>
                      <button onClick={() => changeQty(c.id, 1)} className="w-7 h-7 flex items-center justify-center"><Plus size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-4 space-y-2" style={{ background: CARD }}>
                <Row label="Tạm tính" value={money(subtotal)} />
                <Row label="Phí dịch vụ (12%)" value={money(serviceFee)} />
                <Row label="Phí vận chuyển về VN" value={money(shipping)} />
                <div style={{ borderTop: "1px solid #D6D2C8", margin: "8px 0" }} />
                <Row label="Tổng cộng" value={money(total)} sub={vnd(total)} bold />
              </div>
              <button onClick={goCheckout} className="w-full mt-5 py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2" style={{ background: INK }}>Thanh toán <ChevronRight size={16} /></button>
            </>
          )}
        </main>
      )}

      {!view && tab === "profile" && (
        <main className="max-w-lg mx-auto px-5 py-6">
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-5">Hồ sơ cá nhân</h1>
          <div className="rounded-2xl p-4 mb-4 flex items-center justify-between" style={{ background: CARD }}>
            <div>
              <p className="text-sm font-semibold">{loggedIn ? email : "Chưa đăng nhập"}</p>
              <p className="text-xs" style={{ color: MUTED }}>Hạng thành viên: Bạc · 120 điểm</p>
            </div>
            <Gift size={20} style={{ color: PAPAYA }} />
          </div>
          {[
            { label: "Địa chỉ nhận hàng", note: "Quản lý địa chỉ giao hàng của bạn" },
            { label: "Phương thức thanh toán", note: "MoMo, ZaloPay, VNPay, thẻ, chuyển khoản" },
            { label: "Lịch sử đơn hàng", note: "Xem lại các đơn đã mua", action: () => setView("tracking") },
            { label: "Quản trị viên (Admin)", note: "Thêm/sửa sản phẩm, giá, hình ảnh", action: () => (isAdmin ? setView("admin") : setView("adminlogin")) },
            { label: "Hỗ trợ", note: "Trò chuyện trực tiếp, câu hỏi thường gặp" },
          ].map((item) => (
            <button key={item.label} onClick={item.action} className="w-full flex items-center justify-between py-3" style={{ borderBottom: "1px solid #E4E1DA" }}>
              <div className="text-left"><p className="text-sm font-medium">{item.label}</p><p className="text-xs" style={{ color: MUTED }}>{item.note}</p></div>
              <ChevronRight size={16} style={{ color: MUTED }} />
            </button>
          ))}
        </main>
      )}

      {view === "product" && selectedProduct && (
        <main className="max-w-2xl mx-auto px-5 py-6">
          <button onClick={() => setView(selectedBrand === selectedProduct.brand ? "brand" : null)} className="flex items-center gap-1 text-sm font-medium mb-5"><ArrowLeft size={16} /> Quay lại</button>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="rounded-2xl aspect-square overflow-hidden"><ProductImage product={selectedProduct} /></div>
            <div>
              <div className="flex items-start justify-between">
                <button onClick={() => openBrand(selectedProduct.brand)} className="text-xs uppercase tracking-wide font-semibold" style={{ color: MUTED }}>{selectedProduct.brand}</button>
                <button onClick={() => toggleWishlist(selectedProduct.id)}>
                  <Heart size={20} fill={wishlist.includes(selectedProduct.id) ? PAPAYA : "none"} color={wishlist.includes(selectedProduct.id) ? PAPAYA : INK} />
                </button>
              </div>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mt-1 mb-1">{selectedProduct.name}</h2>
              <div className="flex items-center gap-1 mb-2">
                <Star size={13} fill={PAPAYA} color={PAPAYA} />
                <span className="text-xs" style={{ color: MUTED }}>{selectedProduct.rating} · Đánh giá từ khách đã mua</span>
              </div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace" }} className="text-lg mb-4">{money(selectedProduct.price)} <span style={{ color: MUTED, fontSize: 14 }}>{vnd(selectedProduct.price)}</span></p>

              {selectedProduct.sizes && (
                <div className="mb-4">
                  <p className="text-xs font-semibold mb-2" style={{ color: MUTED }}>Kích thước có sẵn</p>
                  <div className="flex gap-2 flex-wrap">
                    {selectedProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                      <button key={s} onClick={() => setSelectedSize(s)} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                        style={selectedSize === s ? { background: INK, color: "#fff" } : { background: CARD }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: CARD }}>
                <Stamp size={54} />
                <p className="text-xs" style={{ color: MUTED }}>Mua trực tiếp từ website chính hãng của {selectedProduct.brand}, kiểm tra kỹ trước khi gửi về — không qua trung gian.</p>
              </div>
              <div className="flex items-center gap-2 mb-6 text-xs" style={{ color: MUTED }}><Truck size={14} /> Thời gian giao hàng dự kiến: 12–18 ngày</div>
              <button onClick={() => addToCart(selectedProduct.id)} className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: COBALT }}>Thêm vào giỏ hàng</button>
            </div>
          </div>
        </main>
      )}

      {view === "checkout" && (
        <main className="max-w-lg mx-auto px-5 py-6">
          <button onClick={() => setView(null)} className="flex items-center gap-1 text-sm font-medium mb-5"><ArrowLeft size={16} /> Quay lại giỏ hàng</button>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-5">Thanh toán</h2>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>Giao đến</p>
          <div className="rounded-xl p-3 mb-5 text-sm" style={{ background: CARD }}>{email || "you@example.com"} · Việt Nam</div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: MUTED }}>Phương thức thanh toán</p>
          <div className="space-y-2 mb-6">
            {[
              { id: "momo", label: "MoMo", note: "Xác nhận tức thì" },
              { id: "zalopay", label: "ZaloPay", note: "Xác nhận tức thì" },
              { id: "vnpay", label: "VNPay", note: "Xác nhận tức thì" },
              { id: "visa", label: "Visa / Mastercard", note: "Thanh toán qua thẻ quốc tế" },
              { id: "bank", label: "Chuyển khoản ngân hàng", note: "Xác nhận thủ công sau khi chuyển" },
            ].map((m) => (
              <button key={m.id} onClick={() => setPayMethod(m.id)} className="w-full text-left p-3 rounded-xl flex items-center justify-between"
                style={{ background: payMethod === m.id ? "#DDEAE3" : CARD, border: payMethod === m.id ? `1.5px solid ${JADE}` : "1.5px solid transparent" }}>
                <div><p className="text-sm font-medium">{m.label}</p><p className="text-xs" style={{ color: MUTED }}>{m.note}</p></div>
                {payMethod === m.id && <Check size={16} style={{ color: JADE }} />}
              </button>
            ))}
          </div>
          <div className="rounded-2xl p-4 space-y-2 mb-6" style={{ background: CARD }}><Row label="Số tiền cần thanh toán" value={money(total)} sub={vnd(total)} bold /></div>

          {payMethod === "visa" ? (
            <button onClick={() => startStripeCheckout()} className="w-full py-3 rounded-xl font-semibold text-white" style={{ background: PAPAYA }}>
              Thanh toán bằng thẻ / Apple Pay
            </button>
          ) : (
            <button
              onClick={() => {
                placeOrder();
                if (window.Tawk_API && window.Tawk_API.maximize) window.Tawk_API.maximize();
              }}
              className="w-full py-3 rounded-xl font-semibold text-white"
              style={{ background: PAPAYA }}
            >
              Đặt hàng &amp; chat để lấy thông tin thanh toán
            </button>
          )}
          <p className="text-xs text-center mt-3" style={{ color: MUTED }}>
            Muốn thanh toán bằng PayPal, Wise, hoặc Xoom? Chat với chúng tôi để nhận link thanh toán.
          </p>
        </main>
      )}

      {view === "confirmation" && (
        <main className="max-w-md mx-auto px-5 py-16 text-center">
          <div className="flex justify-center mb-6"><Stamp size={120} /></div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-2">Đặt hàng thành công</h2>
          <p className="text-sm mb-6" style={{ color: MUTED }}>Chúng tôi sẽ mua sản phẩm tại website chính hãng và cập nhật trạng thái vận chuyển cho bạn.</p>
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6" style={{ background: CARD, fontFamily: "'IBM Plex Mono', monospace" }}><Package size={14} /><span className="text-sm">{orderNum}</span></div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setView("tracking")} className="py-3 px-5 rounded-xl font-semibold text-white" style={{ background: INK }}>Theo dõi đơn hàng</button>
            <button onClick={() => { setView(null); setTab("home"); }} className="py-3 px-5 rounded-xl font-semibold" style={{ background: CARD }}>Về trang chủ</button>
          </div>
        </main>
      )}

      {view === "tracking" && (
        <main className="max-w-lg mx-auto px-5 py-8">
          <button onClick={() => setView(null)} className="flex items-center gap-1 text-sm font-medium mb-5"><ArrowLeft size={16} /> Quay lại</button>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-1">Theo dõi đơn hàng</h2>
          <p className="text-xs mb-6" style={{ color: MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>{orderNum}</p>
          <div>
            {TRACKING_STEPS.map((s, i) => {
              const current = i === 1;
              const done = i < 1;
              return (
                <div key={s.key} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: done || current ? JADE : CARD, color: done || current ? "#fff" : MUTED }}>
                      {done ? <Check size={13} /> : <span className="text-xs font-semibold">{i + 1}</span>}
                    </div>
                    {i < TRACKING_STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: done ? JADE : "#E4E1DA", minHeight: 32 }} />}
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium" style={{ color: current ? INK : done ? INK : MUTED }}>{s.label}</p>
                    {current && <p className="text-xs mt-0.5" style={{ color: MUTED }}>Cập nhật lần cuối: hôm nay</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {view === "muaho" && (
        <main className="max-w-lg mx-auto px-5 py-8">
          <button onClick={() => setView(null)} className="flex items-center gap-1 text-sm font-medium mb-5"><ArrowLeft size={16} /> Quay lại</button>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-2">Mua hộ</h2>
          <p className="text-sm mb-6" style={{ color: MUTED }}>Không tìm thấy sản phẩm bạn cần? Dán liên kết từ website chính hãng, chúng tôi sẽ báo giá cho bạn.</p>
          {!linkSubmitted ? (
            <>
              <p className="text-xs font-semibold mb-2" style={{ color: MUTED }}>Liên kết sản phẩm</p>
              <input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="https://www.hollisterco.com/..."
                className="w-full px-3 py-2.5 rounded-lg text-sm mb-3" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
              <p className="text-xs font-semibold mb-2" style={{ color: MUTED }}>Ghi chú (size, màu, số lượng...)</p>
              <textarea rows={3} placeholder="Ví dụ: size M, màu xanh navy, 2 cái" className="w-full px-3 py-2.5 rounded-lg text-sm mb-4" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
              <button onClick={() => setLinkSubmitted(true)} disabled={!linkInput} className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40" style={{ background: COBALT }}>Gửi yêu cầu báo giá</button>
            </>
          ) : (
            <div className="rounded-2xl p-5 text-center" style={{ background: CARD }}>
              <Check size={28} style={{ color: JADE }} className="mx-auto mb-2" />
              <p className="text-sm font-medium mb-1">Đã gửi yêu cầu!</p>
              <p className="text-xs" style={{ color: MUTED }}>Chúng tôi sẽ báo giá cho bạn trong vòng 24 giờ.</p>
            </div>
          )}
        </main>
      )}

      {view === "adminlogin" && (
        <main className="max-w-sm mx-auto px-5 py-16 text-center">
          <Lock size={28} className="mx-auto mb-3" style={{ color: MUTED }} />
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xl font-bold mb-1">Khu vực quản trị</h2>
          <p className="text-xs mb-5" style={{ color: MUTED }}>Đăng nhập bằng tài khoản quản trị để thêm/sửa sản phẩm.</p>
          <input type="email" value={adminEmailInput} onChange={(e) => setAdminEmailInput(e.target.value)} placeholder="Email quản trị"
            className="w-full px-3 py-2.5 rounded-lg text-sm mb-2 text-center" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
          <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} placeholder="Mật khẩu"
            className="w-full px-3 py-2.5 rounded-lg text-sm mb-2 text-center" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
          {adminError && <p className="text-xs mb-3" style={{ color: PAPAYA }}>{adminError}</p>}
          <button onClick={tryAdminLogin} className="w-full py-2.5 rounded-lg font-semibold text-white" style={{ background: INK }}>Vào trang quản trị</button>
          <button onClick={() => setView(null)} className="w-full py-2.5 mt-2 text-sm" style={{ color: MUTED }}>Quay lại</button>
        </main>
      )}

      {view === "admin" && isAdmin && (
        <main className="max-w-3xl mx-auto px-5 py-6">
          <div className="flex items-center justify-between mb-5">
            <button onClick={() => setView(null)} className="flex items-center gap-1 text-sm font-medium"><ArrowLeft size={16} /> Quay lại</button>
            <div className="flex items-center gap-2">
              <button onClick={() => setEditingProduct({ id: randomId(), brand: BRANDS[0], name: "", price: 0, img: "", cat: CATEGORIES[1], sizes: "", rating: 5 })}
                className="flex items-center gap-1 text-sm font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: COBALT }}>
                <Plus size={15} /> Thêm sản phẩm
              </button>
              <button onClick={adminLogout} className="text-sm font-medium px-3 py-1.5 rounded-lg" style={{ background: CARD }}>Đăng xuất</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 mb-6" style={{ background: CARD }}>
            <p className="text-sm font-semibold mb-2">Dán link sản phẩm để tự động điền</p>
            <p className="text-xs mb-3" style={{ color: MUTED }}>Hệ thống sẽ cố lấy ảnh, tên và giá từ link — luôn kiểm tra lại trước khi lưu.</p>
            <div className="flex gap-2">
              <input value={linkFetchInput} onChange={(e) => setLinkFetchInput(e.target.value)} placeholder="https://..."
                className="flex-1 px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
              <button onClick={fetchFromLink} disabled={linkFetchLoading || !linkFetchInput}
                className="py-2 px-4 rounded-lg font-semibold text-white text-sm disabled:opacity-40" style={{ background: JADE }}>
                {linkFetchLoading ? "Đang lấy..." : "Lấy dữ liệu"}
              </button>
            </div>
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-2xl font-bold mb-1">Quản trị sản phẩm</h2>
          <p className="text-xs mb-6" style={{ color: MUTED }}>Thay đổi ở đây sẽ hiển thị cho tất cả người dùng ngay lập tức.</p>

          {editingProduct && (
            <div className="rounded-2xl p-4 mb-6" style={{ background: CARD }}>
              <p className="text-sm font-semibold mb-3">{products.some((p) => p.id === editingProduct.id) ? "Sửa sản phẩm" : "Sản phẩm mới"}</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <Field label="Thương hiệu" value={editingProduct.brand} onChange={(v) => setEditingProduct({ ...editingProduct, brand: v })} isSelect options={BRANDS} />
                <Field label="Tên sản phẩm" value={editingProduct.name} onChange={(v) => setEditingProduct({ ...editingProduct, name: v })} />
                <Field label="Giá (USD)" type="number" value={editingProduct.price} onChange={(v) => setEditingProduct({ ...editingProduct, price: parseFloat(v) || 0 })} />
                <Field label="Danh mục" value={editingProduct.cat} onChange={(v) => setEditingProduct({ ...editingProduct, cat: v })} isSelect options={CATEGORIES.slice(1)} />
                <Field label="Link hình ảnh (URL)" value={editingProduct.img || ""} onChange={(v) => setEditingProduct({ ...editingProduct, img: v })} full />
                <Field label="Kích thước (cách nhau bởi dấu phẩy)" value={editingProduct.sizes || ""} onChange={(v) => setEditingProduct({ ...editingProduct, sizes: v })} full />
              </div>
              <div className="flex gap-2">
                <button onClick={() => upsertProduct(editingProduct)} disabled={savingProduct || !editingProduct.name}
                  className="py-2 px-4 rounded-lg font-semibold text-white text-sm disabled:opacity-40" style={{ background: JADE }}>
                  {savingProduct ? "Đang lưu..." : "Lưu"}
                </button>
                <button onClick={() => setEditingProduct(null)} className="py-2 px-4 rounded-lg font-semibold text-sm" style={{ background: "#fff" }}>Hủy</button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: CARD }}>
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"><ProductImage product={p} rounded={false} /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold" style={{ color: MUTED }}>{p.brand}</p>
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(p.price)} · {p.cat}</p>
                </div>
                <button onClick={() => setEditingProduct(p)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}><Pencil size={14} /></button>
                <button onClick={() => deleteProduct(p.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#fff" }}><Trash2 size={14} color={PAPAYA} /></button>
              </div>
            ))}
          </div>
        </main>
      )}

      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center px-5 z-30" style={{ background: "rgba(20,23,31,0.5)" }}>
          <div className="rounded-2xl p-6 w-full max-w-sm relative" style={{ background: PAPER }}>
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4"><X size={18} /></button>
            <h3 style={{ fontFamily: "'Space Grotesk', sans-serif" }} className="text-xl font-bold mb-1">Đăng nhập</h3>
            <p className="text-xs mb-4" style={{ color: MUTED }}>Bản demo — dùng email bất kỳ.</p>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm mb-3" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
            <button onClick={() => { if (!email) return; setLoggedIn(true); setShowLogin(false); if (cart.length) setView("checkout"); }}
              className="w-full py-2.5 rounded-lg font-semibold text-white" style={{ background: COBALT }}>Tiếp tục</button>
          </div>
        </div>
      )}

      {!view && (
        <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-2.5 z-20" style={{ background: PAPER, borderTop: "1px solid #E4E1DA" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = tab === item.key;
            return (
              <button key={item.key} onClick={() => setTab(item.key)} className="flex flex-col items-center gap-0.5 relative px-2">
                <Icon size={20} color={active ? COBALT : MUTED} fill={item.key === "wishlist" && active ? COBALT : "none"} />
                {!!item.badge && <span className="absolute -top-1 right-0 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center" style={{ background: PAPAYA, fontSize: 9 }}>{item.badge}</span>}
                <span className="text-xs" style={{ color: active ? COBALT : MUTED, fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", isSelect, options, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-xs font-semibold mb-1" style={{ color: MUTED }}>{label}</p>
      {isSelect ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #D6D2C8", background: "#fff" }}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ border: "1px solid #D6D2C8", background: "#fff" }} />
      )}
    </div>
  );
}

function ProductGrid({ products, wishlist, toggleWishlist, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {products.map((p) => (
        <div key={p.id} className="text-left">
          <button onClick={() => onSelect(p)} className="w-full">
            <div className="rounded-2xl aspect-square mb-3 relative overflow-hidden">
              <ProductImage product={p} />
              <div className="absolute top-2 left-2 rounded-full px-2 py-1 flex items-center gap-1" style={{ background: "rgba(255,255,255,0.85)" }}>
                <Check size={11} style={{ color: JADE }} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: JADE, fontWeight: 600 }}>CHÍNH HÃNG</span>
              </div>
              <button onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.85)" }}>
                <Heart size={13} fill={wishlist.includes(p.id) ? PAPAYA : "none"} color={wishlist.includes(p.id) ? PAPAYA : INK} />
              </button>
            </div>
          </button>
          <button onClick={() => onSelect(p)} className="text-left w-full">
            <p className="text-xs uppercase tracking-wide font-semibold" style={{ color: MUTED }}>{p.brand}</p>
            <p className="text-sm font-medium leading-snug">{p.name}</p>
            <p className="text-sm mt-0.5" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{money(p.price)} <span style={{ color: MUTED }}>{vnd(p.price)}</span></p>
          </button>
        </div>
      ))}
    </div>
  );
}

function Row({ label, value, sub, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-sm ${bold ? "font-semibold" : ""}`}>{label}</span>
      <span className={`text-sm text-right ${bold ? "font-bold" : ""}`} style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
        {value}{sub && <div className="text-xs font-normal" style={{ color: MUTED }}>{sub}</div>}
      </span>
    </div>
  );
}
