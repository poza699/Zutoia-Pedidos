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
} from "lucide-react";

const C = {
  cream: "#FBF3E7",
  paper: "#FFFCF6",
  charcoal: "#241D1A",
  charcoalLight: "#372C28",
  wine: "#7E1F2E",
  wineDark: "#591521",
  mustard: "#D89A28",
  mustardDark: "#A8740F",
  muted: "#9C8C7C",
  border: "#E8DCC8",
  whatsapp: "#25D366",
  whatsappDark: "#1AA855",
  danger: "#B5453A",
};

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const PAPER_TEXTURE = {
  backgroundColor: C.cream,
  backgroundImage: `radial-gradient(circle at 1px 1px, ${hexToRgba(C.wine, 0.05)} 1px, transparent 0)`,
  backgroundSize: "16px 16px",
};

const HEADER_TEXTURE = {
  backgroundColor: C.charcoal,
  backgroundImage: `repeating-linear-gradient(135deg, ${hexToRgba("#ffffff", 0.025)} 0px, ${hexToRgba(
    "#ffffff",
    0.025
  )} 1px, transparent 1px, transparent 9px)`,
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
};

function emojiFor(catId) {
  return FAMILY_EMOJI[catId] || "🏷️";
}

const DEFAULT_SUPPLIERS = [
  {
    id: "sup-kodeka",
    name: "KODEKA",
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
];

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [suppliers, setSuppliers] = useState(DEFAULT_SUPPLIERS);
  const [carts, setCarts] = useState({});
  const [view, setView] = useState("home"); // home | order | settings
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedCatId, setSelectedCatId] = useState(null);
  const [showOrder, setShowOrder] = useState(false);
  const [warning, setWarning] = useState("");
  const [info, setInfo] = useState("");

  const [collapsedSuppliers, setCollapsedSuppliers] = useState({});
  const [collapsedCats, setCollapsedCats] = useState({});
  const [newCatNameBySupplier, setNewCatNameBySupplier] = useState({});
  const [newProductInputs, setNewProductInputs] = useState({});
  const [newSupplierName, setNewSupplierName] = useState("");
  const [newSupplierNumber, setNewSupplierNumber] = useState("");
  const [newSupplierGreeting, setNewSupplierGreeting] = useState("");

  const skipSave = useRef(true);
  const fileInputRef = useRef(null);

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
      setWarning("No se pudo guardar en este navegador (almacenamiento lleno o bloqueado).");
    }
  }, [suppliers, carts]);

  function selectSupplier(supplierId) {
    const sup = suppliers.find((s) => s.id === supplierId);
    setSelectedSupplierId(supplierId);
    setSelectedCatId(sup && sup.categories.length > 0 ? sup.categories[0].id : null);
    setWarning("");
    setView("order");
  }

  function goHome() {
    setView("home");
    setWarning("");
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

  function updateSupplierField(supplierId, field, value) {
    setSuppliers((prev) => prev.map((s) => (s.id === supplierId ? { ...s, [field]: value } : s)));
  }

  function addSupplier() {
    const name = newSupplierName.trim();
    if (!name) return;
    const sup = {
      id: uid(),
      name,
      waNumber: sanitizeNumber(newSupplierNumber),
      greeting: newSupplierGreeting.trim() || "Aupa, te dejo el pedido por aquí:",
      categories: [],
    };
    setSuppliers((prev) => [...prev, sup]);
    setNewSupplierName("");
    setNewSupplierNumber("");
    setNewSupplierGreeting("");
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

  function addProduct(supplierId, catId) {
    const name = (newProductInputs[catId] || "").trim();
    if (!name) return;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === supplierId
          ? {
              ...s,
              categories: s.categories.map((c) =>
                c.id === catId ? { ...c, products: [...c.products, { id: uid(), name }] } : c
              ),
            }
          : s
      )
    );
    setNewProductInputs((prev) => ({ ...prev, [catId]: "" }));
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
      setWarning(`Configura el número de WhatsApp de ${supplier.name} en Ajustes antes de enviar.`);
      return;
    }
    if (totalItems(supplier.id) === 0) {
      setWarning("Añade al menos un producto antes de enviar el pedido.");
      return;
    }
    setWarning("");
    const text = buildWhatsAppText(supplier);
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(text)}`, "_blank");
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
    setInfo("Archivo exportado. Guárdalo donde quieras (Drive, el móvil, etc).");
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
          setWarning("El archivo no tiene el formato esperado.");
          return;
        }
        setSuppliers(data.suppliers);
        setCarts(data.carts || {});
        setWarning("");
        setInfo("Datos importados correctamente.");
      } catch (err) {
        setWarning("No se pudo leer el archivo. Asegúrate de que es un JSON exportado desde esta app.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId);
  const selectedCat = selectedSupplier && selectedSupplier.categories.find((c) => c.id === selectedCatId);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={PAPER_TEXTURE}>
        <div className="text-sm font-bold tracking-wide" style={{ color: C.wine }}>
          🍷 Preparando la barra...
        </div>
      </div>
    );
  }

  const warningBanner = warning ? (
    <div
      className="fixed left-4 right-4 z-30 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
      style={{ bottom: view === "order" ? "92px" : "20px", backgroundColor: C.danger, color: C.cream }}
      onClick={() => setWarning("")}
    >
      <span>⚠️</span>
      {warning}
    </div>
  ) : null;

  const infoBanner = info ? (
    <div
      className="fixed left-4 right-4 z-30 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2"
      style={{ bottom: view === "order" ? "92px" : "20px", backgroundColor: C.wine, color: C.cream }}
      onClick={() => setInfo("")}
    >
      <span>✅</span>
      {info}
    </div>
  ) : null;

  // ---------- SETTINGS ----------
  if (view === "settings") {
    return (
      <div className="min-h-screen pb-10" style={PAPER_TEXTURE}>
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-5" style={{ ...HEADER_TEXTURE, borderBottom: `3px solid ${C.mustard}` }}>
          <button onClick={goHome} className="p-1.5 rounded-full active:scale-90 transition-transform" style={{ backgroundColor: C.charcoalLight }}>
            <ChevronLeft size={22} color={C.cream} />
          </button>
          <h1 className="text-lg font-bold tracking-wide flex-1" style={{ color: C.cream }}>
            ⚙️ Ajustes
          </h1>
        </div>

        <div className="px-4 pt-5">
          <div className="flex gap-2 mb-5">
            <button
              onClick={exportData}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ backgroundColor: C.wine, color: C.cream }}
            >
              <Download size={16} />
              Exportar JSON
            </button>
            <button
              onClick={triggerImport}
              className="flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ backgroundColor: C.paper, color: C.wine, border: `1.5px solid ${C.wine}` }}
            >
              <Upload size={16} />
              Importar JSON
            </button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportFile} />
          </div>

          <div className="space-y-4">
            {suppliers.map((sup) => {
              const isCollapsed = collapsedSuppliers[sup.id] === undefined ? true : collapsedSuppliers[sup.id];
              const badgeEmoji = sup.categories[0] ? emojiFor(sup.categories[0].id) : "🏪";
              return (
                <div key={sup.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.paper, border: `1px solid ${C.border}`, boxShadow: `0 2px 8px ${hexToRgba(C.charcoal, 0.06)}` }}>
                  <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: C.cream }}>
                    <button
                      onClick={() => setCollapsedSuppliers((p) => ({ ...p, [sup.id]: !isCollapsed }))}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {isCollapsed ? <ChevronDown size={18} color={C.charcoal} /> : <ChevronUp size={18} color={C.charcoal} />}
                      <span className="text-lg">{badgeEmoji}</span>
                      <span className="font-bold" style={{ color: C.charcoal }}>
                        {sup.name}
                      </span>
                      <span className="text-xs" style={{ color: C.muted }}>
                        ({sup.categories.length} fam.)
                      </span>
                    </button>
                    <button onClick={() => deleteSupplier(sup.id)} className="p-2 active:scale-90 transition-transform">
                      <Trash2 size={18} color={C.danger} />
                    </button>
                  </div>

                  {!isCollapsed && (
                    <div className="px-4 py-4 space-y-4">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.wine }}>
                          🏷️ Nombre
                        </p>
                        <input
                          type="text"
                          value={sup.name}
                          onChange={(e) => updateSupplierField(sup.id, "name", e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                          style={{ backgroundColor: C.cream, border: `1.5px solid ${C.border}`, color: C.charcoal }}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.wine }}>
                          💬 WhatsApp
                        </p>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={sup.waNumber}
                          onChange={(e) => updateSupplierField(sup.id, "waNumber", sanitizeNumber(e.target.value))}
                          placeholder="34600111222"
                          className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none"
                          style={{ backgroundColor: C.cream, border: `1.5px solid ${C.border}`, color: C.charcoal }}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: C.wine }}>
                          ✉️ Mensaje de saludo
                        </p>
                        <textarea
                          value={sup.greeting}
                          onChange={(e) => updateSupplierField(sup.id, "greeting", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                          style={{ backgroundColor: C.cream, border: `1.5px solid ${C.border}`, color: C.charcoal }}
                        />
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: C.wine }}>
                          🗂️ Familias y productos
                        </p>
                        <div className="space-y-3">
                          {sup.categories.map((cat) => {
                            const catCollapsed = collapsedCats[cat.id];
                            return (
                              <div key={cat.id} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
                                <div className="flex items-center gap-2 px-3 py-2.5" style={{ backgroundColor: C.cream }}>
                                  <button onClick={() => setCollapsedCats((p) => ({ ...p, [cat.id]: !p[cat.id] }))} className="p-0.5 flex-shrink-0">
                                    {catCollapsed ? <ChevronDown size={16} color={C.charcoal} /> : <ChevronUp size={16} color={C.charcoal} />}
                                  </button>
                                  <span className="flex-shrink-0">{emojiFor(cat.id)}</span>
                                  <input
                                    type="text"
                                    value={cat.name}
                                    onChange={(e) => updateCategoryName(sup.id, cat.id, e.target.value)}
                                    className="text-sm font-bold bg-transparent outline-none flex-1 min-w-0"
                                    style={{ color: C.charcoal }}
                                  />
                                  <span className="text-xs flex-shrink-0" style={{ color: C.muted }}>
                                    ({cat.products.length})
                                  </span>
                                  <button onClick={() => deleteCategory(sup.id, cat.id)} className="p-1 flex-shrink-0 active:scale-90 transition-transform">
                                    <Trash2 size={16} color={C.danger} />
                                  </button>
                                </div>
                                {!catCollapsed && (
                                  <div className="px-3 py-3" style={{ backgroundColor: C.paper }}>
                                    {cat.products.length === 0 && (
                                      <p className="text-xs mb-2" style={{ color: C.muted }}>
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
                                            style={{ color: C.charcoal }}
                                          />
                                          <button onClick={() => deleteProduct(sup.id, cat.id, p.id)} className="p-1 active:scale-90 transition-transform flex-shrink-0">
                                            <X size={15} color={C.muted} />
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
                                        style={{ backgroundColor: C.cream, border: `1px solid ${C.border}`, color: C.charcoal }}
                                      />
                                      <button
                                        onClick={() => addProduct(sup.id, cat.id)}
                                        className="px-3 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform"
                                        style={{ backgroundColor: C.wine, color: C.cream }}
                                      >
                                        Añadir
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 p-3 rounded-xl" style={{ border: `2px dashed ${C.mustard}`, backgroundColor: hexToRgba(C.mustard, 0.06) }}>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newCatNameBySupplier[sup.id] || ""}
                              onChange={(e) => setNewCatNameBySupplier((p) => ({ ...p, [sup.id]: e.target.value }))}
                              onKeyDown={(e) => e.key === "Enter" && addCategory(sup.id)}
                              placeholder="Nueva familia"
                              className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                              style={{ backgroundColor: C.paper, border: `1px solid ${C.border}`, color: C.charcoal }}
                            />
                            <button
                              onClick={() => addCategory(sup.id)}
                              className="px-3 py-2 rounded-lg text-sm font-bold active:scale-95 transition-transform"
                              style={{ backgroundColor: C.mustard, color: C.charcoal }}
                            >
                              + Familia
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="p-4 rounded-2xl" style={{ border: `2px dashed ${C.wine}`, backgroundColor: hexToRgba(C.wine, 0.05) }}>
              <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.wine }}>
                🏪 Nuevo proveedor
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="Nombre del proveedor"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: C.paper, border: `1.5px solid ${C.border}`, color: C.charcoal }}
                />
                <input
                  type="tel"
                  inputMode="numeric"
                  value={newSupplierNumber}
                  onChange={(e) => setNewSupplierNumber(sanitizeNumber(e.target.value))}
                  placeholder="Número WhatsApp (ej: 34600111222)"
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-mono outline-none"
                  style={{ backgroundColor: C.paper, border: `1.5px solid ${C.border}`, color: C.charcoal }}
                />
                <input
                  type="text"
                  value={newSupplierGreeting}
                  onChange={(e) => setNewSupplierGreeting(e.target.value)}
                  placeholder="Mensaje de saludo"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ backgroundColor: C.paper, border: `1.5px solid ${C.border}`, color: C.charcoal }}
                />
                <button
                  onClick={addSupplier}
                  className="w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform"
                  style={{ backgroundColor: C.wine, color: C.cream }}
                >
                  + Crear proveedor
                </button>
              </div>
            </div>
          </div>
        </div>
        {warningBanner}
        {infoBanner}
      </div>
    );
  }

  // ---------- HOME ----------
  if (view === "home") {
    return (
      <div className="min-h-screen flex flex-col" style={PAPER_TEXTURE}>
        <div className="sticky top-0 z-10 px-5 pt-5 pb-4" style={{ ...HEADER_TEXTURE, borderBottom: `3px solid ${C.mustard}` }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wide" style={{ color: C.cream }}>
                Zutoia
              </h1>
              <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: C.mustard }}>
                🏪 Elige proveedor
              </p>
            </div>
            <button
              onClick={() => setView("settings")}
              className="p-2.5 rounded-full active:scale-90 transition-transform"
              style={{ backgroundColor: C.charcoalLight, border: `1px solid ${hexToRgba("#ffffff", 0.08)}` }}
            >
              <Settings size={20} color={C.cream} />
            </button>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 space-y-3">
          {suppliers.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center px-6 pt-16">
              <span style={{ fontSize: "40px" }}>🏪</span>
              <p className="mt-4 text-sm" style={{ color: C.muted }}>
                Aún no tienes proveedores. Ve a Ajustes para crear el primero.
              </p>
            </div>
          )}
          {suppliers.map((sup) => {
            const total = totalItems(sup.id);
            const badgeEmoji = sup.categories[0] ? emojiFor(sup.categories[0].id) : "🏪";
            return (
              <button
                key={sup.id}
                onClick={() => selectSupplier(sup.id)}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl active:scale-95 transition-transform"
                style={{ backgroundColor: C.paper, border: `1px solid ${C.border}`, boxShadow: `0 2px 8px ${hexToRgba(C.charcoal, 0.06)}` }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: C.cream, border: `1.5px solid ${C.border}` }}
                >
                  {badgeEmoji}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold" style={{ color: C.charcoal }}>
                    {sup.name}
                  </p>
                  <p className="text-xs" style={{ color: C.muted }}>
                    {sup.categories.length} familia{sup.categories.length !== 1 ? "s" : ""}
                  </p>
                </div>
                {total > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0" style={{ backgroundColor: C.mustard, color: C.charcoal }}>
                    {total}
                  </span>
                )}
                <ChevronRight size={18} color={C.muted} className="flex-shrink-0" />
              </button>
            );
          })}
        </div>
        {warningBanner}
        {infoBanner}
      </div>
    );
  }

  // ---------- ORDER ----------
  const cart = selectedSupplier ? getCart(selectedSupplier.id) : {};
  const total = selectedSupplier ? totalItems(selectedSupplier.id) : 0;

  return (
    <div className="min-h-screen flex flex-col" style={PAPER_TEXTURE}>
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-4" style={{ ...HEADER_TEXTURE, borderBottom: `3px solid ${C.mustard}` }}>
        <div className="flex items-center gap-3">
          <button onClick={goHome} className="p-1.5 rounded-full active:scale-90 transition-transform" style={{ backgroundColor: C.charcoalLight }}>
            <ChevronLeft size={22} color={C.cream} />
          </button>
          <div>
            <h1 className="font-serif text-xl font-bold tracking-wide" style={{ color: C.cream }}>
              {selectedSupplier ? selectedSupplier.name : "Pedido"}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: C.mustard }}>
              🧾 Zutoia · Pedido
            </p>
          </div>
        </div>
        <button
          onClick={() => setView("settings")}
          className="p-2.5 rounded-full active:scale-90 transition-transform"
          style={{ backgroundColor: C.charcoalLight, border: `1px solid ${hexToRgba("#ffffff", 0.08)}` }}
        >
          <Settings size={20} color={C.cream} />
        </button>
      </div>

      {!selectedSupplier || selectedSupplier.categories.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <span style={{ fontSize: "40px" }}>🍽️</span>
          <p className="mt-4 text-sm" style={{ color: C.muted }}>
            Este proveedor no tiene familias todavía. Ve a Ajustes para añadir la primera.
          </p>
          <button
            onClick={() => setView("settings")}
            className="mt-5 px-5 py-3 rounded-xl text-sm font-bold active:scale-95 transition-transform"
            style={{ backgroundColor: C.wine, color: C.cream }}
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
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform"
                    style={{
                      backgroundColor: active ? C.wine : C.paper,
                      border: `1.5px solid ${active ? C.wine : C.border}`,
                      boxShadow: active ? `0 4px 12px ${hexToRgba(C.wine, 0.35)}` : `0 1px 3px ${hexToRgba(C.charcoal, 0.07)}`,
                      transform: active ? "scale(1.05)" : "scale(1)",
                    }}
                  >
                    {emojiFor(cat.id)}
                  </div>
                  <span className="text-xs font-bold text-center leading-tight" style={{ color: active ? C.wine : C.charcoal }}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 px-4 pb-28 overflow-y-auto">
            {selectedCat && selectedCat.products.length === 0 && (
              <p className="text-sm mt-6 text-center" style={{ color: C.muted }}>
                Esta familia no tiene productos. Añádelos desde Ajustes.
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
                      className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-colors"
                      style={{
                        backgroundColor: active ? hexToRgba(C.mustard, 0.1) : C.paper,
                        border: `1px solid ${active ? C.mustard : C.border}`,
                        borderLeftWidth: "4px",
                        borderLeftColor: active ? C.wine : C.border,
                        boxShadow: `0 1px 3px ${hexToRgba(C.charcoal, 0.05)}`,
                      }}
                    >
                      <span className="text-sm font-medium flex-1 pr-2" style={{ color: C.charcoal }}>
                        <span className="mr-1.5" style={{ opacity: 0.4 }}>
                          {emojiFor(selectedCat.id)}
                        </span>
                        {p.name}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => changeQty(selectedSupplier.id, p.id, -1)}
                          disabled={qty === 0}
                          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform disabled:opacity-30"
                          style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }}
                        >
                          <Minus size={16} color={C.charcoal} />
                        </button>
                        <span className="w-7 text-center text-base font-bold" style={{ color: active ? C.wine : C.charcoal }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => changeQty(selectedSupplier.id, p.id, 1)}
                          className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                          style={{ backgroundImage: `linear-gradient(135deg, ${C.wine}, ${C.wineDark})`, boxShadow: `0 2px 6px ${hexToRgba(C.wine, 0.4)}` }}
                        >
                          <Plus size={16} color={C.cream} />
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
        <div
          className="fixed bottom-0 left-0 right-0 px-4 pt-3 pb-4 flex items-center gap-3"
          style={{ backgroundColor: C.charcoal, borderTop: `3px solid ${C.mustard}`, boxShadow: `0 -4px 14px ${hexToRgba(C.charcoal, 0.25)}` }}
        >
          <button
            onClick={() => setShowOrder(true)}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ backgroundColor: C.charcoalLight, color: C.cream, border: `1.5px solid ${C.mustard}` }}
          >
            <Receipt size={16} color={C.mustard} />
            Ver pedido
            {total > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ backgroundColor: C.mustard, color: C.charcoal }}>
                {total}
              </span>
            )}
          </button>
          <button
            onClick={() => sendWhatsApp(selectedSupplier)}
            className="flex-1 py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.whatsapp}, ${C.whatsappDark})`, color: C.charcoal, boxShadow: `0 4px 12px ${hexToRgba(C.whatsapp, 0.4)}` }}
          >
            <MessageCircle size={16} color={C.charcoal} />
            Enviar
          </button>
        </div>
      )}

      {warningBanner}
      {infoBanner}

      {showOrder && selectedSupplier && (
        <div className="fixed inset-0 z-20 flex items-end justify-center" style={{ backgroundColor: hexToRgba(C.charcoal, 0.6) }} onClick={() => setShowOrder(false)}>
          <div
            className="w-full max-w-md rounded-t-3xl px-5 pt-4 pb-6 max-h-[85vh] overflow-y-auto"
            style={{ backgroundColor: C.paper }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center gap-1.5 mb-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: C.cream, border: `1px solid ${C.border}` }} />
              ))}
            </div>

            <div className="text-center mb-1">
              <h2 className="font-serif text-xl font-bold tracking-widest uppercase" style={{ color: C.wine }}>
                {selectedSupplier.name}
              </h2>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: C.mustardDark }}>
                Comanda · pedido
              </p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1 border-t" style={{ borderColor: C.charcoal, borderTopWidth: "2px" }} />
              <button onClick={() => setShowOrder(false)} className="px-2 active:scale-90 transition-transform">
                <X size={20} color={C.muted} />
              </button>
            </div>

            <div className="font-mono text-sm" style={{ color: C.charcoal }}>
              {orderLines(selectedSupplier).length === 0 ? (
                <p className="py-6 text-center" style={{ color: C.muted }}>
                  🧾 Pedido vacío. Añade productos desde el menú.
                </p>
              ) : (
                orderLines(selectedSupplier).map((group, i) => (
                  <div key={i} className="mb-3">
                    <div className="font-bold flex items-center gap-1.5" style={{ color: C.wineDark }}>
                      <span>{emojiFor(group.catId)}</span>
                      {group.catName}
                    </div>
                    {group.items.map((it, j) => (
                      <div key={j} className="flex justify-between border-b border-dashed py-1" style={{ borderColor: C.border }}>
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
                  <div className="flex-1 border-t border-dashed" style={{ borderColor: C.muted }} />
                  <Scissors size={14} color={C.muted} />
                  <div className="flex-1 border-t border-dashed" style={{ borderColor: C.muted }} />
                </div>
                <div className="flex justify-between font-mono text-sm font-bold pb-4" style={{ color: C.charcoal }}>
                  <span>TOTAL ARTÍCULOS</span>
                  <span>{total}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => clearCart(selectedSupplier.id)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    style={{ backgroundColor: C.cream, color: C.danger, border: `1.5px solid ${C.border}` }}
                  >
                    <Trash2 size={16} />
                    Vaciar
                  </button>
                  <button
                    onClick={() => sendWhatsApp(selectedSupplier)}
                    className="flex-1 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    style={{ backgroundImage: `linear-gradient(135deg, ${C.whatsapp}, ${C.whatsappDark})`, color: C.charcoal, boxShadow: `0 4px 12px ${hexToRgba(C.whatsapp, 0.4)}` }}
                  >
                    <MessageCircle size={16} />
                    Enviar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
