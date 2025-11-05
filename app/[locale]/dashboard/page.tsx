import { Link } from "@/i18n/navigation"
import { ArrowRightIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"

import { getTranslations } from 'next-intl/server';

export default async function DashboardHome() {
  // Get translation from messages
  const t = await getTranslations('DashboardHome');

  return (
    <div className="flex flex-1 flex-grow flex-col gap-4 lg:gap-6">
      <div className="flex flex-1 items-center justify-center rounded-3xl border bg-field shadow-sm">
        <div className="flex max-w-[500px] flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            {t('title')}
          </h3>
          <p className="mt-3 text-muted-foreground">
            {t('description_1')}
          </p>
          <p className="mt-3 text-muted-foreground">
            {t('description_2')}
          </p>
          <div className="mt-8">
            <Link href="/dashboard/organization/general" className="w-full">
              <Button className="w-full">
                {t('button')}
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
          <p className="mt-3 text-muted-foreground">
            {t.rich('caution', {
              admin: (chunks) => <span className="font-bold">{chunks}</span>
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
