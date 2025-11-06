"use server"

import { revalidatePath } from "next/cache"
import { SessionData } from "@auth0/nextjs-auth0/types"

import { managementClient } from "@/lib/auth0"
import { withServerActionAuth } from "@/lib/with-server-action-auth"

import { getTranslations } from 'next-intl/server';

export const updateDisplayName = withServerActionAuth(
  async function updateDisplayName(formData: FormData, session: SessionData) {
    // Get translation from messages
    const t = await getTranslations('updateDisplayName');

    const displayName = formData.get("display_name")

    if (!displayName || typeof displayName !== "string") {
      return {
        error: t('no_display_name'),
      }
    }

    try {
      await managementClient.organizations.update(
        {
          id: session.user.org_id!,
        },
        {
          display_name: displayName,
        }
      )

      revalidatePath("/", "layout")
    } catch (error) {
      console.error("failed to update organization display name", error)
      return {
        error: t('failed_to_update'),
      }
    }

    return {}
  },
  {
    role: "admin",
  }
)
