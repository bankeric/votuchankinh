"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
// import { UpgradeModal } from "@/components/v2/upgrade-modal";

const pricingPlans = [
  {
    id: "tam-an",
    name: "Tâm An – Gói miễn phí",
    icon: Star,
    price: "0 đ",
    yearlyPrice: null,
    features: [
      "Trò chuyện với tác nhân Tâm An",
      "Không cần đăng nhập: tối đa 20 câu hỏi/ngày",
      "Đăng nhập miễn phí để dùng không giới hạn và lưu lịch sử"
    ],
    buttonText: "Dùng thử ngay",
    popular: false,
    // discountNote: "Miễn phí"
  },
  {
    id: "giac-ngo",
    name: "Giác Ngộ – Gói Pro",
    icon: Zap,
    price: "99.000 đ/tháng",
    yearlyPrice: "1.069.200 đ/năm (giảm 10%)",
    features: [
      "Truy cập tác nhân Giác Ngộ với mô hình hiểu biết sâu hơn",
      "Không giới hạn lượt hỏi, lưu lịch sử trên nhiều thiết bị",
      "Trả lời sâu sắc hơn",
      "Ưu tiên hỗ trợ"
    ],
    buttonText: "Nâng cấp",
    popular: true,
    // discountNote: "Có thể áp dụng mã giảm giá 50% (STUDENT50) hoặc 100% (HEAL100) cho sinh viên và người bệnh tâm thần"
  },
  {
    id: "don-ngo",
    name: "Đốn Ngộ – Gói Premium",
    icon: Crown,
    price: "249.000 đ/tháng",
    yearlyPrice: "2.688.200 đ/năm (giảm 10%)",
    features: [
      "Truy cập tác nhân Đốn Ngộ với mô hình cao cấp nhất",
      "Trả lời sâu sắc, tốc độ cao",
      "Ưu tiên tính năng giọng nói và hỗ trợ nội dung đặc biệt",
      "Truy cập sớm tính năng mới",
      "Hỗ trợ 24/7"
    ],
    buttonText: "Nâng cấp",
    popular: false,
    // discountNote: "Áp dụng mã giảm giá 50%/100% tương tự gói Pro"
  }
];

