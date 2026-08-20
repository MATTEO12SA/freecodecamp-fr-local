import sanitizeHtml from 'sanitize-html';

/** Allowed markup for quiz/exam HTML from trusted curriculum markdown. */
const QUIZ_HTML_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'b',
    'i',
    'em',
    'strong',
    'code',
    'pre',
    'br',
    'p',
    'ul',
    'ol',
    'li',
    'span',
    'div',
    'a',
    'wbr'
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    code: ['class'],
    span: ['class'],
    div: ['class'],
    pre: ['class']
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' })
  }
};

export function sanitizeQuizHtml(html: string): string {
  return sanitizeHtml(html || '', QUIZ_HTML_OPTIONS);
}
