"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Script from "next/script";
import { paymentApi } from "@/lib/api/payment";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/currency";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [razorpayData, setRazorpayData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) { router.replace("/"); return; }
    paymentApi
      .createOrder(orderId)
      .then(setRazorpayData)
      .catch((err: any) =>
        setError(err?.response?.data?.message || "Failed to initiate payment")
      )
      .finally(() => setIsLoading(false));
  }, [orderId]);

  const openRazorpay = (data?: any) => {
    const rzpData = data || razorpayData;
    if (!rzpData || !window.Razorpay) return;
    setIsProcessing(true);
    setError("");
    document.body.style.overflow = "";

    const rzp = new window.Razorpay({
      key: rzpData.keyId,
      amount: rzpData.amount,
      currency: rzpData.currency,
      name: "moms-promise Pop",
      description: `Order #${rzpData.orderNumber}`,
      order_id: rzpData.razorpayOrderId,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        document.body.style.overflow = "";
        try {
          const result = await paymentApi.verify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          router.push(`/checkout/success?orderNumber=${result.order.orderNumber}`);
        } catch (err: any) {
          setError(
            err?.response?.data?.message ||
            "Payment verification failed. Contact support."
          );
          setIsProcessing(false);
        }
      },
      theme: { color: "#1ba2e6" },
      modal: {
        ondismiss: async () => {
          document.body.style.overflow = "";
          setIsProcessing(false);
          setError("Payment was cancelled. Click 'Retry Payment' to try again.");
          try {
            await paymentApi.cancel(orderId as string);
          } catch {
            // silent
          }
        },
      },
    });

    rzp.on("payment.failed", async (response: any) => {
      document.body.style.overflow = "";
      setError(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
      try {
        await paymentApi.cancel(orderId as string);
      } catch {
        // silent
      }
    });

    rzp.open();
  };

  const handleRetry = async () => {
    setError("");
    setIsLoading(true);
    try {
      const freshData = await paymentApi.createOrder(orderId as string);
      setRazorpayData(freshData);
      setIsLoading(false);
      openRazorpay(freshData);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to retry payment.");
      setIsLoading(false);
    }
  };

  // auto-open — poll until window.Razorpay is ready
  useEffect(() => {
    if (!razorpayData || isLoading) return;

    let cancelled = false;
    const tryOpen = () => {
      if (cancelled) return;
      if (window.Razorpay) {
        openRazorpay();
      } else {
        setTimeout(tryOpen, 100);
      }
    };
    tryOpen();

    return () => { cancelled = true; };
  }, [razorpayData, isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-sm text-foreground/60">Setting up your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6 text-center">
      <Image src="/eagle.svg" alt="moms-promise eagle" width={100} height={160} />
      <div>
        <h1 className="text-2xl text-primary mb-2">Complete your payment</h1>
        <p className="text-sm text-foreground/60">
          Order #{razorpayData?.orderNumber} ·{" "}
          {razorpayData?.amount ? formatPrice(razorpayData.amount) : ""}
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-card px-5 py-3 max-w-sm">
          {error}
        </p>
      )}

      {isProcessing ? (
        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <Loader2 size={16} className="animate-spin" />
          Processing payment...
        </div>
      ) : (
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push("/products")}>
            New Arrivals
          </Button>
          {error ? (
            <Button size="lg" onClick={handleRetry}>
              Retry Payment
            </Button>
          ) : (
            <Button size="lg" onClick={() => openRazorpay()}>
              Pay Now
            </Button>
          )}
        </div>
      )}

      <p className="text-xs text-foreground/40">
        Powered by Razorpay — UPI, Cards, Netbanking & Wallets
      </p>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <Loader2 size={36} className="animate-spin text-primary" />
          </div>
        }
      >
        <PaymentContent />
      </Suspense>
    </main>
  );
}