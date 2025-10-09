export interface StoryItem {
  id: string
  title: {
    vi: string
    en: string
  }
  description?: {
    vi: string
    en: string
  }
}

export interface StoryChapter {
  id: string
  title: string
  items: StoryItem[]
}

export const storyData: StoryChapter[] = [
  {
    id: 'enlightenment-stories',
    title: 'Câu Chuyện Ngộ Đạo',
    items: [
      {
        id: 'c1',
        title: {
          vi: 'Câu Chuyện Ngộ Đạo 1',
          en: 'Enlightenment Story 1'
        },
        description: {
          vi: 'Câu Chuyện Minh Châu Có Đại Duyên Lớn Gặp Sư Tam Vô Khai Thị',
          en: 'The story of Minh Châu'
        }
      },
      {
        id: 'c2',
        title: {
          vi: 'Câu Chuyện Ngộ Đạo 2',
          en: 'Enlightenment Story 2'
        },
        description: {
          vi: 'Câu chuyện Huệ Tịnh có đại duyên lớn được gặp Sư Cha Tam Vô',
          en: 'The story of Huệ Tịnh'
        }
      },
      {
        id: 'c3',
        title: {
          vi: 'Câu Chuyện Ngộ Đạo 3',
          en: 'Enlightenment Story 3'
        },
        description: {
          vi: 'Câu chuyện Huệ Thanh có đại duyên lớn được gặp Sư Tam Vô khai thị',
          en: 'The story of Huệ Thanh'
        }
      },
      {
        id: 'c4',
        title: {
          vi: 'Câu Chuyện Ngộ Đạo 4',
          en: 'Enlightenment Story 4'
        },
        description: {
          vi: 'Câu chuyện Hằng Thức khi có đại duyên lớn được gặp Sư Cha Tam Vô',
          en: 'The story of Hằng Thức'
        }
      },
      {
        id: 'c5',
        title: {
          vi: 'Câu Chuyện Ngộ Đạo 5',
          en: 'Enlightenment Story 5'
        },
        description: {
          vi: 'Câu chuyện Hoa - Huệ Đức được Sư Cha Tam Vô thức tỉnh ngộ đạo',
          en: 'The story of Hoa – Huệ Đức'
        }
      },
      {
        id: 'c6',
        title: {
          vi: 'Câu Chuyện Ngộ Đạo 6',
          en: 'Enlightenment Story 6'
        },
        description: {
          vi: 'Câu chuyện Vô Luận ngộ đạo',
          en: 'TThe story of Vô Luận'
        }
      }
    ]
  }
]

export default storyData
