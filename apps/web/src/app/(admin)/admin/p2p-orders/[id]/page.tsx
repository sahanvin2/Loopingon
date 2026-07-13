"use client";

import { useParams } from "next/navigation";
import { P2POrderPortal } from "@/components/order/p2p-order-portal";

export default function AdminP2POrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  return <P2POrderPortal orderId={orderId} />;
}
