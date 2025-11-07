import DOMPurify from 'dompurify'

interface SanitizeOptions {
  openLinksInNewWindow?: boolean
}

export function sanitizeHtml(dirty: string, options: SanitizeOptions = {}): string {
  const { openLinksInNewWindow = true } = options

  const config = {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'b',
      'i',
      'u',
      'a',
      'img',
      'ul',
      'ol',
      'li',
      'blockquote',
      'code',
      'pre',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'div',
      'span'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_DOM_IMPORT: false
  }

  let cleaned = DOMPurify.sanitize(dirty, config)

  if (openLinksInNewWindow) {
    // Add target="_blank" to all links
    cleaned = cleaned.replace(/<a\s+([^>]*?)href=/g, '<a data-external-link $1href=')
  }

  return cleaned
}

export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}
