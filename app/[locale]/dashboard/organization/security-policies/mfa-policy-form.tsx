"use client"

import { KeyIcon, KeySquareIcon, PhoneIcon } from "lucide-react"
import { toast } from "sonner"

import { MfaPolicy } from "@/lib/mfa-policy"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SubmitButton } from "@/components/submit-button"

import { updateMfaPolicy } from "./actions"

import { useTranslations } from 'next-intl';

interface Props {
  organization: {
    id: string
    displayName: string
    slug: string
    mfaPolicy: MfaPolicy
  }
}

export function MfaPolicyForm({ organization }: Props) {
  // Get translation from messages
  const t = useTranslations('MfaPolicyForm');

  return (
    <Card>
      <form
        action={async (formData: FormData) => {
          const { error } = await updateMfaPolicy(formData)

          if (error) {
            toast.error(error)
          } else {
            toast.success(t('success'))
          }
        }}
      >
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-row items-center justify-between rounded-lg border bg-field p-3 shadow-sm">
            <div className="space-y-1.5">
              <Label>{t('enforce_mfa.title')}</Label>
              <div className="text-sm text-muted-foreground">
                {t('enforce_mfa.description')}
              </div>
            </div>
            <Switch
              name="enforce"
              defaultChecked={organization.mfaPolicy.enforce}
            />
          </div>

          <Separator />

          <div className="grid w-full gap-1.5">
            <Label htmlFor="skip_for_domains">
              {t('do_not_enforce.title')}
            </Label>
            <Textarea
              defaultValue={organization.mfaPolicy.skipForDomains.join(", ")}
              placeholder="example.com, auth0.com"
              name="skip_for_domains"
              id="skip_for_domains"
            />
            <p className="text-sm text-muted-foreground">
              {t('do_not_enforce.description')}
            </p>
          </div>

          <Separator />

          <div className="grid gap-4">
            <Label>
              {t('mfa_providers.title')}
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between space-x-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <Label
                  className="flex items-center space-x-4"
                  htmlFor="sms"
                >
                  <div className="rounded-md border bg-secondary p-3">
                    <PhoneIcon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div>{t('mfa_providers.phone.title')}</div>
                    <div className="text-muted-foreground">
                      {t('mfa_providers.phone.description')}
                    </div>
                  </div>
                </Label>

                <Checkbox
                  defaultChecked={organization.mfaPolicy.providers.includes(
                    "sms"
                  )}
                  value="sms"
                  id="sms"
                  className="peer"
                  name="sms"
                />
              </div>

              <div className="flex justify-between space-x-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <Label className="flex items-center space-x-4" htmlFor="otp">
                  <div className="rounded-md border bg-secondary p-3">
                    <KeyIcon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div>{t('mfa_providers.otp.title')}</div>
                    <div className="text-muted-foreground">
                      {t('mfa_providers.otp.description')}
                    </div>
                  </div>
                </Label>

                <Checkbox
                  defaultChecked={organization.mfaPolicy.providers.includes(
                    "otp"
                  )}
                  value="otp"
                  id="otp"
                  className="peer"
                  name="otp"
                />
              </div>

              <div className="flex justify-between space-x-1 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent/5 hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <Label
                  className="flex items-center space-x-4"
                  htmlFor="webauthn-roaming"
                >
                  <div className="rounded-md border bg-secondary p-3">
                    <KeySquareIcon className="size-5" />
                  </div>
                  <div className="space-y-1.5">
                    <div>{t('mfa_providers.webauthn_roaming.title')}</div>
                    <div className="text-muted-foreground">
                      {t('mfa_providers.webauthn_roaming.description')}
                    </div>
                  </div>
                </Label>

                <Checkbox
                  defaultChecked={organization.mfaPolicy.providers.includes(
                    "webauthn-roaming"
                  )}
                  value="webauthn-roaming"
                  id="webauthn-roaming"
                  className="peer"
                  name="webauthn-roaming"
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>{t('button')}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
