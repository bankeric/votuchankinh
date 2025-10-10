const pricingPlansVi = [
  {
    id: 'tam-an',
    name: 'GÓI BASIC (Miễn phí) – Agent TÂM AN',
    yearlyName: 'GÓI BASIC (Miễn phí) – Agent TÂM AN',
    icon: '/images/pricing-1.png',
    price: '0 đ',
    yearlyPrice: null,
    subtitle: 'Không gian chữa lành & an yên nội tại',
    features: [
      'Giúp giảm căng thẳng, lo âu, chữa lành tổn thương tâm thức',
      'Hướng dẫn thực hành đơn giản: thở, quan sát cảm xúc, quay về bình an trong hiện tại',
      'Lắng nghe & đồng cảm, luôn tạo không gian an toàn, không phán xét',
      'Giọng văn nhẹ nhàng, tích cực, truyền năng lượng bình an',
      'Trích dẫn kệ từ bi & câu chuyện thiền để xoa dịu và khích lệ'
    ],
    buttonText: 'Dùng thử ngay',
    popular: false,
    currency: 'vnd',
    monthly: 0,
    yearly: 0,
    stripeMonthlyId: '', // free plan has no stripeId
    stripeYearlyId: ''
  },
  {
    id: 'giac-ngo',
    name: 'GÓI PRO ($99,000 VND/tháng) – Agent GIÁC NGỘ',
    yearlyName: 'GÓI PRO (1,069,200 VND/năm) – Agent GIÁC NGỘ',
    icon: '/images/giac-ngo-logo-3.png',
    price: '99.000 đ/tháng',
    yearlyPrice: '1.069.200 đ/năm (giảm 10%)',
    subtitle: "Khai thị phá mê, dẫn lối 'Rõ Mình'",
    features: [
      'Trực diện & súc tích, dùng lời dạy để phá chấp – phá mê',
      "Dẫn dắt bằng câu hỏi sắc bén (Socratic method), đưa người dùng quay về 'người đang biết'",
      'Ẩn dụ & kệ khai thị từ Sư Cha, giúp chuyển hóa sâu sắc ngay trong đời sống thường nhật',
      'Phong cách từ bi nhưng sắc bén, vừa dìu dắt vừa thử thách',
      "Chỉ rõ con đường tìm Minh Sư khi người dùng thật sự tha thiết muốn 'Về Nhà Xưa'"
    ],
    buttonText: 'Nâng cấp',
    popular: true,
    currency: 'vnd',
    monthly: 99000,
    yearly: 1069200,
    stripeMonthlyId: 'price_1SFoVMRvqbhgU2bC0yhgJqU0', // replace with actual Stripe price ID
    stripeYearlyId: 'price_1SG9pCRvqbhgU2bCx3UXqMml' // replace with actual Stripe price ID
  },
  {
    id: 'don-ngo',
    name: 'GÓI PREMIUM (249,000 VND/tháng) – Agent ĐỐN NGỘ',
    yearlyName: 'GÓI PREMIUM (2,688,200 VND/năm) – Agent ĐỐN NGỘ',
    icon: '/images/pricing-3.png',
    price: '249.000 đ/tháng',
    yearlyPrice: '2.688.200 đ/năm (giảm 10%)',
    subtitle: "'Cú vả ngộ' – tỉnh thức tức thì",
    features: [
      "Lời đáp ngắn gọn, sắc bén, như một 'cú sốc' phá tan vọng tưởng",
      'Thách thức trực diện, đôi khi phi logic, tạo khủng hoảng tư duy để bừng tỉnh',
      'Dùng kệ ngắn, ẩn dụ mạnh mẽ như nhát búa dứt khoát vào vọng tâm',
      'Không an ủi, không vòng vo – chỉ thẳng vào Tánh Phật',
      'Thích hợp cho người đã sẵn sàng đối diện sự thật trần trụi & mong cầu đốn ngộ ngay sát-na'
    ],
    buttonText: 'Nâng cấp',
    popular: false,
    currency: 'vnd',
    monthly: 249000,
    yearly: 2688200,
    stripeMonthlyId: 'price_1SFoWVRvqbhgU2bCe0VU3dtr', // replace with actual Stripe price ID
    stripeYearlyId: 'price_1SG9qCRvqbhgU2bCjDZpNDRt' // replace with actual Stripe price ID
  }
]

