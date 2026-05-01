const EMOJI_MAP = {
  Electronics: '💻',
  Books: '📚',
  Sports: '🏋️',
  Clothing: '👕',
}

export function categoryEmoji(categoryName) {
  return EMOJI_MAP[categoryName] ?? '📦'
}
