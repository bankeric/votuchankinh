export default function Loading() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#f4e4bc] via-[#e8d5a3] to-[#dcc48a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#991b1b] border-r-transparent"></div>
          <p className="mt-4 text-[#2c2c2c] font-serif">Đang tải...</p>
        </div>
      </div>
    )
  }
  