export default function PricingPage() {
  const { t } = useTranslations();
  const { user } = useAuthStore();
  const router = useRouter();
  const [discountCodes, setDiscountCodes] = useState<{[key: string]: string}>({});
  // const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Define features arrays directly with translations
  const featuresData = {
    tamAn: [
      t("pricing.plans.tamAn.features.0"),
      t("pricing.plans.tamAn.features.1"), 
      t("pricing.plans.tamAn.features.2")
    ],
    giacNgo: [
      t("pricing.plans.giacNgo.features.0"),
      t("pricing.plans.giacNgo.features.1"),
      t("pricing.plans.giacNgo.features.2"),
      t("pricing.plans.giacNgo.features.3")
    ],
    donNgo: [
      t("pricing.plans.donNgo.features.0"),
      t("pricing.plans.donNgo.features.1"),
      t("pricing.plans.donNgo.features.2"),
      t("pricing.plans.donNgo.features.3"),
      t("pricing.plans.donNgo.features.4")
    ]
  };

  const pricingPlans = [
    {
      id: "tam-an",
      name: t("pricing.plans.tamAn.name"),
      icon: Star,
      price: t("pricing.plans.tamAn.price"),
      yearlyPrice: null,
      features: featuresData.tamAn,
      buttonText: t("pricing.plans.tamAn.buttonText"),
      popular: false,
    },
    {
      id: "giac-ngo",
      name: t("pricing.plans.giacNgo.name"),
      icon: Zap,
      price: t("pricing.plans.giacNgo.price"),
      yearlyPrice: t("pricing.plans.giacNgo.yearlyPrice"),
      features: featuresData.giacNgo,
      buttonText: t("pricing.plans.giacNgo.buttonText"),
      popular: true,
    },
    {
      id: "don-ngo",
      name: t("pricing.plans.donNgo.name"),
      icon: Crown,
      price: t("pricing.plans.donNgo.price"),
      yearlyPrice: t("pricing.plans.donNgo.yearlyPrice"),
      features: featuresData.donNgo,
      buttonText: t("pricing.plans.donNgo.buttonText"),
      popular: false,
    }
  ];

  const handleApplyDiscount = (planId: string) => {
    const code = discountCodes[planId];
    if (code) {
      // Handle discount code application logic here
      console.log(`Applying discount code ${code} for plan ${planId}`);
    }
  };

  const handleUpgrade = (planId: string) => {
    // Handle upgrade logic here
    console.log(`Upgrading to plan: ${planId}`);
    if (planId === "tam-an") {
      router.push("/ai/new");
    } else {
      // For Pro/Premium plans, redirect to AI page or show success message
      router.push("/ai/new");
      // setIsUpgradeModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button and Title */}
        <div className="flex items-start justify-between mb-16">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 border-red-800 text-red-800 hover:bg-red-50 mt-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.back")}
          </Button>
          
          <div className="text-center flex-1">
            <div className="text-8xl font-bold text-red-800 mb-6">法</div>
            <h1 className="text-4xl font-bold text-red-800 mb-6">
              {t("pricing.title")}
            </h1>
            <p className="text-xl text-red-700 max-w-3xl mx-auto leading-relaxed">
              {t("pricing.subtitle")}
            </p>
          </div>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-xl bg-amber-50 border-2 flex flex-col h-full ${
                  plan.popular 
                    ? "border-red-800 shadow-lg scale-105" 
                    : "border-black hover:border-gray-800"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-4 py-1">
                    {t("pricing.popular")}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-50 border-2 border-red-800 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-red-800" />
                  </div>
                  <CardTitle className={`text-xl font-semibold text-black ${plan.popular ? "mt-2" : "mt-4"}`}>
                    {plan.name}
                  </CardTitle>
                  <div className="mt-6">
                    <div className="text-3xl font-bold text-red-800">
                      {plan.price}
                    </div>
                    {plan.yearlyPrice && (
                      <div className="text-sm mt-2 text-gray-700">
                        {plan.yearlyPrice}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 flex flex-col h-full">
                  <div className="space-y-3 flex-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-black" />
                        <span className="text-sm text-black">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom section with discount and upgrade button */}
                  <div className="space-y-4 pt-4 border-t border-red-300">
                    {plan.id !== "tam-an" && (
                      <div className="space-y-3">
                        <div className="text-sm font-medium text-black">
                          {t("pricing.discountCode")}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            placeholder={t("pricing.discountPlaceholder")}
                            value={discountCodes[plan.id] || ""}
                            onChange={(e) => setDiscountCodes(prev => ({
                              ...prev,
                              [plan.id]: e.target.value
                            }))}
                            className="flex-1 bg-white border-red-300"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApplyDiscount(plan.id)}
                            className="px-4 bg-gray-600 text-white border-gray-600 hover:bg-gray-700"
                          >
                            {t("pricing.applyDiscount")}
                          </Button>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => handleUpgrade(plan.id)}
                      className="w-full py-3 text-base font-medium transition-colors rounded-lg bg-red-800 hover:bg-red-900 text-white"
                    >
                      {plan.buttonText}
                    </Button>
                  </div>

                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16 max-w-5xl mx-auto">
          <p className="text-red-700 mb-4">
            {t("pricing.support.title")}
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/contact")}
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            {t("pricing.support.button")}
          </Button>
        </div>
      </div>

      {/* Upgrade Modal - Removed since UpgradeModal component was deleted */}
      {/* <UpgradeModal
        open={isUpgradeModalOpen}
        onOpenChange={setIsUpgradeModalOpen}
      /> */}
    </div>
  );
}
