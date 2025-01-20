import { resources } from '@shared/@types/resources'
import i18n from 'i18next'

import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources,
  interpolation: {
    escapeValue: false,
  },
})
