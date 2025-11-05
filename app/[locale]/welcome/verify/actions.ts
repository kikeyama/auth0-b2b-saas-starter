"use server"

import { redirect } from "next/navigation"

import { managementClient, onboardingClient } from "@/lib/auth0"

import { getTranslations } from 'next-intl/server';

export async function resendVerificationEmail() {
  // Get translation from messages
  const t = await getTranslations('resendVerificationEmail');

  const session = await onboardingClient.getSession()

  if (!session) {
    return redirect("/onboarding/signup")
  }

  try {
    await managementClient.jobs.verifyEmail({
      user_id: session.user.sub,
    })

    return {}
  } catch (error) {
    console.error(t('failed_to_resend'), error)
    return {
      error: t('failed_to_resend'),
    }
  }
}
