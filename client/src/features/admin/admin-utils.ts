export const statusTone = (status: string) =>
  ['paid', 'active', 'available'].includes(status)
    ? 'border-green-200 bg-green-50 text-green-700'
    : ['pending', 'low'].includes(status)
      ? 'border-amber-200 bg-amber-50 text-amber-700'
      : 'border-red-200 bg-red-50 text-red-700';
