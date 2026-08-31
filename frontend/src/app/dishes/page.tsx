"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DishesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/restaurants");
  }, [router]);

  return <div className="py-20 text-center text-xs text-slate-400">Redirecting to restaurants...</div>;
}
