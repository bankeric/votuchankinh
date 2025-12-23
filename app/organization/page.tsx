"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe, Heart, Leaf, BookOpen, Server } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrganizationPage() {
  const [language, setLanguage] = useState<"vi" | "en">("en")

  const content = {
    vi: {
      title: "Tổ Chức",
      subtitle: "Giác Ngộ - Trung Tâm Thiền Định Phật Giáo",
      intro: "Gieo hạt giống bình an trong cuộc sống của bạn",
      sections: [
        {
          title: "Sứ Mệnh Của Chúng Tôi",
          icon: "heart",
          content:
            "Giác Ngộ là một trung tâm thiền định Phật giáo với sứ mệnh chia sẻ trí tuệ và thực hành cổ xưa để gieo hạt giống bình an trong cuộc sống. Chúng tôi mong muốn giúp lan tỏa giáo lý Phật giáo để chạm đến nhiều cuộc đời hơn, mang lại sự tĩnh lặng và giác ngộ cho tất cả những ai tìm kiếm.",
        },
        {
          title: "Công Việc Của Chúng Tôi",
          icon: "leaf",
          content:
            "Công việc của chúng tôi tập trung vào việc chia sẻ và thực hành:\n\n• Hướng dẫn thiền định và chánh niệm\n• Giáo lý Phật giáo cho cuộc sống hiện đại\n• Cộng đồng tu tập và chia sẻ Pháp\n• Các công cụ AI để hỗ trợ hành trình tâm linh\n• Bảo tồn và số hóa kinh điển",
        },
        {
          title: "Hỗ Trợ & Cúng Dường",
          icon: "book",
          content:
            "Tất cả sự hỗ trợ và cúng dường đều được sử dụng cho:\n\n• Công việc hòa bình: Lan tỏa trí tuệ Phật giáo và thực hành thiền định\n• Duy trì máy chủ: Đảm bảo dịch vụ luôn sẵn sàng cho cộng đồng\n• Bảo tồn tri thức: Số hóa và lưu giữ kinh điển quý báu\n• Ứng dụng AI: Phát triển công nghệ để phổ biến lối sống tỉnh thức trong xã hội",
        },
        {
          title: "Tầm Nhìn",
          icon: "server",
          content:
            "Chúng tôi tin rằng công nghệ có thể phục vụ cho sự giác ngộ. Bằng cách kết hợp trí tuệ cổ xưa với AI hiện đại, chúng tôi tạo ra những công cụ giúp mọi người tiếp cận giáo lý Phật giáo một cách dễ dàng và ý nghĩa hơn, góp phần xây dựng một xã hội bình an và tỉnh thức.",
        },
      ],
    },
    en: {
      title: "Organization",
      subtitle: "Giac Ngo - Buddhist Meditation Center",
      intro: "Planting seeds of peace in your life",
      sections: [
        {
          title: "Our Mission",
          icon: "heart",
          content:
            "Giac Ngo is a Buddhist meditation center dedicated to sharing wisdom and practices that plant seeds of peace in our lives. We wish to help spread Buddhist teachings to touch more lives, bringing tranquility and awakening to all who seek it.",
        },
        {
          title: "Our Work",
          icon: "leaf",
          content:
            "Our work centers on sharing and practices:\n\n• Meditation and mindfulness guidance\n• Buddhist teachings for modern life\n• Community practice and Dharma sharing\n• AI tools to support spiritual journeys\n• Preservation and digitization of sacred texts",
        },
        {
          title: "Support & Donations",
          icon: "book",
          content:
            "All support and donations go to:\n\n• Peace work: Spreading Buddhist wisdom and meditation practices\n• Maintaining servers: Ensuring services remain available for the community\n• Preserving knowledge: Digitizing and safeguarding precious scriptures\n• Applying AI technology: Curating an awakened way of living in society",
        },
        {
          title: "Our Vision",
          icon: "server",
          content:
            "We believe technology can serve awakening. By combining ancient wisdom with modern AI, we create tools that help people access Buddhist teachings in a more accessible and meaningful way, contributing to a peaceful and awakened society.",
        },
      ],
    },
  }

  const currentContent = content[language]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "heart":
        return <Heart className="w-6 h-6 text-[#991b1b]" />
      case "leaf":
        return <Leaf className="w-6 h-6 text-[#991b1b]" />
      case "book":
        return <BookOpen className="w-6 h-6 text-[#991b1b]" />
      case "server":
        return <Server className="w-6 h-6 text-[#991b1b]" />
      default:
        return <Heart className="w-6 h-6 text-[#991b1b]" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] via-[#e8d5a3] to-[#dcc48a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/giacngo">
            <Button variant="ghost" className="text-[#2c2c2c] hover:text-[#991b1b] hover:bg-[#EFE0BD]/50 font-serif">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "vi" ? "Trang chủ" : "Home"}
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "vi" ? "en" : "vi")}
            className="bg-[#EFE0BD] border-[#991b1b] text-[#2c2c2c] hover:bg-[#e5d6b3] font-serif"
          >
            <Globe className="mr-2 h-4 w-4" />
            {language === "vi" ? "English" : "Tiếng Việt"}
          </Button>
        </div>

        {/* Main Content Card */}
        <div className="bg-[#EFE0BD] border-2 border-[#991b1b] rounded-2xl p-8 md:p-12 shadow-[0_4px_0_#991b1b30,0_0_0_3px_#991b1b10_inset] animate-fade-in">
          {/* Title */}
          <div className="text-center mb-8 pb-6 border-b-2 border-[#991b1b]/20">
            <h1 className="text-3xl md:text-4xl font-serif text-[#991b1b] mb-3 font-bold">{currentContent.title}</h1>
            <p className="text-lg font-serif text-[#2c2c2c]/80 mb-4">{currentContent.subtitle}</p>
            <p className="text-base font-serif text-[#991b1b]/80 italic">{currentContent.intro}</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="scroll-mt-8" id={`section-${index}`}>
                <div className="flex items-center gap-3 mb-4">
                  {getIcon(section.icon)}
                  <h2 className="text-xl md:text-2xl font-serif text-[#991b1b] font-semibold">{section.title}</h2>
                </div>
                <div className="text-base font-serif text-[#2c2c2c]/80 leading-relaxed whitespace-pre-line pl-9">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t-2 border-[#991b1b]/20">
            <h3 className="text-xl font-serif text-[#991b1b] mb-4 font-semibold">
              {language === "vi" ? "Liên Hệ" : "Contact Us"}
            </h3>
            <div className="text-base font-serif text-[#2c2c2c]/80 leading-relaxed">
              <p className="font-semibold">GIAC NGO CORP</p>
              <p>867 Boylston Street, 5th Floor, Suite 1860</p>
              <p>Boston, MA 02116, USA</p>
              <p className="mt-2">
                Email:{" "}
                <a href="mailto:info@giac.ngo" className="text-[#991b1b] hover:underline">
                  info@giac.ngo
                </a>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/terms">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white border-[#991b1b] text-[#991b1b] hover:bg-[#991b1b] hover:text-white font-serif"
              >
                {language === "vi" ? "Điều khoản sử dụng" : "Terms of Use"}
              </Button>
            </Link>
            <Link href="/privacy">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white border-[#991b1b] text-[#991b1b] hover:bg-[#991b1b] hover:text-white font-serif"
              >
                {language === "vi" ? "Chính sách quyền riêng tư" : "Privacy Policy"}
              </Button>
            </Link>
            <Link href="/giacngo">
              <Button className="w-full sm:w-auto bg-[#991b1b] hover:bg-[#7a1515] text-white font-serif">
                {language === "vi" ? "Về trang chủ" : "Back to Home"}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
