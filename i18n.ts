import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !['en', 'es', 'fr'].includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});