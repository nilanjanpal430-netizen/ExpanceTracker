import React, { useState } from "react";
import { StudentDiscount, PriceItem, ScholarshipItem, AppSettings } from "../types";
import { formatCurrency } from "../utils/formatters";
import { Tag, MapPin, ExternalLink, Scale, GraduationCap, CheckCircle2, Search, Filter, Copy, Check } from "lucide-react";

interface StudentDiscountsAndPriceCompProps {
  discounts: StudentDiscount[];
  priceItems: PriceItem[];
  scholarships: ScholarshipItem[];
  settings: AppSettings;
}

export const StudentDiscountsAndPriceComp: React.FC<StudentDiscountsAndPriceCompProps> = ({
  discounts,
  priceItems,
  scholarships,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<"discounts" | "price" | "scholarships">("discounts");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPriceItems = priceItems.filter(
    (p) =>
      p.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScholarships = scholarships.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Tab Header Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("discounts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "discounts"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Nearby Campus Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab("price")}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "price"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70"
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Price Comparison</span>
          </button>

          <button
            onClick={() => setActiveTab("scholarships")}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === "scholarships"
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Scholarship Finder</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tab 1: Nearby Discounts */}
      {activeTab === "discounts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDiscounts.map((disc) => (
            <div
              key={disc.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {disc.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1.5">{disc.shopName}</h3>
                </div>

                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>{disc.distanceKm} km away</span>
                </span>
              </div>

              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 bg-amber-50/80 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200/60 dark:border-amber-800/60">
                {disc.discountText}
              </p>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[180px]">
                  {disc.address}
                </span>

                {disc.code && (
                  <button
                    onClick={() => handleCopyCode(disc.code!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-300 text-xs font-bold transition-all"
                  >
                    {copiedCode === disc.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === disc.code ? "Copied!" : disc.code}</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Price Comparison */}
      {activeTab === "price" && (
        <div className="space-y-4">
          {filteredPriceItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{item.itemName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {item.category}
                  </span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {item.shops.map((shop, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      shop.isBestPrice
                        ? "bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{shop.shopName}</span>
                      {shop.isBestPrice && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white uppercase">
                          Best Price
                        </span>
                      )}
                    </div>

                    <div className="text-lg font-black text-slate-900 dark:text-white">
                      {formatCurrency(shop.price, settings)}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{shop.location}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Scholarship Finder */}
      {activeTab === "scholarships" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScholarships.map((sch) => (
            <div
              key={sch.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {sch.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{sch.title}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{sch.provider}</span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sch.amount, settings)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Grant Amount</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1">
                <div className="text-slate-700 dark:text-slate-300">
                  <strong>Courses:</strong> {sch.eligibleCourses.join(", ")}
                </div>
                <div className="text-slate-700 dark:text-slate-300">
                  <strong>Max Income Cap:</strong> {formatCurrency(sch.minIncomeCap, settings)}/yr
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-rose-600 dark:text-rose-400 font-semibold text-[11px]">
                  Deadline: {sch.deadline}
                </span>

                <a
                  href={sch.applyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-xs"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
