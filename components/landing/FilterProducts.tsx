"use client";

import React from "react";
import { CheckIcon, FilterIcon, ShoppingCart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// 1. Data Definitions
const PRODUCTS = [
  {
    id: 1,
    name: "Get Slim Powder (Mix)",
    category: "weight-management",
    price: 1159,
    originalPrice: 1399,
    rating: 4.9,
    reviews: 100,
    offer: "BOGO",
    offerDetail: "Buy 1 Get 1",
    coins: 58,
    deliveryDate: "1 Mar",
    image: "https://placehold.co/400x400/png?text=Slim+Powder"
  },
  {
    id: 2,
    name: "High Protein Peanut Butter",
    category: "gym-foods",
    price: 499,
    originalPrice: 650,
    rating: 4.8,
    reviews: 840,
    offer: "10%",
    offerDetail: "10% OFF",
    coins: 25,
    deliveryDate: "2 Mar",
    image: "https://placehold.co/400x400/png?text=Peanut+Butter"
  },
  {
    id: 3,
    name: "Glow Skin Kumkumadi Oil",
    category: "skin-care",
    price: 799,
    originalPrice: 999,
    rating: 4.7,
    reviews: 1023,
    offer: "BOGO",
    offerDetail: "Buy 1 Get 1",
    coins: 40,
    deliveryDate: "1 Mar",
    image: "https://placehold.co/400x400/png?text=Skin+Oil"
  },
  {
    id: 4,
    name: "Arjun Tea for Heart Care",
    category: "heart-care",
    price: 349,
    originalPrice: 450,
    rating: 4.6,
    reviews: 312,
    offer: "5%",
    offerDetail: "Limited Offer",
    coins: 15,
    deliveryDate: "3 Mar",
    image: "https://placehold.co/400x400/png?text=Heart+Tea"
  },
  {
    id: 5,
    name: "Daily Vitality Multivitamin",
    category: "daily-wellness",
    price: 899,
    originalPrice: 1100,
    rating: 4.9,
    reviews: 2150,
    offer: "20%",
    offerDetail: "20% OFF",
    coins: 45,
    deliveryDate: "1 Mar",
    image: "https://placehold.co/400x400/png?text=Multivitamin"
  }
];

const CATEGORIES = [
  { id: 'all', label: "All Products", image: "https://placehold.co/100x100/png?text=All" },
  { id: 'gym-foods', label: "Gym Foods", image: "https://placehold.co/100x100/png?text=Gym" },
  { id: 'weight-management', label: "Weight Management", image: "https://placehold.co/100x100/png?text=Weight" },
  { id: 'skin-care', label: "Skin Care", image: "https://placehold.co/100x100/png?text=Skin" },
  { id: 'heart-care', label: "Heart Care", image: "https://placehold.co/100x100/png?text=Heart" },
];

export default function FilterProducts() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 2. State & Logic
  const selectedCategory = searchParams.get("category") || "all";

  const filteredProducts = selectedCategory === "all" 
    ? PRODUCTS 
    : PRODUCTS.filter((p) => p.category === selectedCategory);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", category);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="p-4 md:p-10 lg:p-20 w-full max-w-7xl mx-auto font-sans">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900">Shop Products</h2>

      {/* 3. Category Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-12 p-6 bg-gray-50 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2 mr-4">
          <FilterIcon className="w-5 h-5 text-green-700" />
          <span className="font-bold text-sm uppercase tracking-widest text-gray-600">Select Concern:</span>
        </div>

        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-xl border transition-all duration-300 shadow-sm
                ${isActive 
                  ? "bg-green-50 border-green-600 ring-2 ring-green-600/20 scale-105" 
                  : "bg-white border-gray-200 hover:border-green-400 text-gray-600"
                }
              `}
            >
              {isActive && <CheckIcon className="w-4 h-4 text-green-700" strokeWidth={3} />}
              
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-200">
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover" />
              </div>

              <span className={`text-sm font-semibold whitespace-nowrap ${isActive ? "text-green-900" : "text-gray-700"}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((prod) => (
          <div key={prod.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300">
            
            {/* Image Area */}
            <div className="relative bg-[#F8F9FA] p-6 aspect-square flex items-center justify-center">
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-lg text-[11px] font-bold text-gray-700 shadow-sm">
                <span className="text-yellow-500">★</span> {prod.rating} <span className="text-gray-300">|</span> {prod.reviews}
              </div>

              <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                prod.offer === 'BOGO' ? 'bg-[#F1F8E9] text-[#689F38] border border-[#689F38]' : 'bg-green-100 text-green-800'
              }`}>
                {prod.offer === 'BOGO' ? (
                  <div className="text-center leading-none">
                    <span>BOGO</span>
                    <div className="text-[7px] font-bold mt-0.5">BUY 1 GET 1</div>
                  </div>
                ) : (
                  `${prod.offer} OFF`
                )}
              </div>

              <img src={prod.image} alt={prod.name} className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110" />
            </div>

            {/* Content Area */}
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-[15px] font-bold text-gray-800 line-clamp-2 leading-snug mb-2">
                {prod.name}
              </h3>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-black text-gray-900">₹{prod.price}</span>
                {prod.originalPrice && (
                  <span className="text-sm text-gray-400 line-through font-medium">₹{prod.originalPrice}</span>
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[11px] font-bold w-fit mb-4">
                <div className="bg-amber-400 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center text-[8px]">●</div>
                Earn {prod.coins} Coins
              </div>

              <div className="mt-auto bg-gray-50 p-2 rounded-xl flex items-center gap-2 text-[11px] text-gray-500 border border-gray-100">
                <span className="text-base">🚚</span> 
                <span>Delivered by <span className="font-bold text-gray-800">{prod.deliveryDate}</span></span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex border-t border-gray-100 h-14">
              <button className="w-1/4 flex items-center justify-center bg-zinc-800 hover:bg-black transition-colors group/cart">
                <ShoppingCart className="w-5 h-5 text-white group-hover/cart:scale-110 transition-transform" />
              </button>
              <button className="w-3/4 bg-[#87A94D] hover:bg-[#769443] text-white font-black text-xs tracking-[0.1em] transition-all uppercase">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl mt-10">
          <p className="text-gray-400 font-medium">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}