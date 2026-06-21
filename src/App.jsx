import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Minus,
  Settings,
  X,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Receipt,
  ChevronDown,
  ChevronUp,
  Scissors,
  Download,
  Upload,
  RotateCcw,
  StickyNote,
} from "lucide-react";

/* ============================================================
   TEMA "PRO" — glassmorphism sobre fondo oscuro con manchas de color
   ============================================================ */
const C = {
  bg: "#0A0E16",
  glassBg: "rgba(255,255,255,0.06)",
  glassBgStrong: "rgba(255,255,255,0.10)",
  glassBorder: "rgba(255,255,255,0.12)",
  textPrimary: "#F3EFE6",
  textMuted: "rgba(243,239,230,0.55)",
  blue: "#3B82F6",
  blueDark: "#1D4ED8",
  beige: "#E8DCC4",
  beigeDark: "#C2A876",
  whatsapp: "#25D366",
  whatsappDark: "#1AA855",
  danger: "#FF6B6B",
  success: "#34D399",
};

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const GLASS = {
  backgroundColor: C.glassBg,
  border: `1px solid ${C.glassBorder}`,
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
};

const GLASS_HEADER = {
  backgroundColor: "rgba(10,7,6,0.55)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const STORAGE_KEY = "zutoia-pedidos-data";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function sanitizeNumber(v) {
  return v.replace(/[^\d]/g, "");
}

const FAMILY_EMOJI = {
  "cat-cervezas-bebidas": "🍺",
  "cat-cocina": "🍳",
  "cat-licores": "🥃",
  "cat-paquetes": "🥜",
  "cat-varios": "📦",
  "cat-mdo-cafe": "☕",
  "cat-mdo-otros": "🍪",
  "cat-ondarru-vinos": "🍷",
  "cat-makro-compra": "🛒",
};

// Coincidencias por palabra clave en el nombre, usadas cuando no hay un emoji fijo asignado al id.
const NAME_EMOJI_RULES = [
  [/makro|carrefour|alcampo|eroski|costco|mercadona|hipermercado|cash.?carry/, "🏬"],
  [/cervez|bebida|refresc|gaseosa|agua|zumo|t[oó]nic/, "🍺"],
  [/vino|licor|alcohol|whisky|ron\b|ginebra|vodka|cava|champ[aá]n/, "🥃"],
  [/cafe|café|descafeinad/, "☕"],
  [/limpieza|higiene|detergente|lej[ií]a|fregon/, "🧼"],
  [/papel|servilleta|hogar|menaje|cocina desechable/, "🧻"],
  [/congelad/, "🧊"],
  [/carne|charcut|embutid|jam[oó]n|chorizo|bacon/, "🥩"],
  [/pescad|marisco|atun|at[uú]n|bonito|anchoa/, "🐟"],
  [/fruta|verdura|hortaliza|ensalada/, "🥦"],
  [/pan\b|panader|bolleria|bolleria|reposter/, "🍞"],
  [/lacte|queso|leche|yogur|nata/, "🧀"],
  [/dulce|chocolate|caramel|golosina|galleta/, "🍪"],
  [/snack|aperitiv|patata|frutos secos|cacahuet|chasqui|jumper/, "🥜"],
  [/conserva|lata/, "🥫"],
  [/condiment|especi|salsa|aceite|vinagre|mayonesa|mostaza/, "🧂"],
  [/mascota|perro|gato/, "🐾"],
  [/desayuno|cereal|colacao|azucar|az[uú]car/, "🥣"],
  [/huevo/, "🥚"],
  [/cigarro|tabaco/, "🚬"],
  [/paquete|caja/, "📦"],
  [/varios|general|otros/, "🗂️"],
  [/compra|lista/, "🛒"],
];

function guessEmojiByName(name) {
  if (!name) return null;
  const n = name.toLowerCase();
  for (const [regex, emoji] of NAME_EMOJI_RULES) {
    if (regex.test(n)) return emoji;
  }
  return null;
}

function emojiFor(catId, catName) {
  return FAMILY_EMOJI[catId] || guessEmojiByName(catName) || "🏷️";
}

function badgeEmojiFor(supplier) {
  const bySupplierName = guessEmojiByName(supplier.name);
  if (bySupplierName) return bySupplierName;
  const firstCat = supplier.categories[0];
  if (firstCat) return emojiFor(firstCat.id, firstCat.name);
  return "🏪";
}

