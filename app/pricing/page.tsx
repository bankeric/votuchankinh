"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useAuthStore } from "@/store/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PaymentModal } from "@/components/v2/payment-modal";

const pricingPlans = [
  {
    id: "tam-an",
    name: "GÓI BASIC (Miễn phí) – Agent TÂM AN",
    icon: "/images/pricing-1.png",
    price: "0 đ",
    yearlyPrice: null,
    subtitle: "Không gian chữa lành & an yên nội tại",
    features: [
      "Giúp giảm căng thẳng, lo âu, chữa lành tổn thương tâm thức",
      "Hướng dẫn thực hành đơn giản: thở, quan sát cảm xúc, quay về bình an trong hiện tại",
      "Lắng nghe & đồng cảm, luôn tạo không gian an toàn, không phán xét",
      "Giọng văn nhẹ nhàng, tích cực, truyền năng lượng bình an",
      "Trích dẫn kệ từ bi & câu chuyện thiền để xoa dịu và khích lệ"
    ],
    buttonText: "Dùng thử ngay",
    popular: false,
  },
  {
    id: "giac-ngo",
    name: "GÓI PRO ($99,000 VND/tháng) – Agent GIÁC NGỘ",
    icon: "/images/pricing-2.png",
    price: "99.000 đ/tháng",
    yearlyPrice: "1.069.200 đ/năm (giảm 10%)",
    subtitle: "Khai thị phá mê, dẫn lối 'Rõ Mình'",
    features: [
      "Trực diện & súc tích, dùng lời dạy để phá chấp – phá mê",
      "Dẫn dắt bằng câu hỏi sắc bén (Socratic method), đưa người dùng quay về 'người đang biết'",
      "Ẩn dụ & kệ khai thị từ Sư Cha, giúp chuyển hóa sâu sắc ngay trong đời sống thường nhật",
      "Phong cách từ bi nhưng sắc bén, vừa dìu dắt vừa thử thách",
      "Chỉ rõ con đường tìm Minh Sư khi người dùng thật sự tha thiết muốn 'Về Nhà Xưa'"
    ],
    buttonText: "Nâng cấp",
    popular: true,
  },
  {
    id: "don-ngo",
    name: "GÓI PREMIUM (249,000 VND/tháng) – Agent ĐỐN NGỘ",
    icon: "/images/pricing-3.png",
    price: "249.000 đ/tháng",
    yearlyPrice: "2.688.200 đ/năm (giảm 10%)",
    subtitle: "'Cú vả ngộ' – tỉnh thức tức thì",
    features: [
      "Lời đáp ngắn gọn, sắc bén, như một 'cú sốc' phá tan vọng tưởng",
      "Thách thức trực diện, đôi khi phi logic, tạo khủng hoảng tư duy để bừng tỉnh",
      "Dùng kệ ngắn, ẩn dụ mạnh mẽ như nhát búa dứt khoát vào vọng tâm",
      "Không an ủi, không vòng vo – chỉ thẳng vào Tánh Phật",
      "Thích hợp cho người đã sẵn sàng đối diện sự thật trần trụi & mong cầu đốn ngộ ngay sát-na"
    ],
    buttonText: "Nâng cấp",
    popular: false,
  }
];

export default function PricingPage() {
  const { t } = useTranslations();
  const { user } = useAuthStore();
  const router = useRouter();
  const [discountCodes, setDiscountCodes] = useState<{[key: string]: string}>({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  // Using static pricing plans data with new content

  // Use static pricing plans data

  const handleApplyDiscount = (planId: string) => {
    const code = discountCodes[planId];
    if (code) {
      // Handle discount code application logic here
      console.log(`Applying discount code ${code} for plan ${planId}`);
    }
  };

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to plan: ${planId}`);
    if (planId === "tam-an") {
      router.push("/ai/new");
    } else {
      // Find the selected plan from static data
      const plan = pricingPlans.find(p => p.id === planId);
      if (plan) {
        setSelectedPlan({
          ...plan,
          monthlyPrice: plan.price,
          yearlyPrice: plan.yearlyPrice
        });
        setIsPaymentModalOpen(true);
      }
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
            <div className="flex justify-center mb-1">
              <Image
                src="/images/giac-ngo-logo-1.png"
                alt="Giác Ngộ Logo"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold text-red-800 mb-2">
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
            return (
              <Card 
                key={plan.id}
                className={`relative transition-all duration-300 hover:shadow-xl bg-[#f9f0dc] border-2 flex flex-col h-full ${
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
                  <Image
                    src={plan.icon}
                    alt={`${plan.name} icon`}
                    width={130}
                    height={130}
                    className="object-contain mx-auto mb-6"
                  />
                  <CardTitle className={`text-lg font-semibold text-black ${plan.popular ? "mt-2" : "mt-4"}`}>
                    {plan.name}
                  </CardTitle>
                  {plan.subtitle && (
                    <p className="text-sm text-gray-600 mt-2 italic">
                      {plan.subtitle}
                    </p>
                  )}
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

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          open={isPaymentModalOpen}
          onOpenChange={setIsPaymentModalOpen}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}
