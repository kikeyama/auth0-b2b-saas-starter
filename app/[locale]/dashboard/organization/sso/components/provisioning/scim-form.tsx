"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  CopyIcon,
  InfoCircledIcon,
  TrashIcon,
  UpdateIcon,
} from "@radix-ui/react-icons"
import { format, formatDistance } from "date-fns"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SubmitButton } from "@/components/submit-button"

import {
  createScimConfig,
  createScimToken,
  deleteScimConfig,
  deleteScimToken,
  updateScimConfig,
} from "./actions"

import { useTranslations, useNow, useFormatter } from 'next-intl';

interface Props {
  scimConfig: {
    userIdAttribute: string
  } | null
  scimTokens: Array<{
    id: string
    lastUsedAt?: string
    createdAt: string
  }>
}

export function ScimForm({ scimConfig, scimTokens }: Props) {
  // Get translation from messages
  const t = useTranslations('ScimForm');
  const i18nFormat = useFormatter();

  const [generatingToken, setGeneratingToken] = useState(false)
  const [showTokenDialog, setShowTokenDialog] = useState(false)
  const [token, setToken] = useState("")
  const { connectionId } = useParams<{ connectionId: string }>()
  const SCIM_ENDPOINT_URL = `https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/scim/v2/connections/${connectionId}/`

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div className="space-y-2">
              <CardTitle>{t('title')}</CardTitle>
              <CardDescription>
                {t('description')}
              </CardDescription>
            </div>
            <div>
              <Switch
                id="enable-scim"
                defaultChecked={!!scimConfig}
                onCheckedChange={async (checked) => {
                  if (checked) {
                    const { error } = await createScimConfig(connectionId)
                    if (error) {
                      return toast.error(error)
                    }

                    toast.success(t('enabled'))
                  } else {
                    const { error } = await deleteScimConfig(connectionId)
                    if (error) {
                      return toast.error(error)
                    }

                    toast.success(t('disabled'))
                  }
                }}
              />
              <Label className="sr-only" htmlFor="enable-scim">
                Enable SCIM
              </Label>
            </div>
          </div>
        </CardHeader>
        {scimConfig && (
          <form
            action={async (formData: FormData) => {
              const { error } = await updateScimConfig(connectionId, formData)

              if (error) {
                toast.error(error)
                return
              }

              toast.success(t('success'))
            }}
          >
            <CardContent className="grid gap-4">
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="user_id_attribute">{t('user_id_attribute.title')}</Label>
                <Input
                  id="user_id_attribute"
                  name="user_id_attribute"
                  type="text"
                  placeholder="externalId"
                  defaultValue={scimConfig?.userIdAttribute || "externalId"}
                />
                <p className="text-sm text-muted-foreground">
                  {t('user_id_attribute.description')}
                </p>
              </div>
              <div className="grid w-full items-center gap-2">
                <Label htmlFor="generate_tokens">{t('tokens.title')}</Label>
                {scimTokens.length > 0 ? (
                  <div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('tokens.table.id')}</TableHead>
                          <TableHead>{t('tokens.table.last_used_at')}</TableHead>
                          <TableHead>{t('tokens.table.created_at')}</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scimTokens.map((token) => (
                          <TableRow key={token.id}>
                            <TableCell className="font-medium">
                              {token.id}
                            </TableCell>
                            <TableCell>
                              {token.lastUsedAt
//                                ? i18nFormat.relativeTime(token.lastUsedAt, useNow())
                                ? i18nFormat.relativeTime(token.lastUsedAt, new Date())
//                                ? formatDistance(token.lastUsedAt, new Date())
                                : t('tokens.table.never')}
                            </TableCell>
                            <TableCell>
                              {/* t('tokens.table.created_date', {createdDate: new Date(token.createdAt)}) */}
                              {i18nFormat.dateTime(new Date(token.createdAt), {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                              {/* format(token.createdAt, "MMM d, yyyy") */}
                            </TableCell>
                            <TableCell className="flex justify-end">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                  >
                                    <TrashIcon className="size-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      {t('tokens.table.delete_token.title')}
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      {t('tokens.table.delete_token.description')}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      {t('tokens.table.delete_token.cancel')}
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={async () => {
                                        const { error } = await deleteScimToken(
                                          connectionId,
                                          token.id
                                        )
                                        if (error) {
                                          return toast.error(error)
                                        }
                                        toast.success(
                                          t('tokens.table.delete_token.success')
                                        )
                                      }}
                                    >
                                      {t('tokens.table.delete_token.submit')}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
                      <p>{t('tokens.no_tokens')}</p>
                    </div>
                  </div>
                )}
                  <div className="space-y-2">
                    <div>
                      <Button
                        id="generate_tokens"
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          setGeneratingToken(true)

                          const res = await createScimToken(connectionId)
                          if (res.error) {
                            setGeneratingToken(false)
                            return toast.error(res.error)
                          }

                          setGeneratingToken(false)
                          toast.success(
                            t('tokens.generate_token.success')
                          )

                          // @ts-ignore
                          setToken(res.token)
                          setShowTokenDialog(true)
                        }}
                      >
                        <UpdateIcon
                          className={cn(
                            "mr-1 size-3",
                            generatingToken && "animate-spin"
                          )}
                        />{" "}
                        {t('tokens.generate_token.button')}
                      </Button>
                    </div>
                  </div>
              </div>
              <Alert>
                <InfoCircledIcon className="size-4" />
                <AlertTitle>{t('scim_endpoint.title')}</AlertTitle>
                <AlertDescription>
                  {t('scim_endpoint.description')}
                  <div className="mt-2 flex space-x-2">
                    <Input
                      className="font-mono"
                      value={SCIM_ENDPOINT_URL}
                      readOnly
                    />
                    <Button size="icon" variant="outline" type="button">
                      <CopyIcon
                        className="size-4"
                        onClick={async () => {
                          await navigator.clipboard.writeText(SCIM_ENDPOINT_URL)
                          toast.success(
                            t('scim_endpoint.copied')
                          )
                        }}
                      />
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-end">
              <SubmitButton>{t('button')}</SubmitButton>
            </CardFooter>
          </form>
        )}
      </Card>

      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('dialog.title')}</DialogTitle>
            <DialogDescription>
              {t('dialog.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="token" className="sr-only">
                {t('dialog.token')}
              </Label>
              <Input id="token" defaultValue={token} readOnly />
            </div>
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={async () => {
                await navigator.clipboard.writeText(token)
                toast.success(t('dialog.copied'))
              }}
            >
              <span className="sr-only">Copy</span>
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t('dialog.close')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
