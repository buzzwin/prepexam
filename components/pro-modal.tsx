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
          <DialogTitle className="flex flex-col items-center justify-center pb-2 gap-y-4">
            <div className="flex items-center py-1 font-bold gap-x-2">
              Upgrade to BerryLabs
              <Badge className="py-1 text-sm uppercase " variant="premium">
                Premium
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription className="pt-2 space-y-2 font-medium text-center  text-zinc-900">
            {tools.map((tool) => (
              <Card
                key={tool.href}
                className="flex items-center justify-between p-3 border-black/5"
              >
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="text-sm font-semibold">{tool.label}</div>
                </div>
                <Check className="w-5 h-5 text-primary" />
              </Card>
            ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-center md:justify-between">
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
                <span className="font-bold"> $29.99</span>
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
              <div className="relative flex flex-col w-full px-5 py-8 md:w-fit bg-slate-50 sm:rounded-2xl">
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
