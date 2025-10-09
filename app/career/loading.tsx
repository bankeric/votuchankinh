export default function Loading() {
    return (
      <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#d4af37] border-t-transparent mb-4"></div>
          <p className="text-[#eae6dd] font-serif">Loading careers...</p>
        </div>
      </div>
    )
  }
  