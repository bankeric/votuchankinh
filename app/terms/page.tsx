"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  const [language, setLanguage] = useState<"vi" | "en">("vi")

  const content = {
    vi: {
      title: "Điều khoản sử dụng",
      subtitle: "Giác Ngộ – Điều khoản sử dụng và Chính sách quyền riêng tư",
      disclaimer:
        "Tài liệu này chỉ nhằm mục đích cung cấp thông tin chung. Để đảm bảo tính chính xác và phù hợp với pháp luật hiện hành, Quý vị nên tham khảo ý kiến tư vấn chuyên môn trước khi sử dụng.",
      effectiveDate: "Ngày có hiệu lực: 10/06/2025",
      sections: [
        {
          title: "1. Chấp nhận điều khoản",
          content:
            "Khi truy cập và sử dụng bất kỳ dịch vụ nào do Giác Ngộ vận hành – bao gồm trang web, ứng dụng di động, chatbot Buddha AI Chat và các nền tảng liên quan (gọi chung là Dịch vụ) – bạn thừa nhận rằng đã đọc, hiểu và đồng ý chịu ràng buộc bởi các điều khoản trong tài liệu này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng Dịch vụ. Giác Ngộ có thể sửa đổi Điều khoản này bất kỳ lúc nào bằng cách đăng bản cập nhật; việc tiếp tục sử dụng sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các thay đổi đó.",
        },
        {
          title: "2. Mục đích và phạm vi sử dụng",
          content:
            "Giác Ngộ là tổ chức phi lợi nhuận với sứ mệnh truyền đạt triết lý Phật giáo thông qua công nghệ. Dịch vụ cung cấp thông tin, nội dung giáo dục và công cụ trò chuyện do trí tuệ nhân tạo hỗ trợ. Các nội dung và phản hồi từ chatbot chỉ mang tính tham khảo, không phải lời khuyên y tế, pháp lý hay tâm lý chuyên môn. Bạn chịu trách nhiệm cho mọi quyết định dựa trên thông tin nhận được từ Dịch vụ và nên tham khảo chuyên gia khi cần.\n\nNgười dùng chỉ được sử dụng Dịch vụ cho mục đích cá nhân, phi thương mại và phù hợp với pháp luật. Bạn không được tái sản xuất, phân phối, bán, chuyển nhượng hoặc khai thác thương mại bất kỳ nội dung nào từ Dịch vụ khi chưa có sự chấp thuận bằng văn bản của Giác Ngộ.",
        },
        {
          title: "3. Tài khoản và gói thành viên",
          content:
            "Để truy cập đầy đủ các tính năng (như lưu lịch sử trò chuyện, truy cập các tác nhân AI nâng cao hoặc mua gói thành viên), bạn cần tạo tài khoản. Bạn cam kết cung cấp thông tin chính xác và bảo mật thông tin đăng nhập. Giác Ngộ có quyền vô hiệu hoá hoặc chấm dứt tài khoản của bất kỳ người dùng nào vi phạm Điều khoản này.\n\nCác gói thành viên (Basic, Pro, Premium) được mô tả trong Mô hình thành viên. Nếu bạn nâng cấp gói, bạn đồng ý thanh toán theo phương thức được hỗ trợ.",
        },
        {
          title: "3.1. Sử dụng phí dịch vụ",
          content:
            "Giác Ngộ là tổ chức phi lợi nhuận; mọi khoản phí gói thành viên (Pro, Premium) đều được coi là sự đóng góp nhằm duy trì và phát triển sứ mệnh giáo dục Phật pháp. Phí thu được sẽ được sử dụng để:\n\n• Làm công đức và Phật sự: hỗ trợ các hoạt động từ thiện, cúng dường, xây dựng cơ sở hạ tầng phục vụ cộng đồng Phật giáo\n• Hỗ trợ cộng đồng: tài trợ cho các chương trình học bổng, nội dung miễn phí, sự kiện và công cụ hỗ trợ tinh thần\n• Duy trì dịch vụ: trang trải chi phí vận hành hệ thống, nghiên cứu, phát triển AI và bảo trì nền tảng",
        },
        {
          title: "4. Quyền sở hữu trí tuệ",
          content:
            "Toàn bộ nội dung của Dịch vụ (bao gồm văn bản, đồ hoạ, logo, thiết kế giao diện, mã nguồn và cơ sở dữ liệu) thuộc sở hữu của Giác Ngộ hoặc các bên cấp phép và được bảo vệ bởi luật sở hữu trí tuệ. Bạn được cấp phép giới hạn để truy cập và sử dụng Dịch vụ cho mục đích cá nhân.",
        },
        {
          title: "5. Miễn trừ trách nhiệm và giới hạn trách nhiệm",
          content:
            'Nội dung và Dịch vụ được cung cấp "nguyên trạng" và "khả dụng" mà không có bất kỳ cam kết hay bảo đảm nào. Giác Ngộ không đảm bảo Dịch vụ sẽ không gián đoạn, không có lỗi hoặc đáp ứng yêu cầu cụ thể của bạn.',
        },
        {
          title: "6. Liên kết và nội dung của bên thứ ba",
          content:
            "Dịch vụ có thể chứa liên kết đến website hoặc dịch vụ của bên thứ ba. Giác Ngộ không chịu trách nhiệm về nội dung, chính sách hoặc thực hành của các bên đó.",
        },
        {
          title: "7. Luật áp dụng và giải quyết tranh chấp",
          content:
            "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam (trừ khi quy định khác theo luật nơi bạn cư trú). Mọi tranh chấp phát sinh từ việc sử dụng Dịch vụ sẽ được giải quyết trước tiên bằng thương lượng thiện chí.",
        },
        {
          title: "8. Sửa đổi điều khoản",
          content:
            "Giác Ngộ có thể cập nhật Điều khoản sử dụng khi cần thiết. Ngày cập nhật cuối cùng sẽ được ghi rõ ở đầu tài liệu. Bạn có trách nhiệm xem lại Điều khoản định kỳ để nắm được các thay đổi.",
        },
      ],
    },
    en: {
      title: "Terms of Use",
      subtitle: "Giac Ngo – Terms of Use and Privacy Policy",
      disclaimer:
        "This document is provided for general informational purposes. For accuracy and compliance with applicable laws, you should consult a professional advisor before relying on it.",
      effectiveDate: "Effective date: June 10, 2025",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content:
            "By accessing or using any service operated by Giac Ngo – including the website, mobile applications, the Buddha AI Chat chatbot, and related platforms (collectively, the Services) – you acknowledge that you have read, understood and agree to be bound by these Terms. If you do not agree to any part of the Terms, please do not use the Services.",
        },
        {
          title: "2. Purpose and Scope of Use",
          content:
            "Giac Ngo is a non-profit organization whose mission is to transmit Buddhist teachings through technology. The Services provide information, educational content and chat tools powered by artificial intelligence. Content and responses from the chatbot are for reference only and are not medical, legal or psychological advice.\n\nUsers may only use the Services for personal, non-commercial purposes in compliance with the law. You may not reproduce, distribute, sell, transfer or otherwise commercially exploit any content from the Services without the prior written permission of Giac Ngo.",
        },
        {
          title: "3. Accounts and Membership Plans",
          content:
            "To access full features (such as saving chat history, using advanced AI agents or purchasing membership plans), you must create an account. You agree to provide accurate information and keep your login credentials confidential. Giac Ngo reserves the right to disable or terminate any account that violates these Terms.\n\nMembership plans (Basic, Pro, Premium) are described in our membership model. If you upgrade your plan, you agree to pay using the supported methods.",
        },
        {
          title: "3.1. Use of Membership Fees",
          content:
            "Giac Ngo is a non-profit organization; all membership fees (Pro, Premium) are considered contributions that sustain and develop our mission of Buddhist education. Fees collected will be used to:\n\n• Support merit and Buddhist activities: funding charity work, religious offerings, and building infrastructure\n• Support the community: sponsoring scholarships, free content, events and spiritual support tools\n• Maintain the service: covering operational costs, research, AI development and platform maintenance",
        },
        {
          title: "4. Intellectual Property Rights",
          content:
            "All content of the Services (including text, graphics, logos, interface designs, source code and databases) is owned by Giac Ngo or its licensors and is protected by intellectual property laws. You are granted a limited licence to access and use the Services for personal purposes.",
        },
        {
          title: "5. Disclaimer and Limitation of Liability",
          content:
            'The content and Services are provided "as is" and "as available" without any warranty, express or implied. Giac Ngo does not guarantee that the Services will be uninterrupted, error-free or meet your specific requirements.',
        },
        {
          title: "6. Links and Third-Party Content",
          content:
            "The Services may contain links to third-party websites or services. Giac Ngo is not responsible for the content, policies or practices of those third parties.",
        },
        {
          title: "7. Governing Law and Dispute Resolution",
          content:
            "These Terms are governed by the laws of Việt Nam (unless otherwise required by the law of your residence). Any disputes arising from your use of the Services should first be settled amicably.",
        },
        {
          title: "8. Changes to the Terms",
          content:
            "Giac Ngo may update these Terms when necessary. The last updated date will be indicated at the top. It is your responsibility to review the Terms periodically.",
        },
      ],
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] via-[#e8d5a3] to-[#dcc48a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/landing">
            <Button variant="ghost" className="text-[#2c2c2c] hover:text-[#991b1b] hover:bg-[#EFE0BD]/50 font-serif">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Trang chủ
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
            <p className="text-sm font-serif text-[#2c2c2c]/60 italic max-w-2xl mx-auto">{currentContent.disclaimer}</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <div key={index} className="scroll-mt-8" id={`section-${index}`}>
                <h2 className="text-xl md:text-2xl font-serif text-[#991b1b] mb-4 font-semibold">{section.title}</h2>
                <div className="text-base font-serif text-[#2c2c2c]/80 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Information */}
          <div className="mt-12 pt-8 border-t-2 border-[#991b1b]/20">
            <h3 className="text-xl font-serif text-[#991b1b] mb-4 font-semibold">
              {language === "vi" ? "Liên hệ" : "Contact Us"}
            </h3>
            <div className="text-base font-serif text-[#2c2c2c]/80 leading-relaxed">
              <p className="font-semibold">GIAC NGO CORP</p>
              <p>867 Boylston Street, 5th Floor, Suite 1860</p>
              <p>Boston, MA 02116, USA</p>
              <p className="mt-2">
                Email:{" "}
                <a href="mailto:privacy@giac.ngo" className="text-[#991b1b] hover:underline">
                  privacy@giac.ngo
                </a>
              </p>
            </div>
          </div>

          {/* Effective Date */}
          <div className="mt-8 text-center">
            <p className="text-sm font-serif text-[#2c2c2c]/60 italic">{currentContent.effectiveDate}</p>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/privacy">
              <Button
                variant="outline"
                className="w-full sm:w-auto bg-white border-[#991b1b] text-[#991b1b] hover:bg-[#991b1b] hover:text-white font-serif"
              >
                {language === "vi" ? "Chính sách quyền riêng tư" : "Privacy Policy"}
              </Button>
            </Link>
            <Link href="/">
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
