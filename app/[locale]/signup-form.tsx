import { Link } from "@/i18n/navigation"
import { redirect } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SubmitButton } from "@/components/submit-button"

import { useTranslations } from 'next-intl';

export function SignUpForm() {
  const t = useTranslations('SignUpForm');

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t('title')}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>
      <form
        action={async (formData: FormData) => {
          "use server"

          const email = formData.get("email")
          if (!email || typeof email !== "string") return

          const searchParams = new URLSearchParams({
            login_hint: email,
          })

          redirect(`/onboarding/signup?${searchParams.toString()}`)
        }}
      >
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <SubmitButton>{t('button')}</SubmitButton>
        </div>
      </form>
      <p className="px-8 text-center text-sm text-muted-foreground">
        {t.rich('agreement', {
          terms: (chunks) => (
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              {chunks}
            </Link>
          ),
          privacy: (chunks) => (
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  )
}
