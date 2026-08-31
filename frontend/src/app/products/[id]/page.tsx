"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star, Heart, ShoppingCart, ShieldCheck, Truck,
  RotateCcw, Sparkles, Plus, Minus, Check, Share2, Scale
} from "lucide-react";
import { getProductById, getSimilarProducts } from "../../../lib/api";
import { Product } from "../../../types";
import { formatINR } from "../../../lib/utils";
import { useCartWishlist } from "../../../context/CartWishlistContext";
import { useInteractionTracker } from "../../../context/InteractionTracker";
import ProductCarousel from "../../../components/ProductCarousel";
import SkeletonCard from "../../../components/SkeletonCard";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);

  const { addItemToCart, addItemToWishlist, isInWishlist } = useCartWishlist();
  const { trackView } = useInteractionTracker();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [prod, similar] = await Promise.all([
          getProductById(productId),
          getSimilarProducts(productId, 6).catch(() => []),
        ]);
        setProduct(prod);
        setSimilarProducts(similar || []);
        if (prod.colors) {
          const firstColor = prod.colors.split(",")[0].trim();
          setSelectedColor(firstColor);
        }
        trackView(productId);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [productId, trackView]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 w-1/4 rounded" />
            <div className="h-8 bg-slate-200 dark:bg-slate-700 w-3/4 rounded" />
            <div className="h-6 bg-slate-200 dark:bg-slate-700 w-1/3 rounded" />
            <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product not found</h2>
        <Link href="/products" className="mt-4 inline-block px-5 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-bold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const featuresList = product.features ? JSON.parse(product.features) : [];
  const colorOptions = product.colors ? product.colors.split(",").map((c) => c.trim()) : [];
  const isLiked = isInWishlist(product.id);

  const handleAddToCart = async () => {
    await addItemToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-orange-600">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Hero Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative w-full pt-[90%] bg-slate-100 dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
            <img
              src={product.image}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-md">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Specifications & Purchasing Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                {product.brand}
              </span>
              <div className="flex items-center gap-1.5">
                <Link
                  href={`/compare?ids=${product.id}`}
                  className="text-xs font-semibold text-slate-500 hover:text-orange-600 flex items-center gap-1 p-1"
                  title="Compare with other products"
                >
                  <Scale className="w-3.5 h-3.5" /> Compare
                </Link>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="inline-flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                <span>{product.rating}</span>
                <Star className="w-3 h-3 fill-white" />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {product.review_count.toLocaleString("en-IN")} Verified Customer Reviews
              </span>
            </div>
          </div>

          {/* Pricing in INR */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {formatINR(product.price)}
            </span>
            {product.original_price > product.price && (
              <span className="text-sm text-slate-400 line-through">
                {formatINR(product.original_price)}
              </span>
            )}
            <span className="text-xs text-emerald-600 font-bold">
              Inclusive of all Indian taxes (GST)
            </span>
          </div>

          {/* AI Recommendation Box: Why this product? */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900 dark:text-orange-300">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>AI Intelligence: Why this product?</span>
            </div>
            <p className="text-xs text-orange-800 dark:text-orange-200 leading-relaxed">
              {product.recommendation_reason ||
                `Matches your taste profile in ${product.category}. High compatibility with similar buyer clusters across India with verified ${product.rating}★ rating.`}
            </p>
          </div>

          {/* Color Selection */}
          {colorOptions.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                Available Colors: <span className="font-bold text-orange-600">{selectedColor}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      selectedColor === col
                        ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Key Features Bullet List */}
          {featuresList.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Key Product Highlights
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {featuresList.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Product Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Action Buttons: Quantity, Add to Cart, Wishlist */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-4">
            {/* Quantity Counter */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-600 dark:text-slate-300"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-sm px-2 min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-600 dark:text-slate-300"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                addedAnimation
                  ? "bg-emerald-600 text-white scale-105"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5" /> Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" /> Add to Cart
                </>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => addItemToWishlist(product)}
              className={`p-3 rounded-2xl border transition-all ${
                isLiked
                  ? "bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950"
                  : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-600" : ""}`} />
            </button>
          </div>

          {/* Delivery & Trust Guarantee */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Pan-India Delivery</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-orange-600" />
              <span>100% Genuine</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <span>7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar / Content-Based Recommendations */}
      {similarProducts.length > 0 && (
        <ProductCarousel
          title="Similar Products You May Like"
          subtitle="Generated via TF-IDF semantic embeddings & category affinity"
          products={similarProducts}
          icon={<Sparkles className="w-5 h-5" />}
          badge="Content-Based"
        />
      )}
    </div>
  );
}
