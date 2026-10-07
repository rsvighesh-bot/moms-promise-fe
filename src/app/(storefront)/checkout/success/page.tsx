"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center">
      <div className="flex flex-col items-center gap-6">
        <CheckCircle size={64} className="text-green-500" />
        <div>
          <h1 className="text-3xl text-primary mb-2">Order Placed! 🎉</h1>
          {orderNumber && (
            <p className="text-foreground/60 text-sm">Order #{orderNumber}</p>
          )}
          <p className="text-foreground/70 mt-3 max-w-sm mx-auto">
            Thank you for shopping with moms-promise! Your little one is going to love
            it.
          </p>
        </div>
        <Image
          src="/eagle.svg"
          alt="moms-promise eagle"
          width={120}
          height={200}
          className="opacity-90"
        />
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/products">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          <Link href="/account/orders">
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
