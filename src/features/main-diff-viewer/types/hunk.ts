// Constants
export const LINE_TYPES = {
  ADDED: 'added',
  REMOVED: 'removed',
  CONTEXT: 'context',
} as const;

export const PREFIX_SYMBOLS = {
  [LINE_TYPES.ADDED]: '+',
  [LINE_TYPES.REMOVED]: '-',
  [LINE_TYPES.CONTEXT]: ' ',
} as const;
