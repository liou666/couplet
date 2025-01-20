import { useTheme } from '@/components/theme-provider'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'

export function ThemeSelector() {
  const { setTheme } = useTheme()
  const { t } = useTranslation()

  return (
    <div className="m-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <i className="dark:i-mingcute-moon-line !h-[1.2rem] !w-[1.2rem] i-mingcute-sun-line" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme('light')}>
            {t('web.theme.light')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('dark')}>
            {t('web.theme.dark')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme('system')}>
            {t('web.theme.system')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
