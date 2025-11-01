import { Link } from "@/i18n/navigation"
import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useTranslations } from 'next-intl';

export function WelcomeBackCard() {
  const t = useTranslations('WelcomeBackCard');

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <div className="flex justify-center">
        <Button asChild>
          <Link href="/dashboard">
            {t('link')} <ArrowRightIcon className="ml-1.5 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