const DEFAULT_SUPPLIERS = [
  {
    id: "sup-kodeka",
    name: "KODEKA",
    type: "whatsapp",
    waNumber: "34650948957",
    greeting: "Aupa Jon, te dejo el pedido por aquí:",
    categories: [
      {
        id: "cat-cervezas-bebidas",
        name: "Cervezas y Bebidas",
        products: [
          { id: "p-cb-1", name: "1906" },
          { id: "p-cb-2", name: "Aceite Girasol Garrafa 5L" },
          { id: "p-cb-3", name: "Aceite Oliva Garrafa 5L" },
          { id: "p-cb-4", name: "Agua" },
          { id: "p-cb-5", name: "Agua 33cl" },
          { id: "p-cb-6", name: "Agua Con Gas Mondariz 33cl" },
          { id: "p-cb-7", name: "Alhambra 33cl" },
          { id: "p-cb-8", name: "Alhambra Verde 33cl" },
          { id: "p-cb-9", name: "Bitter Kas" },
          { id: "p-cb-10", name: "Caja 12 Vino El Sotillo" },
          { id: "p-cb-11", name: "Caja 6 Ramón Bilbao" },
          { id: "p-cb-12", name: "Caja Martini Blanco" },
          { id: "p-cb-13", name: "Caja Martini Rojo" },
          { id: "p-cb-14", name: "Caja Moscato Maestri" },
          { id: "p-cb-15", name: "Estrella Galicia 0,0 25 cl" },
          { id: "p-cb-16", name: "Estrella Galicia 25cl" },
          { id: "p-cb-17", name: "Estrella Galicia 33cl" },
          { id: "p-cb-18", name: "Estrella Galicia Sin Gluten 25cl" },
          { id: "p-cb-19", name: "Groliño Cafe Caja" },
          { id: "p-cb-20", name: "Groliño Crema Caja" },
          { id: "p-cb-21", name: "Groliño Hierbas Caja" },
          { id: "p-cb-22", name: "Groliño Orujo Blanco Caja" },
          { id: "p-cb-23", name: "Kas Limón" },
          { id: "p-cb-24", name: "Kas Naranja" },
          { id: "p-cb-25", name: "Pack de leche" },
          { id: "p-cb-26", name: "Pack Latas Cocacola Importacion" },
          { id: "p-cb-27", name: "Pack Leche Sin Lactosa" },
          { id: "p-cb-28", name: "Paquete Gaseosa 1L" },
          { id: "p-cb-29", name: "Paquete Gaseosa Limón 1L" },
          { id: "p-cb-30", name: "Radler" },
          { id: "p-cb-31", name: "Tónico Shweppes" },
          { id: "p-cb-32", name: "Voll DAMN 25cl" },
        ],
      },
      {
        id: "cat-cocina",
        name: "Cocina",
        products: [
          { id: "p-co-1", name: "Bacon" },
          { id: "p-co-2", name: "Bonito" },
          { id: "p-co-3", name: "Bonito Picante" },
          { id: "p-co-4", name: "Bote Ali Oli" },
          { id: "p-co-5", name: "Bote Barbacoa" },
          { id: "p-co-6", name: "Bote de Gildas" },
          { id: "p-co-7", name: "Bote Guindillas Grande (Galón)" },
          { id: "p-co-8", name: "Bote Piparras 720ml" },
          { id: "p-co-9", name: "Chorizo" },
          { id: "p-co-10", name: "Cubo Mayonesa" },
          { id: "p-co-11", name: "Ensalada Jamón Ibérico y Queso" },
          { id: "p-co-12", name: "Huevos (15 docenas)" },
          { id: "p-co-13", name: "Huevos Codorniz" },
          { id: "p-co-14", name: "Pandereta Anchoas" },
          { id: "p-co-15", name: "Patata con cebolla para tortillas" },
          { id: "p-co-16", name: "Queso Tranchetes" },
          { id: "p-co-17", name: "Sobre 0,5L Caldo Gallina Blanca" },
          { id: "p-co-18", name: "Sobre 1L Caldo Gallina Blanca" },
        ],
      },
      {
        id: "cat-licores",
        name: "Licores",
        products: [
          { id: "p-li-1", name: "Absolut" },
          { id: "p-li-2", name: "Anís del mono" },
          { id: "p-li-3", name: "Bacardi 1L" },
          { id: "p-li-4", name: "Bailleys" },
          { id: "p-li-5", name: "Ballantines" },
          { id: "p-li-6", name: "Barcelo" },
          { id: "p-li-7", name: "Befeeater" },
          { id: "p-li-8", name: "Bombay Shappire" },
          { id: "p-li-9", name: "Brugal" },
          { id: "p-li-10", name: "Bulldog" },
          { id: "p-li-11", name: "Caja Cosechero Viñapeña" },
          { id: "p-li-12", name: "Campari" },
          { id: "p-li-13", name: "Granadina" },
          { id: "p-li-14", name: "Havana 7" },
          { id: "p-li-15", name: "Jagger" },
          { id: "p-li-16", name: "JB" },
          { id: "p-li-17", name: "Jonnie Walker Rojo" },
          { id: "p-li-18", name: "Legendario" },
          { id: "p-li-19", name: "Licor 43" },
          { id: "p-li-20", name: "Licor Kinder Bueno" },
          { id: "p-li-21", name: "Licor Melocotón" },
          { id: "p-li-22", name: "Lima" },
          { id: "p-li-23", name: "Marie Blizzard" },
          { id: "p-li-24", name: "Martin Millers" },
          { id: "p-li-25", name: "MG" },
          { id: "p-li-26", name: "Pacharán La Navarra" },
          { id: "p-li-27", name: "Puerto de Indias" },
          { id: "p-li-28", name: "Santa Teresa" },
          { id: "p-li-29", name: "Seagrams" },
          { id: "p-li-30", name: "Seagrams 0,0" },
          { id: "p-li-31", name: "Tanqueray" },
          { id: "p-li-32", name: "Tequila Jose Cuervo" },
          { id: "p-li-33", name: "Terry 1900" },
          { id: "p-li-34", name: "Veterano" },
          { id: "p-li-35", name: "Vodka Negro" },
        ],
      },
      {
        id: "cat-paquetes",
        name: "Paquetes",
        products: [
          { id: "p-pa-1", name: "Cacahuetes con cáscara" },
          { id: "p-pa-2", name: "Caja Chaskis" },
          { id: "p-pa-3", name: "Caja Jumpers" },
          { id: "p-pa-4", name: "Caja Pasarratos" },
          { id: "p-pa-5", name: "Caja Patatas Leones" },
        ],
      },
      {
        id: "cat-varios",
        name: "Varios",
        products: [
          { id: "p-va-1", name: "100 tapas café llevar 8oz" },
          { id: "p-va-2", name: "50 tapas café llevar 7oz" },
          { id: "p-va-3", name: "50 vasos café llevar 7oz" },
          { id: "p-va-4", name: "50 vasos café llevar 8oz" },
          { id: "p-va-5", name: "Colacao 50 sobres" },
          { id: "p-va-6", name: "Limon exprimido" },
        ],
      },
    ],
  },
  {
    id: "sup-medalla-oro",
    name: "MEDALLA DE ORO",
    type: "whatsapp",
    waNumber: "34648557018",
    greeting: "Aupa Iván, te dejo por aquí el pedido:",
    categories: [
      {
        id: "cat-mdo-cafe",
        name: "Café",
        products: [
          { id: "p-mdo-cafe-1", name: "Café Normal 2+1" },
          { id: "p-mdo-cafe-2", name: "Cafe Normal 4+2" },
          { id: "p-mdo-cafe-3", name: "Café Descafeinado" },
          { id: "p-mdo-cafe-4", name: "Sobres Descafeinado" },
        ],
      },
      {
        id: "cat-mdo-otros",
        name: "Otros",
        products: [
          { id: "p-mdo-otros-1", name: "Caja Azúcar" },
          { id: "p-mdo-otros-2", name: "Caja Sacarinas" },
          { id: "p-mdo-otros-3", name: "Caja Azúcar Moreno" },
          { id: "p-mdo-otros-4", name: "Galletas 3+1" },
          { id: "p-mdo-otros-5", name: "Colacao" },
        ],
      },
    ],
  },
  {
    id: "sup-ondarru",
    name: "ONDARRU",
    type: "whatsapp",
    waNumber: "34666434375",
    greeting: "Aupa Ondarru, te dejo por aquí el pedido:",
    categories: [
      {
        id: "cat-ondarru-vinos",
        name: "Vinos",
        products: [
          { id: "p-ond-vino-1", name: "Godello Maruxa" },
          { id: "p-ond-vino-2", name: "Crianza Viña Real" },
          { id: "p-ond-vino-3", name: "Txakoli Tinko" },
        ],
      },
    ],
  },
  {
    id: "sup-makro",
    name: "MAKRO",
    type: "keep",
    noteTitle: "Lista MAKRO",
    waNumber: "",
    greeting: "",
    categories: [
      {
        id: "cat-makro-compra",
        name: "Compra",
        products: [],
      },
    ],
  },
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);
  const [carts, setCarts] = useState({});
  const [view, setView] = useState("home"); // home | order | settings
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [showOrder, setShowOrder] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddName, setQuickAddName] = useState("");
  const [keepFallback, setKeepFallback] = useState(null); // { title, text } | null
  const [productMenu, setProductMenu] = useState(null); // { supplierId, catId, product }
  const [productMenuMode, setProductMenuMode] = useState("choose"); // choose | rename
  const [renameValue, setRenameValue] = useState("");

  const [collapsedSuppliers, setCollapsedSuppliers] = useState({});
  const [collapsedCats, setCollapsedCats] = useState({});
  const [newCatNameBySupplier, setNewCatNameBySupplier] = useState({});
  const [newProductInputs, setNewProductInputs] = useState({});
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierNumber, setNewSupplierNumber] = useState("");
  const [newSupplierGreeting, setNewSupplierGreeting] = useState("");
  const [newSupplierType, setNewSupplierType] = useState("whatsapp");
  const [newSupplierNoteTitle, setNewSupplierNoteTitle] = useState("");

  const [toast, setToast] = useState(null); // { message, type, key }
  const toastTimeoutRef = useRef(null);

  const skipSave = useRef(true);
  const fileInputRef = useRef(null);
  const longPressTimer = useRef(null);

  // ---------- Toasts ----------
  function showToast(message, type = "success") {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, key: Date.now() });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 3000);
  }

  // ---------- Carga inicial desde localStorage ----------
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        setSuppliers(data.suppliers || DEFAULT_SUPPLIERS);
        setCarts(data.carts || {});
      }
    } catch (e) {
      // sin datos guardados todavía o navegador sin localStorage disponible
    } finally {
      setLoaded(true);
      skipSave.current = false;
    }
  }, []);

  // ---------- Guardado automático en localStorage ----------
  useEffect(() => {
    if (skipSave.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ suppliers, carts }));
    } catch (e) {
      showToast("No se pudo guardar en este navegador (almacenamiento lleno o bloqueado).", "error");
    }
  }, [suppliers, carts]);

  function selectSupplier(supplierId) {
    const sup = suppliers.find((s) => s.id === supplierId);
    setSelectedSupplierId(supplierId);
    setSelectedCatId(sup && sup.categories.length > 0 ? sup.categories[0].id : null);
    setView("order");
  }

  function goHome() {
    setView("home");
  }

  function getCart(supplierId) {
    return carts[supplierId] || {};
  }

  function totalItems(supplierId) {
    return Object.values(getCart(supplierId)).reduce((a, b) => a + b, 0);
  }

  function changeQty(supplierId, productId, delta) {
    setCarts((prev) => {
      const next = { ...prev };
      const supCart = { ...(next[supplierId] || {}) };
      const current = supCart[productId] || 0;
      const updated = Math.max(0, current + delta);
      if (updated === 0) {
        delete supCart[productId];
      } else {
        supCart[productId] = updated;
      }
      next[supplierId] = supCart;
      return next;
    });
  }

  function clearCart(supplierId) {
    setCarts((prev) => ({ ...prev, [supplierId]: {} }));
  }

  function resetOrder(supplier) {
    clearCart(supplier.id);
    showToast("Pedido reiniciado", "success");
  }

  function startLongPress(supplierId, catId, product) {
    longPressTimer.current = setTimeout(() => {
      setProductMenu({ supplierId, catId, product });
      setProductMenuMode("choose");
      setRenameValue(product.name);
    }, 500);
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function closeProductMenu() {
    setProductMenu(null);
  }

  function confirmDeleteFromMenu() {
    if (!productMenu) return;
    deleteProduct(productMenu.supplierId, productMenu.catId, productMenu.product.id);
    showToast(`"${productMenu.product.name}" eliminado`, "success");
    closeProductMenu();
  }

  function confirmRenameFromMenu() {
    if (!productMenu) return;
    const name = renameValue.trim();
    if (!name) return;
    updateProductName(productMenu.supplierId, productMenu.catId, productMenu.product.id, name);
    showToast("Producto actualizado", "success");
    closeProductMenu();
  }

  function updateSupplierField(supplierId, field, value) {
    setSuppliers((prev) => prev.map((s) => (s.id === supplierId ? { ...s, [field]: value } : s)));
  }

  function addSupplier() {
    const name = newSupplierName.trim();
    if (!name) return;
    const sup = {
      id: uid(),
      name,
      type: newSupplierType,
      waNumber: newSupplierType === "whatsapp" ? sanitizeNumber(newSupplierNumber) : "",
      greeting: newSupplierType === "whatsapp" ? newSupplierGreeting.trim() || "Aupa, te dejo el pedido por aquí:" : "",
      noteTitle: newSupplierType === "keep" ? newSupplierNoteTitle.trim() || `Lista ${name}` : "",
      categories: [],
    };
    setSuppliers((prev) => [...prev, sup]);
    setNewSupplierName("");
    setNewSupplierNumber("");
    setNewSupplierGreeting("");
    setNewSupplierNoteTitle("");
    setNewSupplierType("whatsapp");
    showToast(`Proveedor "${name}" creado`, "success");
  }

  function deleteSupplier(supplierId) {
    setSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
    setCarts((prev) => {
      const next = { ...prev };
      delete next[supplierId];
      return next;
    });
    if (selectedSupplierId === supplierId) {
      setSelectedSupplierId(null);
      setView("home");
    }
  }

  function addCategory(supplierId) {
    const name = (newCatNameBySupplier[supplierId] || "").trim();
    if (!name) return;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId ? { ...s, categories: [...s.categories, { id: uid(), name, products: [] }] } : s
      )
    );
    setNewCatNameBySupplier((prev) => ({ ...prev, [supplierId]: "" }));
    showToast(`Familia "${name}" añadida`, "success");
  }

  function updateCategoryName(supplierId, catId, name) {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? { ...s, categories: s.categories.map((c) => (c.id === catId ? { ...c, name } : c)) }
          : s
      )
    );
  }

  function deleteCategory(supplierId, catId) {
    const sup = suppliers.find((s) => s.id === supplierId);
    const cat = sup && sup.categories.find((c) => c.id === catId);
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplierId ? { ...s, categories: s.categories.filter((c) => c.id !== catId) } : s))
    );
    if (cat) {
      setCarts((prev) => {
        const next = { ...prev };
        const supCart = { ...(next[supplierId] || {}) };
        cat.products.forEach((p) => delete supCart[p.id]);
        next[supplierId] = supCart;
        return next;
      });
    }
    if (selectedCatId === catId) setSelectedCatId(null);
  }

  function addProductToCategory(supplierId, catId, name) {
    const trimmed = name.trim();
    if (!trimmed) return false;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              categories: s.categories.map((c) =>
                c.id === catId ? { ...c, products: [...c.products, { id: uid(), name: trimmed }] } : c
              ),
            }
          : s
      )
    );
    return true;
  }

  function addProduct(supplierId, catId) {
    const name = newProductInputs[catId] || "";
    const ok = addProductToCategory(supplierId, catId, name);
    if (ok) {
      setNewProductInputs((prev) => ({ ...prev, [catId]: "" }));
      showToast(`"${name.trim()}" añadido`, "success");
    }
  }

  function updateProductName(supplierId, catId, productId, name) {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              categories: s.categories.map((c) =>
                c.id === catId
                  ? { ...c, products: c.products.map((p) => (p.id === productId ? { ...p, name } : p)) }
                  : c
              ),
            }
          : s
      )
    );
  }

  function deleteProduct(supplierId, catId, productId) {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              categories: s.categories.map((c) =>
                c.id === catId ? { ...c, products: c.products.filter((p) => p.id !== productId) } : c
              ),
            }
          : s
      )
    );
    setCarts((prev) => {
      const next = { ...prev };
      const supCart = { ...(next[supplierId] || {}) };
      delete supCart[productId];
      next[supplierId] = supCart;
      return next;
    });
  }

  function orderLines(supplier) {
    const cart = getCart(supplier.id);
    const lines = [];
    supplier.categories.forEach((cat) => {
      const items = cat.products.filter((p) => (cart[p.id] || 0) > 0);
      if (items.length > 0) {
        lines.push({ catId: cat.id, catName: cat.name, items: items.map((p) => ({ name: p.name, qty: cart[p.id] })) });
      }
    });
    return lines;
  }

  function buildWhatsAppText(supplier) {
    const cart = getCart(supplier.id);
    const items = [];
    supplier.categories.forEach((cat) => {
      cat.products.forEach((p) => {
        const qty = cart[p.id] || 0;
        if (qty > 0) items.push({ name: p.name, qty });
      });
    });
    let text = `${supplier.greeting}\n\n`;
    items.forEach((it) => {
      text += `- ${it.name} x${it.qty}\n`;
    });
    return text.trim();
  }

  function sendWhatsApp(supplier) {
    const clean = sanitizeNumber(supplier.waNumber || "");
    if (!clean || clean.length < 9) {
      showToast(`Configura el número de WhatsApp de ${supplier.name} en Ajustes antes de enviar.`, "error");
      return;
    }
    if (totalItems(supplier.id) === 0) {
      showToast("Añade al menos un producto antes de enviar el pedido.", "error");
      return;
    }
    const text = buildWhatsAppText(supplier);
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(text)}`, "_blank");
    showToast("Pedido enviado 🚀", "success");
  }

  function buildKeepListText(supplier) {
    const cart = getCart(supplier.id);
    const items = [];
    supplier.categories.forEach((cat) => {
      cat.products.forEach((p) => {
        const qty = cart[p.id] || 0;
        if (qty > 0) items.push({ name: p.name, qty });
      });
    });
    const title = supplier.noteTitle || `Lista ${supplier.name}`;
    let text = `${title}\n\n`;
    items.forEach((it) => {
      text += `${it.name} x${it.qty}\n`;
    });
    return { title, text: text.trim() };
  }

  function copyFallbackText() {
    if (!keepFallback) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(keepFallback.text)
        .then(() => showToast("Lista copiada — pégala en una nota nueva de Keep", "success"))
        .catch(() => showToast("Toca el texto, selecciona todo y cópialo a mano", "error"));
    } else {
      showToast("Toca el texto, selecciona todo y cópialo a mano", "error");
    }
  }

  async function createKeepList(supplier) {
    if (totalItems(supplier.id) === 0) {
      showToast("Añade al menos un producto antes de crear la lista.", "error");
      return;
    }
    const { title, text } = buildKeepListText(supplier);
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        showToast("Elige Keep en el menú para crear la nota 📝", "success");
        return;
      } catch (err) {
        if (err && err.name === "AbortError") {
          return;
        }
        // cualquier otro fallo (no soportado, bloqueado, etc.): mostramos el modal manual
      }
    }
    setKeepFallback({ title, text });
  }

  // ---------- Exportar / Importar JSON ----------
  function exportData() {
    const data = { suppliers, carts, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `zutoia-pedidos-${today}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Archivo exportado", "success");
  }

  function triggerImport() {
    fileInputRef.current?.click();
  }

  function handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.suppliers || !Array.isArray(data.suppliers)) {
          showToast("El archivo no tiene el formato esperado.", "error");
          return;
        }
        setSuppliers(data.suppliers);
        setCarts(data.carts || {});
        showToast("Datos importados correctamente", "success");
      } catch (err) {
        showToast("No se pudo leer el archivo. Asegúrate de que es un JSON exportado desde esta app.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function submitQuickAdd() {
    if (!selectedSupplier || !selectedCat) return;
    const ok = addProductToCategory(selectedSupplier.id, selectedCat.id, quickAddName);
    if (ok) {
      showToast(`"${quickAddName.trim()}" añadido a ${selectedCat.name}`, "success");
      setQuickAddName("");
      setQuickAddOpen(false);
    }
  }

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);
  const selectedCat = selectedSupplier && selectedSupplier.categories.find((c) => c.id === selectedCatId);

  /* ---------- Fondo decorativo (manchas de color difuminadas) ---------- */
  const backdropEl = (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" style={{ backgroundColor: C.bg }}>
      <div
        className="absolute rounded-full"
        style={{ width: 420, height: 420, top: -140, left: -120, backgroundColor: C.blue, opacity: 0.35, filter: "blur(110px)" }}
      />
      <div
        className="absolute rounded-full"
        style={{ width: 380, height: 380, bottom: -120, right: -100, backgroundColor: C.beige, opacity: 0.22, filter: "blur(120px)" }}
      />
      <div
        className="absolute rounded-full"
        style={{ width: 280, height: 280, top: "38%", right: "8%", backgroundColor: C.blue, opacity: 0.14, filter: "blur(100px)" }}
      />
    </div>
  );

  /* ---------- Toast ---------- */
  const toastEl = toast ? (
    <div
      key={toast.key}
      className="fixed top-5 left-1/2 z-50 -translate-x-1/2 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 animate-toast-in"
      style={{
        backgroundColor: toast.type === "error" ? hexToRgba(C.danger, 0.18) : hexToRgba(C.success, 0.18),
        border: `1px solid ${toast.type === "error" ? hexToRgba(C.danger, 0.4) : hexToRgba(C.success, 0.4)}`,
        color: toast.type === "error" ? "#FFE2E2" : "#D7FCEF",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        maxWidth: "calc(100% - 32px)",
      }}
      onClick={() => setToast(null)}
    >
      <span>{toast.type === "error" ? "⚠️" : "✅"}</span>
      {toast.message}
    </div>
  ) : null;

  /* ---------- Estilos de animación (autocontenidos, sin tocar Tailwind config) ---------- */
  const styleTag = (
    <style>{`
      @keyframes toast-in {
        from { opacity: 0; transform: translate(-50%, -16px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      .animate-toast-in { animation: toast-in 220ms ease-out; }
      @keyframes modal-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      .animate-modal-in { animation: modal-in 180ms ease-out; }
    `}</style>
  );

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen relative" style={{ backgroundColor: C.bg }}>
        {backdropEl}
        <div
          className="text-sm font-bold tracking-wide"
          style={{
            backgroundImage: `linear-gradient(135deg, ${C.beige}, ${C.blue})`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          🍷 Preparando la barra...
        </div>
      </div>
    );
  }

  const hasBottomBar = view === "order" && selectedSupplier && selectedSupplier.categories.length > 0;
  const fabVisible = (view === "home" || (view === "order" && selectedCat)) && !showOrder;
  const fabBottom = hasBottomBar ? "104px" : "24px";

  const fabEl = fabVisible ? (
    <button
      onClick={() => (view === "home" ? setView("settings") : setQuickAddOpen(true))}
      className="fixed right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center active:scale-90 transition-transform duration-150"
      style={{
        bottom: fabBottom,
        backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`,
        boxShadow: `0 10px 28px ${hexToRgba(C.blue, 0.55)}`,
      }}
      aria-label={view === "home" ? "Nuevo proveedor" : "Nuevo producto"}
    >
      <Plus size={26} color="#fff" />
    </button>
  ) : null;

  const quickAddModal =
    quickAddOpen && selectedCat ? (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        onClick={() => setQuickAddOpen(false)}
      >
        <div
          className="w-full max-w-sm rounded-3xl p-6 animate-modal-in"
          style={GLASS}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.beige }}>
            ✨ Nuevo producto en {selectedCat.name}
          </p>
          <input
            autoFocus
            type="text"
            value={quickAddName}
            onChange={(e) => setQuickAddName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitQuickAdd()}
            placeholder="Nombre del producto"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => setQuickAddOpen(false)}
              className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }}
            >
              Cancelar
            </button>
            <button
              onClick={submitQuickAdd}
              className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }}
            >
              Añadir
            </button>
          </div>
        </div>
      </div>
    ) : null;

  const productMenuModal = productMenu ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={closeProductMenu}
    >
      <div className="w-full max-w-sm rounded-3xl p-6 animate-modal-in" style={GLASS} onClick={(e) => e.stopPropagation()}>
        {productMenuMode === "choose" ? (
          <>
            <p className="text-sm font-bold mb-4 text-center" style={{ color: C.textPrimary }}>
              {productMenu.product.name}
            </p>
            <div className="space-y-2">
              <button
                onClick={() => setProductMenuMode("rename")}
                className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }}
              >
                ✏️ Editar producto
              </button>
              <button
                onClick={confirmDeleteFromMenu}
                className="w-full py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: C.danger, border: `1px solid ${C.glassBorder}` }}
              >
                🗑️ Eliminar producto
              </button>
              <button
                onClick={closeProductMenu}
                className="w-full py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
                style={{ backgroundColor: "transparent", color: C.textMuted }}
              >
                Cancelar
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.beige }}>
              ✏️ Editar producto
            </p>
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmRenameFromMenu()}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-3"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
            />
            <div className="flex gap-2">
              <button
                onClick={closeProductMenu}
                className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmRenameFromMenu}
                className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }}
              >
                Guardar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  ) : null;

  const keepFallbackModal = keepFallback ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setKeepFallback(null)}>
      <div className="w-full max-w-sm rounded-3xl p-6 animate-modal-in" style={GLASS} onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-bold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: C.beige }}>
          <StickyNote size={14} />
          {keepFallback.title}
        </p>
        <p className="text-xs mb-3" style={{ color: C.textMuted }}>
          No se pudo abrir Keep directamente. Toca el texto, selecciona todo y cópialo a mano en una nota nueva.
        </p>
        <textarea
          readOnly
          value={keepFallback.text}
          rows={8}
          onFocus={(e) => e.target.select()}
          className="w-full px-3 py-3 rounded-2xl text-sm font-mono outline-none mb-3 resize-none"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
        />
        <div className="flex gap-2">
          <button
            onClick={() => setKeepFallback(null)}
            className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
            style={{ backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }}
          >
            Cerrar
          </button>
          <button
            onClick={copyFallbackText}
            className="flex-1 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform duration-150"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }}
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  ) : null;

  /* ======================================================
     SETTINGS
     ====================================================== */
  if (view === "settings") {
    return (
      <div className="relative min-h-screen overflow-x-hidden" style={{ color: C.textPrimary }}>
        {backdropEl}
        {styleTag}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-5" style={GLASS_HEADER}>
          <button
            onClick={goHome}
            className="p-1.5 rounded-full active:scale-90 transition-transform duration-150"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <ChevronLeft size={22} color={C.textPrimary} />
          </button>
          <h1 className="text-lg font-bold tracking-wide flex-1">⚙️ Ajustes</h1>
        </div>
        <div className="h-0.5" style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.beige})` }} />

        <div className="px-4 pt-5 pb-16">
          <div className="flex gap-2 mb-5">
            <button
              onClick={exportData}
              className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
              style={{ ...GLASS, color: C.textPrimary }}
            >
              <Download size={16} />
              Exportar JSON
            </button>
            <button
              onClick={triggerImport}
              className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
              style={{ ...GLASS, color: C.textPrimary }}
            >
              <Upload size={16} />
              Importar JSON
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
          </div>

          <div className="space-y-4">
            {suppliers.map((sup) => {
              const isCollapsed = collapsedSuppliers[sup.id] === undefined ? true : collapsedSuppliers[sup.id];
              const badgeEmoji = badgeEmojiFor(sup);
              return (
                <div key={sup.id} className="rounded-2xl overflow-hidden" style={GLASS}>
                  <div className="flex items-center justify-between px-4 py-3">
                    <button
                      onClick={() => setCollapsedSuppliers((p) => ({ ...p, [sup.id]: !isCollapsed }))}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                      <span className="text-lg">{badgeEmoji}</span>
                      <span className="font-bold">{sup.name}</span>
                      <span className="text-xs" style={{ color: C.textMuted }}>
                        ({sup.categories.length} fam.)
                      </span>
                    </button>
                    <button onClick={() => deleteSupplier(sup.id)} className="p-2 active:scale-90 transition-transform duration-150">
                      <Trash2 size={18} color={C.danger} />
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="px-4 py-4 space-y-4" style={{ borderTop: `1px solid ${C.glassBorder}` }}>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.beige }}>
                          🏷️ Nombre
                        </p>
                        <input
                          type="text"
                          value={sup.name}
                          onChange={(e) => updateSupplierField(sup.id, "name", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                          style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.beige }}>
                          📋 Tipo de pedido
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateSupplierField(sup.id, "type", "whatsapp")}
                            className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
                            style={
                              (sup.type || "whatsapp") === "whatsapp"
                                ? { backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }
                                : { backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }
                            }
                          >
                            <MessageCircle size={14} />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => updateSupplierField(sup.id, "type", "keep")}
                            className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
                            style={
                              sup.type === "keep"
                                ? { backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }
                                : { backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }
                            }
                          >
                            <StickyNote size={14} />
                            Lista Keep
                          </button>
                        </div>
                      </div>

                      {(sup.type || "whatsapp") === "whatsapp" ? (
                        <>
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.beige }}>
                              💬 WhatsApp
                            </p>
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={sup.waNumber}
                              onChange={(e) => updateSupplierField(sup.id, "waNumber", sanitizeNumber(e.target.value))}
                              placeholder="34600111222"
                              className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none"
                              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
                            />
                          </div>

                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.beige }}>
                              ✉️ Mensaje de saludo
                            </p>
                            <textarea
                              value={sup.greeting}
                              onChange={(e) => updateSupplierField(sup.id, "greeting", e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
                            />
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.beige }}>
                            📝 Título de la nota
                          </p>
                          <input
                            type="text"
                            value={sup.noteTitle || ""}
                            onChange={(e) => updateSupplierField(sup.id, "noteTitle", e.target.value)}
                            placeholder={`Lista ${sup.name}`}
                            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                            style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
                          />
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.beige }}>
                          🗂️ Familias y productos
                        </p>
                        <div className="space-y-3">
                          {sup.categories.map((cat) => {
                            const catCollapsed = collapsedCats[cat.id];
                            return (
                              <div key={cat.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.glassBorder}` }}>
                                <div className="flex items-center gap-2 px-3 py-2.5" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                                  <button onClick={() => setCollapsedCats((p) => ({ ...p, [cat.id]: !p[cat.id] }))} className="p-0.5 flex-shrink-0">
                                    {catCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                                  </button>
                                  <span className="flex-shrink-0">{emojiFor(cat.id, cat.name)}</span>
                                  <input
                                    type="text"
                                    value={cat.name}
                                    onChange={(e) => updateCategoryName(sup.id, cat.id, e.target.value)}
                                    className="text-sm font-bold bg-transparent outline-none flex-1 min-w-0"
                                    style={{ color: C.textPrimary }}
                                  />
                                  <span className="text-xs flex-shrink-0" style={{ color: C.textMuted }}>
                                    ({cat.products.length})
                                  </span>
                                  <button onClick={() => deleteCategory(sup.id, cat.id)} className="p-1 flex-shrink-0 active:scale-90 transition-transform duration-150">
                                    <Trash2 size={16} color={C.danger} />
                                  </button>
                                </div>
                                {!catCollapsed && (
                                  <div className="px-3 py-3">
                                    {cat.products.length === 0 && (
                                      <p className="text-xs mb-2" style={{ color: C.textMuted }}>
                                        Sin productos todavía.
                                      </p>
                                    )}
                                    <div className="space-y-2 mb-3">
                                      {cat.products.map((p) => (
                                        <div key={p.id} className="flex items-center gap-2">
                                          <input
                                            type="text"
                                            value={p.name}
                                            onChange={(e) => updateProductName(sup.id, cat.id, p.id, e.target.value)}
                                            className="flex-1 text-sm bg-transparent outline-none px-1 py-0.5 rounded"
                                            style={{ color: C.textPrimary }}
                                          />
                                          <button onClick={() => deleteProduct(sup.id, cat.id, p.id)} className="p-1 active:scale-90 transition-transform duration-150 flex-shrink-0">
                                            <X size={15} color={C.textMuted} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        value={newProductInputs[cat.id] || ""}
                                        onChange={(e) => setNewProductInputs((p) => ({ ...p, [cat.id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === "Enter" && addProduct(sup.id, cat.id)}
                                        placeholder="Nuevo producto"
                                        className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                                        style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
                                      />
                                      <button
                                        onClick={() => addProduct(sup.id, cat.id)}
                                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform duration-150"
                                        style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, boxShadow: `0 4px 10px ${hexToRgba(C.blue, 0.4)}` }}
                                      >
                                        <Plus size={18} color="#fff" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 p-3 rounded-xl" style={{ border: `2px dashed ${hexToRgba(C.beige, 0.5)}`, backgroundColor: hexToRgba(C.beige, 0.06) }}>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCatNameBySupplier[sup.id] || ""}
                              onChange={(e) => setNewCatNameBySupplier((p) => ({ ...p, [sup.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && addCategory(sup.id)}
                              placeholder="Nueva familia"
                              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                              style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1px solid ${C.glassBorder}`, color: C.textPrimary }}
                            />
                            <button
                              onClick={() => addCategory(sup.id)}
                              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform duration-150"
                              style={{ backgroundImage: `linear-gradient(135deg, ${C.beige}, ${C.beigeDark})`, boxShadow: `0 4px 10px ${hexToRgba(C.beige, 0.4)}` }}
                            >
                              <Plus size={18} color={C.bg} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="p-4 rounded-2xl" style={{ border: `2px dashed ${hexToRgba(C.blue, 0.5)}`, backgroundColor: hexToRgba(C.blue, 0.08) }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.beige }}>
                🏪 Nuevo proveedor
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="Nombre del proveedor"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.glassBorder}`, color: C.textPrimary }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewSupplierType("whatsapp")}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
                    style={
                      newSupplierType === "whatsapp"
                        ? { backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }
                        : { backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }
                    }
                  >
                    <MessageCircle size={14} />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setNewSupplierType("keep")}
                    className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
                    style={
                      newSupplierType === "keep"
                        ? { backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }
                        : { backgroundColor: "rgba(255,255,255,0.06)", color: C.textMuted, border: `1px solid ${C.glassBorder}` }
                    }
                  >
                    <StickyNote size={14} />
                    Lista Keep
                  </button>
                </div>
                {newSupplierType === "whatsapp" ? (
                  <>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={newSupplierNumber}
                      onChange={(e) => setNewSupplierNumber(sanitizeNumber(e.target.value))}
                      placeholder="Número WhatsApp (ej: 34600111222)"
                      className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.glassBorder}`, color: C.textPrimary }}
                    />
                    <input
                      type="text"
                      value={newSupplierGreeting}
                      onChange={(e) => setNewSupplierGreeting(e.target.value)}
                      placeholder="Mensaje de saludo"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.glassBorder}`, color: C.textPrimary }}
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    value={newSupplierNoteTitle}
                    onChange={(e) => setNewSupplierNoteTitle(e.target.value)}
                    placeholder="Título de la nota (ej: Lista Makro)"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.glassBorder}`, color: C.textPrimary }}
                  />
                )}
                <button
                  onClick={addSupplier}
                  className="w-full py-3 rounded-full text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }}
                >
                  <Plus size={16} />
                  Crear proveedor
                </button>
              </div>
            </div>
          </div>
        </div>
        {toastEl}
      </div>
    );
  }

  /* ======================================================
     HOME
     ====================================================== */
  if (view === "home") {
    return (
      <div className="relative min-h-screen overflow-x-hidden" style={{ color: C.textPrimary }}>
        {backdropEl}
        {styleTag}
        <div className="sticky top-0 z-10 px-5 pt-5 pb-4" style={GLASS_HEADER}>
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-extrabold tracking-tight"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${C.beige}, ${C.blue})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Zutoia
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: C.textMuted }}>
                🏪 Elige proveedor
              </p>
            </div>
            <button
              onClick={() => setView("settings")}
              className="p-2.5 rounded-full active:scale-90 transition-transform duration-150"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}` }}
            >
              <Settings size={20} />
            </button>
          </div>
        </div>
        <div className="h-0.5" style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.beige})` }} />

        <div className="flex-1 px-4 py-4 space-y-3 pb-24">
          {suppliers.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center px-6 pt-16">
              <span style={{ fontSize: "40px" }}>🏪</span>
              <p className="mt-4 text-sm" style={{ color: C.textMuted }}>
                Aún no tienes proveedores. Toca el botón "+" para crear el primero.
              </p>
            </div>
          )}
          {suppliers.map((sup) => {
            const total = totalItems(sup.id);
            const badgeEmoji = badgeEmojiFor(sup);
            return (
              <button
                key={sup.id}
                onClick={() => selectSupplier(sup.id)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl active:scale-95 transition-transform duration-150"
                style={GLASS}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}` }}
                >
                  {badgeEmoji}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold flex items-center gap-1.5">
                    {sup.name}
                    {(sup.type || "whatsapp") === "keep" ? (
                      <StickyNote size={13} color={C.textMuted} />
                    ) : (
                      <MessageCircle size={13} color={C.textMuted} />
                    )}
                  </p>
                  <p className="text-xs" style={{ color: C.textMuted }}>
                    {sup.categories.length} familia{sup.categories.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {total > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0" style={{ backgroundColor: C.beige, color: C.bg }}>
                    {total}
                  </span>
                )}
                <ChevronRight size={18} color={C.textMuted} className="flex-shrink-0" />
              </button>
            );
          })}
        </div>
        {fabEl}
        {toastEl}
      </div>
    );
  }

  /* ======================================================
     ORDER
     ====================================================== */
  const cart = selectedSupplier ? getCart(selectedSupplier.id) : {};
  const total = selectedSupplier ? totalItems(selectedSupplier.id) : 0;

  return (
    <div className="relative min-h-screen overflow-x-hidden flex flex-col" style={{ color: C.textPrimary }}>
      {backdropEl}
      {styleTag}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-4" style={GLASS_HEADER}>
        <div className="flex items-center gap-3">
          <button
            onClick={goHome}
            className="p-1.5 rounded-full active:scale-90 transition-transform duration-150"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">{selectedSupplier ? selectedSupplier.name : "Pedido"}</h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: C.textMuted }}>
              🧾 Zutoia · Pedido
            </p>
          </div>
        </div>
        <button
          onClick={() => setView("settings")}
          className="p-2.5 rounded-full active:scale-90 transition-transform duration-150"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}` }}
        >
          <Settings size={20} />
        </button>
      </div>
      <div className="h-0.5" style={{ backgroundImage: `linear-gradient(90deg, ${C.blue}, ${C.beige})` }} />

      {!selectedSupplier || selectedSupplier.categories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span style={{ fontSize: "40px" }}>🍽️</span>
          <p className="mt-4 text-sm" style={{ color: C.textMuted }}>
            Este proveedor no tiene familias todavía. Ve a Ajustes para añadir la primera.
          </p>
          <button
            onClick={() => setView("settings")}
            className="mt-5 px-5 py-3 rounded-full text-sm font-bold active:scale-95 transition-transform duration-150"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff" }}
          >
            Ir a Ajustes
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-3 overflow-x-auto px-4 py-4">
            {selectedSupplier.categories.map((cat) => {
              const active = cat.id === selectedCatId;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5"
                  style={{ width: "76px" }}
                >
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-150"
                    style={{
                      backgroundColor: active ? hexToRgba(C.blue, 0.25) : "rgba(255,255,255,0.06)",
                      border: `1.5px solid ${active ? hexToRgba(C.blue, 0.7) : C.glassBorder}`,
                      backdropFilter: "blur(14px)",
                      WebkitBackdropFilter: "blur(14px)",
                      boxShadow: active ? `0 0 0 1px ${hexToRgba(C.blue, 0.3)}, 0 8px 20px ${hexToRgba(C.blue, 0.4)}` : "0 4px 14px rgba(0,0,0,0.25)",
                      transform: active ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {emojiFor(cat.id, cat.name)}
                  </div>
                  <span className="text-xs font-bold text-center leading-tight" style={{ color: active ? C.beige : C.textPrimary }}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 px-4 pb-28 overflow-y-auto">
            {selectedCat && selectedCat.products.length === 0 && (
              <p className="text-sm mt-6 text-center" style={{ color: C.textMuted }}>
                Esta familia no tiene productos. Toca el botón "+" para añadir el primero.
              </p>
            )}
            <div className="space-y-2 mt-1">
              {selectedCat &&
                selectedCat.products.map((p) => {
                  const qty = cart[p.id] || 0;
                  const active = qty > 0;
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-colors duration-150"
                      style={{
                        backgroundColor: active ? hexToRgba(C.beige, 0.14) : "rgba(255,255,255,0.05)",
                        border: `1px solid ${active ? hexToRgba(C.beige, 0.45) : C.glassBorder}`,
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        boxShadow: active ? `0 0 0 1px ${hexToRgba(C.beige, 0.25)}, 0 8px 20px ${hexToRgba(C.beige, 0.25)}` : "0 4px 14px rgba(0,0,0,0.2)",
                      }}
                    >
                      <span
                        className="text-sm font-medium flex-1 pr-2"
                        style={{ userSelect: "none", WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
                        onPointerDown={() => startLongPress(selectedSupplier.id, selectedCat.id, p)}
                        onPointerUp={cancelLongPress}
                        onPointerLeave={cancelLongPress}
                        onPointerCancel={cancelLongPress}
                        onContextMenu={(e) => e.preventDefault()}
                      >
                        <span className="mr-1.5" style={{ opacity: 0.5 }}>
                          {emojiFor(selectedCat.id, selectedCat.name)}
                        </span>
                        {p.name}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => changeQty(selectedSupplier.id, p.id, -1)}
                          disabled={qty === 0}
                          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform duration-150 disabled:opacity-30"
                          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}` }}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-7 text-center text-base font-bold" style={{ color: active ? C.beige : C.textPrimary }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => changeQty(selectedSupplier.id, p.id, 1)}
                          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform duration-150"
                          style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, boxShadow: `0 2px 8px ${hexToRgba(C.blue, 0.5)}` }}
                        >
                          <Plus size={16} color="#fff" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}

      {selectedSupplier && selectedSupplier.categories.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4 flex items-center gap-2" style={{ ...GLASS_HEADER, borderTop: `1px solid ${C.glassBorder}` }}>
          <button
            onClick={() => setShowOrder(true)}
            className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}` }}
          >
            <Receipt size={14} color={C.beige} />
            Ver pedido
            {total > 0 && (
              <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: C.beige, color: C.bg }}>
                {total}
              </span>
            )}
          </button>
          <button
            onClick={() => resetOrder(selectedSupplier)}
            disabled={total === 0}
            className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150 disabled:opacity-30"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", border: `1px solid ${C.glassBorder}`, color: C.danger }}
          >
            <RotateCcw size={14} />
            Restablecer
          </button>
          {(selectedSupplier.type || "whatsapp") === "keep" ? (
            <button
              onClick={() => createKeepList(selectedSupplier)}
              className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff", boxShadow: `0 4px 16px ${hexToRgba(C.blue, 0.45)}` }}
            >
              <StickyNote size={14} />
              Crear
            </button>
          ) : (
            <button
              onClick={() => sendWhatsApp(selectedSupplier)}
              className="flex-1 py-3 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-transform duration-150"
              style={{ backgroundImage: `linear-gradient(135deg, ${C.whatsapp}, ${C.whatsappDark})`, color: "#06281a", boxShadow: `0 4px 16px ${hexToRgba(C.whatsapp, 0.45)}` }}
            >
              <MessageCircle size={14} />
              Enviar
            </button>
          )}
        </div>
      )}

      {fabEl}
      {toastEl}
      {quickAddModal}
      {productMenuModal}
      {keepFallbackModal}

      {showOrder && selectedSupplier && (
        <div className="fixed inset-0 z-20 flex items-end justify-center" style={{ backgroundColor: "rgba(0,0,0,0.65)" }} onClick={() => setShowOrder(false)}>
          <div
            className="w-full max-w-md rounded-t-3xl px-5 pt-4 pb-6 max-h-[85vh] overflow-y-auto animate-modal-in"
            style={GLASS}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center gap-1.5 mb-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)" }} />
              ))}
            </div>

            <div className="text-center mb-1">
              <h2 className="text-xl font-extrabold tracking-widest uppercase">{selectedSupplier.name}</h2>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.beige }}>
                Comanda · pedido
              </p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 border-t" style={{ borderColor: C.glassBorder, borderTopWidth: "1px" }} />
              <button onClick={() => setShowOrder(false)} className="px-2 active:scale-90 transition-transform duration-150">
                <X size={20} color={C.textMuted} />
              </button>
            </div>

            <div className="font-mono text-sm">
              {orderLines(selectedSupplier).length === 0 ? (
                <p className="py-6 text-center" style={{ color: C.textMuted }}>
                  🧾 Pedido vacío. Añade productos desde el menú.
                </p>
              ) : (
                orderLines(selectedSupplier).map((group, i) => (
                  <div key={i} className="mb-3">
                    <div className="font-bold flex items-center gap-1.5" style={{ color: C.beige }}>
                      <span>{emojiFor(group.catId, group.catName)}</span>
                      {group.catName}
                    </div>
                    {group.items.map((it, j) => (
                      <div key={j} className="flex justify-between border-b border-dashed py-1" style={{ borderColor: C.glassBorder }}>
                        <span>{it.name}</span>
                        <span>{it.qty}x</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {total > 0 && (
              <>
                <div className="flex items-center gap-2 my-3">
                  <div className="flex-1 border-t border-dashed" style={{ borderColor: C.glassBorder }} />
                  <Scissors size={14} color={C.textMuted} />
                  <div className="flex-1 border-t border-dashed" style={{ borderColor: C.glassBorder }} />
                </div>
                <div className="flex justify-between font-mono text-sm font-bold pb-4">
                  <span>TOTAL ARTÍCULOS</span>
                  <span>{total}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => clearCart(selectedSupplier.id)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", color: C.danger, border: `1px solid ${C.glassBorder}` }}
                  >
                    <Trash2 size={16} />
                    Vaciar
                  </button>
                  {(selectedSupplier.type || "whatsapp") === "keep" ? (
                    <button
                      onClick={() => createKeepList(selectedSupplier)}
                      className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
                      style={{ backgroundImage: `linear-gradient(135deg, ${C.blue}, ${C.blueDark})`, color: "#fff", boxShadow: `0 4px 16px ${hexToRgba(C.blue, 0.45)}` }}
                    >
                      <StickyNote size={16} />
                      Crear
                    </button>
                  ) : (
                    <button
                      onClick={() => sendWhatsApp(selectedSupplier)}
                      className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform duration-150"
                      style={{ backgroundImage: `linear-gradient(135deg, ${C.whatsapp}, ${C.whatsappDark})`, color: "#06281a", boxShadow: `0 4px 16px ${hexToRgba(C.whatsapp, 0.45)}` }}
                    >
                      <MessageCircle size={16} />
                      Enviar
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
