"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WishlistRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/favorites");
  }, [router]);

  return <div className="py-20 text-center text-xs text-slate-400">Redirecting to favorites...</div>;
}
