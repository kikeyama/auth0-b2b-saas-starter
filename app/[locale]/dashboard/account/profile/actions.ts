"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { appClient, managementClient } from "@/lib/auth0"

import { getTranslations } from 'next-intl/server';

export async function updateDisplayName(formData: FormData) {
  // Get translation from messages
  const t = await getTranslations('updateDisplayName');

  const session = await appClient.getSession()

  if (!session) {
    return redirect("/auth/login")
  }

  const displayName = formData.get("display_name")

  if (!displayName || typeof displayName !== "string") {
    return {
      error: t('no_display_name'),
    }
  }

  try {
    await managementClient.users.update(
      {
        id: session.user.sub,
      },
      {
        name: displayName,
      }
    )

    // update the cached local session to reflect the new display name across the app
    await appClient.updateSession({
      ...session,
      user: {
        ...session.user,
        name: displayName,
      },
    })
    revalidatePath("/", "layout")
  } catch (error) {
    console.error(t('failed_to_update'), error)
    return {
      error: t('failed_to_update'),
    }
  }

  return {}
}

export async function deleteAccount() {
  // Get translation from messages
  const t = await getTranslations('deleteAccount');

  const session = await appClient.getSession()

  if (!session) {
    return redirect("/auth/login")
  }

  try {
    await managementClient.users.delete({
      id: session.user.sub,
    })

    return {}
  } catch (error) {
    console.error(t('failed_to_delete'), error)
    return {
      error: t('failed_to_delete'),
    }
  }
}
