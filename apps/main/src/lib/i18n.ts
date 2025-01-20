import { resources } from '@shared/@types/resources'

import { app } from 'electron'
import i18next from 'i18next'

export async function initI18n() {
  await i18next.init({
    lng: app.getLocale(),
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  })
}
