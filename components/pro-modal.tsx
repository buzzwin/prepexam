"use client";

import { Check, Zap } from "lucide-react";

import { productName, tools } from "@/constant";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-modal";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

import { usePricing } from "@/hooks/use-pricing";
import UseMidtrans from "@/hooks/use-midtrans";

const ProModal = () => {
  const proModal = useProModal();
  const { payAsYouGoPrice } = usePricing();
  const { handleCheckout } = UseMidtrans();

  const handleClickUpgrade = (subscriptionType: string) => {
    const selectedProductName = productName.speechSynthesis;

    handleCheckout(subscriptionType, selectedProductName);
    setTimeout(() => {
      proModal.onClose();
    }, 1000);
  };

  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="sm:max-w-lg md:min-w-max">
        <DialogHeader>
          <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
            <div className="flex items-center gap-x-2 font-bold py-1">
              Upgrade to BerryLabs
              <Badge className=" uppercase text-sm py-1" variant="premium">
                Premium
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className=" text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="p-3 border-black/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">{tool.label}</div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="md:justify-between items-center">
          <div
            className={cn(
              "w-full relative flex flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl",
              {
                "md:w-fit": proModal.payAsYouGoPriceVisible,
                "md:w-full": !proModal.payAsYouGoPriceVisible,
              }
            )}
          >
            <p className="flex items-center justify-center">
              <span className="text-[2rem] leading-none text-slate-900">
                IDR
                <span className="font-bold"> 499Rb</span>
              </span>
              <span className="ml-3 text-sm">
                <span className="font-semibold text-slate-900">
                  One Time Payment
                </span>
                <br />
                <span className="font-semibold text-slate-500">
                  Unlimited Access
                </span>
              </span>
            </p>
            <Button
              variant="premium2"
              size="lg"
              className="w-full mt-3"
              onClick={() => handleClickUpgrade("PREMIUM")}
            >
              Premium
              <Zap className="w-4 h-4 ml-2 fill-white" />
            </Button>
          </div>
          {/* only show Premium Subscription when there's no download  */}
          {proModal.payAsYouGoPriceVisible ? (
            <>
              <div className="font-bold">Or</div>
              <div className="w-full md:w-fit relative flex flex-col bg-slate-50 px-5 py-8 sm:rounded-2xl">
                <p className="flex items-center justify-center">
                  <span className="text-[2rem] leading-none text-slate-900">
                    IDR
                    <span className="font-bold">
                      {" "}
                      {payAsYouGoPrice.toLocaleString()}
                    </span>
                  </span>
                  <span className="ml-3 text-sm">
                    <span className="font-semibold text-slate-900">
                      Flexible Payment
                    </span>
                    <br />
                    <span className="font-semibold text-slate-500">
                      Use As You Wish
                    </span>
                  </span>
                </p>
                <Button
                  variant="premium"
                  size="lg"
                  className="w-full mt-3"
                  onClick={() => handleClickUpgrade("FLEXIBLE")}
                >
                  Pay as You Go
                  <Zap className="w-4 h-4 ml-2 fill-white" />
                </Button>
              </div>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