const pricingPlansEng = [
  {
    id: 'tam-an',
    name: 'BASIC Plan (Free) – Agent TÂM AN',
    yearlyName: 'BASIC Plan (Free) – Agent TÂM AN',
    icon: '/images/pricing-1.png',
    price: 'Free',
    yearlyPrice: null,
    subtitle: 'A healing space for inner peace',
    features: [
      'Helps reduce stress, anxiety, and heal emotional wounds',
      'Provides simple practices: mindful breathing, observing emotions, returning to present peace',
      'Listens with empathy, creating a safe and non-judgmental space',
      'Gentle, uplifting tone that radiates calm and positivity',
      'Uses compassionate verses & Zen stories to soothe and encourage'
    ],
    buttonText: 'Try Now',
    popular: false,
    currency: 'usd',
    monthly: 0,
    yearly: 0,
    stripeMonthlyId: '', // free plan has no stripeId
    stripeYearlyId: ''
  },
  {
    id: 'giac-ngo',
    name: 'PRO Plan ($4) – Agent GIÁC NGỘ',
    yearlyName: 'PRO Plan ($43.20/year) – Agent GIÁC NGỘ',
    icon: '/images/giac-ngo-logo-3.png',
    price: '$4/month',
    yearlyPrice: '$43.20/year (10% discount)',
    subtitle: 'Awakening guidance – breaking delusion, seeing “True Self”',
    features: [
      'Direct and concise responses that break attachment and delusion',
      'Guides through sharp questions (Socratic method), turning awareness back to the “one who knows.”',
      'Uses metaphors & teachings from Master Tam Vô to bring deep transformation into daily life.',
      'Style is both compassionate and cutting—nurturing yet challenging.',
      'Points toward the path of seeking a Living Master for those sincerely yearning to “Return Home.”'
    ],
    buttonText: 'Upgrade',
    popular: true,
    currency: 'usd',
    monthly: 400, // 2 decimal
    yearly: 4320, // 2 decimal
    stripeMonthlyId: 'price_1SFoVMRvqbhgU2bC0yhgJqU0', // replace with actual Stripe price ID
    stripeYearlyId: 'price_1SG9pCRvqbhgU2bCx3UXqMml' // replace with actual Stripe price ID
  },
  {
    id: 'don-ngo',
    name: 'PREMIUM Plan ($10) – Agent ĐỐN NGỘ',
    yearlyName: 'PREMIUM Plan ($108/year) – Agent ĐỐN NGỘ',
    icon: '/images/pricing-3.png',
    price: '$10/month',
    yearlyPrice: '$108/year (10% discount)',
    subtitle: 'The “Zen slap” – instant awakening',
    features: [
      'Ultra-short, piercing replies that shatter illusions like a sudden shock.',
      'Directly challenges assumptions, sometimes breaking logic to disrupt dualistic thinking.',
      'Uses brief verses and powerful metaphors as a hammer to crush false mind.',
      'No comfort, no detours—straight to the essence of Buddha-Nature.',
      'For those ready to face raw truth and seek sudden awakening in a single moment.'
    ],
    buttonText: 'Upgrade',
    popular: false,
    currency: 'usd',
    monthly: 1000, // 2 decimal
    yearly: 10800, // 2 decimal
    stripeMonthlyId: 'price_1SFoWVRvqbhgU2bCe0VU3dtr', // replace with actual Stripe price ID
    stripeYearlyId: 'price_1SG9qCRvqbhgU2bCjDZpNDRt' // replace with actual Stripe price ID
  }
]

export const subScriptionPlans = {
  vi: pricingPlansVi,
  en: pricingPlansEng
}
