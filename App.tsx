import React, { useState } from "react";
import {
  Home,
  Heart,
  Landmark,
  PiggyBank,
  MessageCircle,
  ArrowRight,
  Shield,
  User,
  Phone,
} from "lucide-react";

/* =====================
   KONSTANTA KONTAK
===================== */
const CONTACT_NAME = "Susana";
const CONTACT_PHONE = "087781896087";
const CONTACT_WA_URL = "https://wa.me/6287781896087";

/* =====================
   DATA PRODUK (STATIC)
===================== */
const PRODUCTS = [
  {
    id: "health",
    name: "MiUltimate HealthCare",
    category: "Kesehatan",
    desc: "Asuransi kesehatan sesuai tagihan dengan limit besar.",
  },
  {
    id: "syariah",
    name: "Manulife Perlindungan Syariah (FLEXI)",
    category: "Syariah",
    desc: "Asuransi jiwa berbasis prinsip syariah.",
  },
  {
    id: "saving",
    name: "Manulife Saving Protector",
    category: "Saving",
    desc: "Perlindungan jiwa dengan manfaat tunai berkala.",
  },
  {
    id: "legacy",
    name: "MiPreparation Legacy",
    category: "Life",
    desc: "Perencanaan warisan lintas generasi.",
  },
];

/* =====================
   KOMPONEN
===================== */

const ProductCard = ({ name, category, desc }: any) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3">
    <div className="text-xs text-emerald-600 font-semibold mb-1">
      {category}
    </div>
    <h3 className="font-bold text-gray-900 mb-1">{name}</h3>
    <p className="text-sm text-gray-600 mb-3">{desc}</p>
    <a
      href={CONTACT_WA_URL}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center text-sm font-semibold text-white bg-emerald-600 px-4 py-2 rounded-lg"
    >
      <MessageCircle size={16} className="mr-2" />
      Tanya Susana
    </a>
  </div>
);

/* =====================
   APP UTAMA
===================== */

export default function App() {
  const [view, setView] = useState<"home" | "products">("home");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-emerald-700 text-white p-5 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center font-bold">
              M
            </div>
            <span className="font-bold text-lg">Manulife Info</span>
          </div>
          <a
            href={CONTACT_WA_URL}
            target="_blank"
            rel="noreferrer"
            className="bg-white/20 p-2 rounded-full"
          >
            <MessageCircle />
          </a>
        </div>

        <h1 className="text-2xl font-bold leading-tight mb-2">
          Masa Depan <br /> Dimulai Hari Ini
        </h1>
        <p className="text-sm opacity-90 mb-4">
          Konsultasi asuransi kesehatan, syariah, dan investasi bersama agen
          resmi.
        </p>

        <button
          onClick={() => setView("products")}
          className="bg-white text-emerald-700 font-bold px-5 py-3 rounded-xl inline-flex items-center"
        >
          Lihat Produk
          <ArrowRight className="ml-2" size={18} />
        </button>

        {/* KARTU AGEN */}
        <div className="mt-5 bg-white/10 rounded-xl p-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <User className="text-yellow-900" />
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-80">Konsultan Anda</p>
            <p className="font-bold">{CONTACT_NAME}</p>
          </div>
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="bg-emerald-500 p-2 rounded-full"
          >
            <Phone size={18} />
          </a>
        </div>
      </div>

      {/* KONTEN */}
      <div className="p-4 pb-24">
        {view === "home" && (
          <>
            <h2 className="font-bold text-gray-800 mb-4">
              Kategori Produk
            </h2>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <button
                onClick={() => setView("products")}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-rose-500 rounded-2xl flex items-center justify-center text-white mb-1">
                  <Heart />
                </div>
                <span className="text-xs">Kesehatan</span>
              </button>

              <button
                onClick={() => setView("products")}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white mb-1">
                  <Landmark />
                </div>
                <span className="text-xs">Syariah</span>
              </button>

              <button
                onClick={() => setView("products")}
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white mb-1">
                  <PiggyBank />
                </div>
                <span className="text-xs">Saving</span>
              </button>

              <a
                href={CONTACT_WA_URL}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mb-1">
                  <MessageCircle />
                </div>
                <span className="text-xs">Chat WA</span>
              </a>
            </div>
          </>
        )}

        {view === "products" && (
          <>
            <h2 className="text-xl font-bold mb-3">Produk Manulife</h2>
            {PRODUCTS.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </>
        )}
      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
        <button
          onClick={() => setView("home")}
          className="flex flex-col items-center text-xs text-gray-700"
        >
          <Home />
          Home
        </button>
        <button
          onClick={() => setView("products")}
          className="flex flex-col items-center text-xs text-gray-700"
        >
          <Shield />
          Produk
        </button>
      </div>
    </div>
  );
}
