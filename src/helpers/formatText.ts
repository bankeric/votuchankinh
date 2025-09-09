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

// data: {
//     "type": "end_of_stream",
//     "data": "",
//     "metadata": {
//         "question_id": "60d8207d-08a1-473c-9bd6-512f0dbba21b",
//         "response_answer_id": "7e529ba9-f425-43ae-a17b-97972134ffdd"
//     }
// }

export const formatTextEndStream = (
  text: string
): { question_id: string; response_answer_id: string } | null => {
  const matches = text.match(/data:\s*(\{.*?\})(?=data:|\s*$)/gs)

  if (matches) {
    let result = null
    matches.forEach((match) => {
      try {
        const jsonStr = match.replace('data:', '').trim()
        const parsed = JSON.parse(jsonStr)
        if (parsed.type === 'end_of_stream') {
          result = parsed.metadata as {
            question_id: string
            response_answer_id: string
          }
        }
      } catch (e) {
        console.error('Parse error', e)
      }
    })
    return result
  }
  return null
}
