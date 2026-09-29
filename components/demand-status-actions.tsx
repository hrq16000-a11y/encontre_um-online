"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

const statuses = [
  { value: "contacted", label: "Marcar contatado" },
  { value: "matched", label: "Marcar encontrado" },
  { value: "closed", label: "Fechar" },
  { value: "spam", label: "Spam" },
] as const;

export function DemandStatusActions({
  demandId,
  currentStatus,
}: {
  demandId: string;
  currentStatus: string;
}) {
  const [working, setWorking] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function setStatus(status: (typeof statuses)[number]["value"]) {
    setWorking(true);
    const { error } = await supabase
      .from("demand_requests")
      .update({ status })
      .eq("id", demandId);

    setWorking(false);

    if (!error) {
      router.refresh();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {statuses
        .filter((item) => item.value !== currentStatus)
        .map((item) => (
          <Button
            key={item.value}
            type="button"
            variant="outline"
            size="sm"
            disabled={working}
            onClick={() => setStatus(item.value)}
          >
            {item.label}
          </Button>
        ))}
    </div>
  );
}
