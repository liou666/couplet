import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from '@renderer/components/ui/select'
import { supportLangs } from '@shared/@types/resources'
import { LanguagesList } from '@shared/langs/lang-list'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

const LanguageSelector = ({
  triggerClassName,
}: {
  triggerClassName?: string
}) => {
  const { i18n } = useTranslation()

  const handleLanguageChange = (newLang: string) => {
    console.log('event.target.value', newLang)
    console.log('Changing language to:', newLang)
    console.log('Current translations:', i18n.store.data)
    i18n.changeLanguage(newLang)
  }

  return (
    <Select
      value={i18n.language}
      onValueChange={handleLanguageChange}
    >
      <SelectTrigger className={
        clsx('w-full', triggerClassName)
      }
      >
        <SelectValue placeholder="Select a language" />
      </SelectTrigger>
      <SelectContent>
        {
          LanguagesList.filter(({ code }) => supportLangs.includes(code))
            .map(({ code, language }) => (
              <SelectItem key={code} value={code}>{language}</SelectItem>
            ))
        }
      </SelectContent>
    </Select>
  )
}

export default LanguageSelector
