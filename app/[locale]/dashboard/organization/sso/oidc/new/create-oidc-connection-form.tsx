"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { CopyIcon, InfoCircledIcon, TrashIcon } from "@radix-ui/react-icons"
import slugify from "@sindresorhus/slugify"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Code } from "@/components/code"
import { SubmitButton } from "@/components/submit-button"

import { AddDomainDialog } from "../../components/add-domain-dialog"
import { createConnection } from "./actions"

import { useTranslations } from 'next-intl';

const CALLBACK_URL = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/login/callback`

interface Props {
  domainVerificationToken: string
}

export function CreateOidcConnectionForm({ domainVerificationToken }: Props) {
  // Get translation from messages
  const t = useTranslations('CreateOidcConnectionForm');

  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState("back_channel")
  const [domains, setDomains] = useState<string[]>([])

  return (
    <Card>
      <form
        action={async (formData: FormData) => {
          const { error } = await createConnection(formData)

          if (error) {
            toast.error(error)
          } else {
            toast.success(t('success'))
            router.push("/dashboard/organization/sso")
          }
        }}
      >
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>
            {t('description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="display_name">{t('name')}</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Acme OIDC"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              {t('identifier')}: <Code>{slugify(name || "Acme OIDC")}</Code>
            </p>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="discovery_url">{t('discovery_url')}</Label>
            <Input
              id="discovery_url"
              name="discovery_url"
              type="url"
              placeholder="https://auth.example.com/.well-known/openid-configuration"
            />
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="type">{t('type.title')}</Label>
            <RadioGroup
              id="type"
              name="type"
              defaultValue="front_channel"
              className="grid grid-cols-2 gap-2"
              value={type}
              onValueChange={setType}
            >
              <div>
                <RadioGroupItem
                  value="back_channel"
                  id="back_channel"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="back_channel"
                  className="flex h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="space-y-1.5">
                    <div>{t('type.back_channel.title')}</div>
                    <div className="leading-normal text-muted-foreground">
                      {t.rich('type.back_channel.description', {response_type: (chunks) => <Code>{chunks}</Code>})}
                    </div>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="front_channel"
                  id="front_channel"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="front_channel"
                  className="flex h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="space-y-1.5">
                    <div>{t('type.front_channel.title')}</div>
                    <div className="leading-normal text-muted-foreground">
                      {t.rich('type.front_channel.description', {
                        response_mode: (chunks) => <Code>{chunks}</Code>,
                        response_type: (chunks) => <Code>{chunks}</Code>
                      })}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="client_id">{t('client_id')}</Label>
            <Input
              id="client_id"
              name="client_id"
              type="text"
              placeholder="client_iPK9vGmAkQKgXTweA8"
            />
          </div>

          {type === "back_channel" && (
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="client_secret">{t('client_secret')}</Label>
              <Input
                id="client_secret"
                name="client_secret"
                type="password"
                placeholder="··················"
              />
            </div>
          )}

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="scope">{t('scopes.title')}</Label>
            <Input
              id="scope"
              name="scope"
              type="text"
              defaultValue="openid profile email"
              placeholder="openid profile email"
            />
            <p className="text-sm text-muted-foreground">
              {t.rich('scopes.description', {
                openid: (chunks) => <Code>{chunks}</Code>
              })}
            </p>
          </div>

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="domains">{t('domains.title')}</Label>
            <Input
              id="domains"
              name="domains"
              type="text"
              className="hidden"
              value={domains.join(",")}
              readOnly
            />
            {domains.length > 0 ? (
              domains.map((domain) => (
                <div key={domain} className="flex space-x-2">
                  <Input className="font-mono" value={domain} readOnly />
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setDomains(domains.filter((d) => d !== domain))
                      }}
                    >
                      <TrashIcon className="size-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                <p>{t('domains.alert')}</p>
              </div>
            )}
            <div>
              <AddDomainDialog
                domains={domains}
                setDomains={setDomains}
                domainVerificationToken={domainVerificationToken}
              />
            </div>
          </div>

          <Alert>
            <InfoCircledIcon className="size-4" />
            <AlertTitle>{t('callback_url.title')}</AlertTitle>
            <AlertDescription>
              {t('callback_url.description')}
              <div className="mt-2 flex space-x-2">
                <Input className="font-mono" value={CALLBACK_URL} readOnly />
                <Button size="icon" variant="outline" type="button">
                  <CopyIcon
                    className="size-4"
                    onClick={async () => {
                      await navigator.clipboard.writeText(CALLBACK_URL)
                      toast.success(t('callback_url.success'))
                    }}
                  />
                </Button>
              </div>
            </AlertDescription>
          </Alert>

          <Separator />

          <div className="grid w-full items-center gap-2">
            <Label htmlFor="assign_membership_on_login">{t('auto_membership.title')}</Label>
            <RadioGroup
              id="assign_membership_on_login"
              name="assign_membership_on_login"
              defaultValue="enabled"
              className="grid grid-cols-2 gap-2"
            >
              <div>
                <RadioGroupItem
                  value="enabled"
                  id="enable_auto_membership"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="enable_auto_membership"
                  className="flex h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="space-y-1.5">
                    <div>{t('auto_membership.enable.title')}</div>
                    <div className="leading-normal text-muted-foreground">
                      {t('auto_membership.enable.description')}
                    </div>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem
                  value="disabled"
                  id="disable_auto_membership"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="disable_auto_membership"
                  className="flex h-full rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div className="space-y-1.5">
                    <div>{t('auto_membership.disable.title')}</div>
                    <div className="leading-normal text-muted-foreground">
                      {t('auto_membership.disable.description')}
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton>{t('button')}</SubmitButton>
        </CardFooter>
      </form>
    </Card>
  )
}
