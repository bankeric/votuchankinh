export const formatText = (text: string): string => {
  const matches = text.match(/data:\s*(\{.*?\})(?=data:|\s*$)/gs)

  if (matches) {
    let newText = ''
    matches.forEach((match) => {
      try {
        const jsonStr = match.replace('data:', '').trim()
        const parsed = JSON.parse(jsonStr)
        if (parsed.type === 'text') {
          newText += parsed.data
        }
      } catch (e) {
        console.error('Parse error', e)
      }
    })
    return newText
  }
  return ''
}
