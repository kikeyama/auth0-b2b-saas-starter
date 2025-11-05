"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/submit-button"

import { createEnrollment, deleteEnrollment } from "./actions"

type MfaEnrollment = {
  name: string
  enabled: boolean
  enrollmentId?: string
}

import { useTranslations } from 'next-intl';

interface IPopupWindow {
  width: number
  height: number
  title: string
  url: string
  focus: boolean
  scrollbars: boolean
}

const getFactorsMeta = ({ t, factor }) => {
  const factorMfa: {
    [key: string]: any
  } = {
    sms: {
      title: t('factors.sms.title'),
      description: t('factors.sms.description'),
    },
    "push-notification": {
      title: t('factors.push_notification.title'),
      description: t('factors.push_notification.description'),
    },
    otp: {
      title: t('factors.otp.title'),
      description: t('factors.otp.description'),
    },
    email: {
      title: t('factors.email.title'),
      description: t('factors.email.description'),
    },
    duo: {
      title: t('factors.duo.title'),
      description: t('factors.duo.description'),
    },
    "webauthn-roaming": {
      title: t('factors.webauthn_roaming.title'),
      description: t('factors.webauthn_roaming.description'),
    },
    "webauthn-platform": {
      title: t('factors.webauthn_platform.title'),
      description: t('factors.webauthn_platform.description'),
    },
    "recovery-code": {
      title: t('factors.recovery_code.title'),
      description: t('factors.recovery_code.description'),
    },
  }
  return (factorMfa[factor]);
}

function openPopupWindow(popupOptions: IPopupWindow): Window | null {
  {
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height

    const systemZoom = width / window.screen.availWidth
    const left = (width - popupOptions.width) / 2 / systemZoom + dualScreenLeft
    const top = (height - popupOptions.height) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(
      popupOptions.url,
      popupOptions.title,
      `scrollbars=${popupOptions.scrollbars ? "yes" : "no"},
      width=${popupOptions.width / systemZoom},
      height=${popupOptions.height / systemZoom},
      top=${top},
      left=${left}
      `
    )
    newWindow!.opener = null
    if (popupOptions.focus) {
      newWindow!.focus()
    }
    return newWindow
  }
}

type MFAEnrollmentProps = {
  factors: MfaEnrollment[]
}

export function MFAEnrollmentForm({ factors }: MFAEnrollmentProps) {
  // Get translation from messages
  const t = useTranslations('MFAEnrollmentForm');

  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>
          {t('description')}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 p-4 pt-0 md:p-6 md:pt-0">
        {factors
          .filter((factor: any) => factor.enabled)
          .map((factor: any, idx: number) => {
            const meta = getFactorsMeta({
              t: t,
              factor: factor.name
            });

            return (
              <div className="flex flex-col gap-6" key={`${meta.name}-${idx}`}>
                {idx > 0 && <Separator />}
                <div
                  key={factor.name}
                  className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-x-2 md:space-y-0"
                >
                  <Label className="flex flex-col space-y-1">
                    <span className="leading-6">
                      {meta.title}
                      {factor.enrollmentId && (
                        <Badge variant="default" className="ml-3">
                          Enrolled
                        </Badge>
                      )}
                    </span>
                    <p className="max-w-fit font-normal leading-snug text-muted-foreground">
                      {meta.description}
                    </p>
                  </Label>

                  <div className="flex items-center justify-end space-x-24 md:min-w-72">
                    {factor.enrollmentId ? (
                      <form
                        action={async (formData: FormData) => {
                          const { error } = await deleteEnrollment(formData)

                          if (error) {
                            toast.error(error)
                            return
                          }

                          toast.success(t('remove.success'))
                        }}
                      >
                        <input
                          type="hidden"
                          name="enrollment_id"
                          value={factor.enrollmentId}
                        />
                        <SubmitButton
                          className="h-fit min-w-24"
                          variant="outline"
                        >
                          {t('remove.button')}
                        </SubmitButton>
                      </form>
                    ) : (
                      <form
                        action={async (formData: FormData) => {
                          const { error, ticketUrl } =
                            await createEnrollment(formData)

                          if (error) {
                            toast.error(error)
                            return
                          }

                          const enrollmentPopupWindow = openPopupWindow({
                            url: ticketUrl!,
                            title: "SaaStart MFA Enrollment",
                            width: 450,
                            height: 720,
                            scrollbars: true,
                            focus: true,
                          })

                          const timer = setInterval(async () => {
                            if (
                              enrollmentPopupWindow &&
                              enrollmentPopupWindow.closed
                            ) {
                              clearInterval(timer)
                              router.refresh()
                            }
                          }, 200)
                        }}
                      >
                        <input
                          type="hidden"
                          name="factor_name"
                          value={factor.name}
                        />
                        <SubmitButton
                          className="h-fit min-w-24"
                          variant="default"
                        >
                          {t('enroll.button')}
                        </SubmitButton>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
