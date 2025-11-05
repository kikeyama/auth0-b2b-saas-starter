"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { appClient, managementClient } from "@/lib/auth0"

import { getTranslations } from 'next-intl/server';

export async function createEnrollment(formData: FormData) {
  // Get translation from messages
  const t = await getTranslations('createEnrollment');

  const session = await appClient.getSession()

  if (!session) {
    return redirect("/auth/login")
  }

  let factorName = formData.get("factor_name")

  if (!factorName || typeof factorName !== "string") {
    return {
      error: t('no_factor_name'),
    }
  }

  try {
    const userId = session?.user.sub

    if (factorName === "sms" || factorName === "voice") {
      factorName = "phone"
    }

    const { data: enrollmentTicket } =
      await managementClient.guardian.createEnrollmentTicket({
        user_id: userId,
        //@ts-ignore
        factor: factorName,
        allow_multiple_enrollments: true,
      })

    revalidatePath("/dashboard/account/security", "layout")

    return {
      ticketUrl: enrollmentTicket.ticket_url,
    }
  } catch (error) {
    console.error(t('failed_to_create'), error)
    return {
      error: t('failed_to_create'),
    }
  }
}

export async function deleteEnrollment(formData: FormData) {
  // Get translation from messages
  const t = await getTranslations('deleteEnrollment');

  const session = await appClient.getSession()

  if (!session) {
    return redirect("/auth/login")
  }

  let enrollmentId = formData.get("enrollment_id")

  if (!enrollmentId || typeof enrollmentId !== "string") {
    return {
      error: "Enrollment ID is required.",
    }
  }

  try {
    const userId = session?.user.sub

    await managementClient.users.deleteAuthenticationMethod({
      id: userId,
      authentication_method_id: enrollmentId,
    })

    revalidatePath("/dashboard/account/security", "layout")

    return {}
  } catch (error) {
    console.error(t('failed_to_delete'), error)
    return {
      error: t('failed_to_delete'),
    }
  }
}
