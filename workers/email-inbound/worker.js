/**
 * ShapeKraft Quote Desk — Cloudflare Email Worker.
 * Every email to hello@shapekraft.co is (1) forwarded to your Gmail as today and
 * (2) posted to the quote desk, which drafts a reply for you to approve on Telegram.
 *
 * Variables (Worker → Settings → Variables):
 *   DESK_URL     = https://www.shapekraft.co/api/desk/inbound
 *   DESK_SECRET  = same value as DESK_SECRET in Vercel (mark as Secret)
 *   FORWARD_TO   = your Gmail address (must be a verified destination in Email Routing)
 */
import PostalMime from 'postal-mime';

export default {
  async email(message, env, ctx) {
    // Keep the normal inbox flow working no matter what happens below.
    await message.forward(env.FORWARD_TO);

    try {
      const email = await PostalMime.parse(message.raw);
      const text = (email.text || (email.html || '').replace(/<[^>]+>/g, ' ')).trim();
      ctx.waitUntil(
        fetch(env.DESK_URL, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-desk-secret': env.DESK_SECRET },
          body: JSON.stringify({
            channel: 'email',
            from: email.from?.address || message.from,
            name: email.from?.name || '',
            subject: email.subject || '',
            text: text.slice(0, 8000),
            messageId: email.messageId || '',
            autoSubmitted: message.headers.get('auto-submitted') || '',
          }),
        }),
      );
    } catch (err) {
      console.log('desk post failed', String(err));
    }
  },
};
