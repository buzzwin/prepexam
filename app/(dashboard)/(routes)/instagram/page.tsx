"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Instagram from "@/components/swot/instagram";

import { tools } from "@/constant";

const DashboardPage = () => {
  const router = useRouter();
  return (
    <div>
      <div className="mb-4 space-y-4">
        <h2 className="text-2xl font-bold text-center md:text-4xl">
          Explore the power of AI
        </h2>
        <p className="text-sm text-center text-muted-foreground md:text-lg">
          Create Bulk Upload files for creating social posts - Experience the
          power of AI
        </p>
      </div>
      <div className="px-4 space-y-4 md:px-20 lg:px-32">
        <Instagram></Instagram>
      </div>
    </div>
  );
};

export default DashboardPage;
