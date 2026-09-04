import { env } from '$env/dynamic/private';
import { createEmailSender } from './email-sender';

export const sendEmail = createEmailSender(env.RESEND_API_KEY, env.RESEND_FROM_EMAIL);
