"use client"

import { useState } from "react"
import {
  CheckIcon,
  CopyIcon,
  PlusIcon,
  SymbolIcon,
} from "@radix-ui/react-icons"
import { toast } from "sonner"

import { DOMAIN_VERIFICATION_RECORD_IDENTIFIER } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { verifyDomain } from "../actions"

import { useTranslations } from 'next-intl';

interface Props {
  domains: string[]
  setDomains: (domains: string[]) => void
  domainVerificationToken: string
}

export function AddDomainDialog({
  domains,
  setDomains,
  domainVerificationToken,
}: Props) {
  // Get translation from messages
  const t = useTranslations('AddDomainDialog');

  const [domainVerified, setDomainVerified] = useState(false)
  const [domain, setDomain] = useState("")
  const [checkingVerificationStatus, setCheckingVerificationStatus] =
    useState(false)
  const [showDomainVerificationDialog, setShowDomainVerificationDialog] =
    useState(false)

  return (
    <Dialog
      open={showDomainVerificationDialog}
      onOpenChange={() => {
        setShowDomainVerificationDialog(!showDomainVerificationDialog)
        setDomain("")
        setDomainVerified(false)
        setCheckingVerificationStatus(false)
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <PlusIcon className="mr-1 size-3" /> {t('button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>
            {t.rich('description', {
              learnmore: (chunks) => (
                <a
                  className="underline underline-offset-4"
                  href={`https://auth0.com/docs/authenticate/login/auth0-universal-login/identifier-first#define-home-realm-discovery-identity-providers`}
                  target="_blank"
                >
                  {chunks}
                </a>
              )
            })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="domain">{t('domain')}</Label>
            <Input
              id="domain"
              name="domain"
              type="text"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={domainVerified}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('verification.title')}</CardTitle>
              <CardDescription>
                {t('verification.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <Label>{t('verification.name.title')}</Label>
                  <div className="flex space-x-2">
                    <Input className="font-mono" value="@ (root)" readOnly />
                    <Button size="icon" variant="outline" type="button">
                      <CopyIcon
                        className="size-4"
                        onClick={async () => {
                          await navigator.clipboard.writeText("@")
                          toast.success(t('verification.name.copied'))
                        }}
                      />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>{t('verification.value.title')}</Label>
                  <div className="flex space-x-2">
                    <Input
                      className="font-mono"
                      value={`${DOMAIN_VERIFICATION_RECORD_IDENTIFIER}=${domainVerificationToken}`}
                      readOnly
                    />
                    <Button size="icon" variant="outline" type="button">
                      <CopyIcon
                        className="size-4"
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            `${DOMAIN_VERIFICATION_RECORD_IDENTIFIER}=${domainVerificationToken}`
                          )
                          toast.success(t('verification.value.copied'))
                        }}
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                variant="secondary"
                disabled={domainVerified}
                onClick={async () => {
                  setCheckingVerificationStatus(true)
                  const result = await verifyDomain(domain)

                  if (result.error) {
                    toast.error(result.error)
                  } else if ("verified" in result && result.verified) {
                    setDomainVerified(result.verified)
                    toast.success(t('verification.success'))
                  }

                  setCheckingVerificationStatus(false)
                }}
              >
                {domainVerified ? (
                  <>
                    <CheckIcon className="mr-2 size-4" /> {t('verification.verified')}
                  </>
                ) : (
                  <>
                    <SymbolIcon
                      className={cn(
                        "mr-2 size-4",
                        checkingVerificationStatus ? "animate-spin" : ""
                      )}
                    />{" "}
                    {checkingVerificationStatus ? t('verification.checking') : t('verification.check_again')}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <DialogFooter>
          <Button
            type="button"
            disabled={!domainVerified}
            onClick={() => {
              // ensure that the domain does not already exist
              const domainExists = domains.find((d) => d === domain)
              if (domainExists) {
                toast.error("Domain has already been added.")
                return
              }

              setDomains([...domains, domain])
              setShowDomainVerificationDialog(false)
            }}
          >
            {t('button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
