import MaxWidthWrapper from "@/components/max-width-wrapper";
import UpgradeButton from "@/components/upgrade-button";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PLANS } from "@/constant";
import { cn } from "@/lib/utils";

import { ArrowRight, Check, HelpCircle, Minus, Asterisk } from "lucide-react";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

const Page = () => {
  const { userId } = auth();

  const pricingItems = [
    {
      plan: "Pay as You Go",
      tagline: "Small or Large projects, use as you wish.",
      quota: 100,
      quotaCharacter: "Flexible",
      features: [
        {
          text: "5 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "4MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "~10 hours of generated audio using text-to-speech",
        },
        {
          text: "Create up to 160 custom voices",
        },
        {
          text: "Unlimited total characters/month",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "High-quality responses",

          negative: false,
        },
        {
          text: "Priority support",
          negative: false,
        },
      ],
    },
    {
      plan: "Premium",
      tagline: "For larger projects with higher needs.",
      quota: PLANS.find((p) => p.slug === "premium")!.quota,
      quotaCharacter: "250.000",
      features: [
        {
          text: "25 pages per File",
          footnote: "The maximum amount of pages per file.",
        },
        {
          text: "16MB file size limit",
          footnote: "The maximum file size of a single file.",
        },
        {
          text: "~10 hours of generated audio using text-to-speech",
        },
        {
          text: "Create up to 160 custom voices",
        },
        {
          text: "Additional usage-based characters at 5 cents per 1000 characters",
        },
        {
          text: "Mobile-friendly interface",
        },
        {
          text: "High-quality responses",
        },
        {
          text: "Priority support",
        },
      ],
    },
  ];

  return (
    <>
      <MaxWidthWrapper className="max-w-5xl mb-8 text-center">
        <div className="mx-auto sm:max-w-lg">
          <h1 className="text-6xl font-bold sm:text-7xl">Pricing</h1>
          <p className="mt-5 text-gray-600 sm:text-lg">
            Whether you&apos;re just trying out our service or need more,
            we&apos;ve got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-12 lg:grid-cols-2">
          <TooltipProvider>
            {pricingItems.map(
              ({ plan, tagline, quota, quotaCharacter, features }) => {
                const price =
                  PLANS.find((p) => p.slug.toLowerCase() === plan.toLowerCase())
                    ?.price.amount || 0;

                return (
                  <div
                    key={plan}
                    className={cn("relative rounded-2xl bg-white shadow-lg", {
                      "border-2 border-blue-600 shadow-blue-200":
                        plan === "Premium",
                      "border border-gray-200": plan !== "Premium",
                    })}
                  >
                    {plan === "Premium" && (
                      <div className="absolute left-0 right-0 w-32 px-3 py-2 mx-auto text-sm font-medium text-white rounded-full -top-5 bg-gradient-to-r from-blue-600 to-cyan-600">
                        Upgrade now
                      </div>
                    )}

                    <div className="p-5">
                      <h3 className="my-3 text-3xl font-bold text-center font-display">
                        {plan}
                      </h3>
                      <p className="text-gray-500">{tagline}</p>
                      {plan !== "Premium" ? (
                        <p className="relative float-right sm:right-2 md:right-32 lg:right-6 top-3">
                          <Tooltip delayDuration={300}>
                            <TooltipTrigger className="cursor-default ml-1.5 flex">
                              <Asterisk className="w-4 h-4 text-zinc-500" />
                              <Asterisk className="w-4 h-4 text-zinc-500" />
                            </TooltipTrigger>
                            <TooltipContent className="p-2 w-80">
                              {"Starting from"}
                            </TooltipContent>
                          </Tooltip>
                        </p>
                      ) : null}
                      <p className="my-5 text-6xl font-semibold font-display">
                        {plan === "Premium" ? "$" : ""} {price.toLocaleString()}
                      </p>
                      <p className="text-gray-500">
                        {" "}
                        {plan === "Premium"
                          ? "Unlimited Access"
                          : "per document uploaded/voice downloaded"}
                      </p>
                    </div>

                    <div className="flex items-center justify-center h-20 border-t border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center space-x-1">
                        <div>
                          <p className="flex">
                            {quota.toLocaleString()} Files/mo included
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5 flex">
                                <HelpCircle className="w-4 h-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="p-2 w-80">
                                Document Interaction Feature Access
                              </TooltipContent>
                            </Tooltip>
                          </p>
                          <p className="flex">
                            {quotaCharacter.toLocaleString()} total
                            characters/month
                            <Tooltip delayDuration={300}>
                              <TooltipTrigger className="cursor-default ml-1.5 flex">
                                <HelpCircle className="w-4 h-4 text-zinc-500" />
                              </TooltipTrigger>
                              <TooltipContent className="p-2 w-80">
                                Generate Voice Feature Access
                              </TooltipContent>
                            </Tooltip>
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul className="px-8 my-10 space-y-5">
                      {features.map(({ text, footnote, negative }, index) => (
                        <li key={index} className="flex space-x-5">
                          <div className="flex-shrink-0">
                            {negative ? (
                              <Minus className="w-6 h-6 text-gray-300" />
                            ) : (
                              <Check className="w-6 h-6 text-blue-500" />
                            )}
                          </div>
                          {footnote ? (
                            <div className="flex items-center space-x-1">
                              <p
                                className={cn("text-gray-600", {
                                  "text-gray-400": negative,
                                })}
                              >
                                {text}
                              </p>
                              <Tooltip delayDuration={300}>
                                <TooltipTrigger className="cursor-default ml-1.5">
                                  <HelpCircle className="w-4 h-4 text-zinc-500" />
                                </TooltipTrigger>
                                <TooltipContent className="p-2 w-80">
                                  {footnote}
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ) : (
                            <p
                              className={cn("text-gray-600 text-left", {
                                "text-gray-400": negative,
                              })}
                            >
                              {text}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200" />
                    <div className="p-5">
                      {plan === "Pay as You Go" ? (
                        <Link
                          href={userId ? "/dashboard" : "/sign-in"}
                          className={buttonVariants({
                            className: "w-full",
                            variant: "secondary",
                          })}
                        >
                          {userId ? "Start Generating" : "Sign up"}
                          <ArrowRight className="h-5 w-5 ml-1.5" />
                        </Link>
                      ) : userId ? (
                        <UpgradeButton />
                      ) : (
                        <Link
                          href="/sign-in"
                          className={buttonVariants({
                            className: "w-full",
                          })}
                        >
                          {userId ? "Upgrade now" : "Sign up"}
                          <ArrowRight className="h-5 w-5 ml-1.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </TooltipProvider>
        </div>
      </MaxWidthWrapper>
    </>
  );
};

export default Page;
