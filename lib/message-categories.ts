// lib/message-categories.ts
// Liste unique des catégories : utilisée par la Server Action (validation) ET par le formulaire (liste déroulante).
// ADAPTEZ-la, et la contrainte CHECK en base si elle existe.
export const MESSAGE_CATEGORIES = ['collaboration', 'question', 'recrutement', 'autre'] as const

// Type "union" dérivé de la liste : 'collaboration' | 'question' | ...
export type MessageCategory = (typeof MESSAGE_CATEGORIES)[number]

// Libellés affichés à l'écran (la valeur enregistrée en base reste la clé de gauche)
export const MESSAGE_CATEGORY_LABELS: Record<MessageCategory, string> = {
  collaboration: 'Collaboration',
  question: 'Question',
  recrutement: 'Recrutement',
  autre: 'Autre',
}