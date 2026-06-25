# WhatsApp Integrations Guide

## Scope
This document explains realistic ways Viral Stick can integrate with WhatsApp-related flows.

## 1. Simple share links (already compatible)
### Web
Use a share link to send generated meme text or a page URL:
- `https://wa.me/?text=...`
- `https://api.whatsapp.com/send?text=...`

Best for:
- sharing meme text
- sharing remix page links
- sharing generated captions

Limits:
- no direct upload to WhatsApp Status from browser
- no guaranteed prefilled image upload to WhatsApp app

## 2. Mobile deep linking
On Android/iOS, the app can open WhatsApp using deep links.
Typical patterns:
- `whatsapp://send?text=...`
- fallback web link: `https://wa.me/?text=...`

Useful for:
- sending caption text
- sending a meme description
- guiding the user to paste/share manually

Limits:
- direct image injection into WhatsApp Status is restricted
- user usually still confirms inside WhatsApp

## 3. WhatsApp Business Platform / Cloud API
If Viral Stick later needs server-side automation, the correct route is Meta's WhatsApp Business Platform.

Possible capabilities:
- send approved outbound messages
- send media messages to opted-in users
- webhook-driven workflows

Important constraints:
- requires business setup
- template rules apply
- costs apply
- not suitable for consumer-style unrestricted meme posting to user Status

## 4. WhatsApp Status publishing reality
Direct programmatic posting to a user's personal WhatsApp Status is generally not available as an open public API flow.

Realistic UX options:
1. generate caption + image in Viral Stick
2. export/share image to device
3. open WhatsApp or WhatsApp Status flow manually
4. user publishes from WhatsApp

## 5. Recommended implementation path for Viral Stick
### Short term
- keep `WhatsAppShareButton` for text/link sharing
- add image export/download on web
- add local save/share on mobile

### Mid term
- mobile native share sheet
- Android intent sharing for image + text
- iOS share sheet for image + text

### Long term
- Business API only for official business messaging use cases
- not for direct consumer status autoposting

## 6. Waha / unofficial bridges
Some teams use unofficial bridges such as WAHA or WhatsApp Web automation layers.

Possible advantages:
- automation prototypes
- message relay experiments
- internal tools or sandbox setups

Major risks:
- account bans
- instability
- login/session fragility
- policy/compliance risks
- not suitable for a clean production consumer product

Recommendation:
- do not rely on WAHA as the core production path
- if used, isolate it as an experimental connector only

## 7. Product recommendation for now
Best production-safe path:
- generate meme in Viral Stick
- export the image
- share text via WhatsApp link
- let the user publish manually to Status

This keeps UX smooth without pretending there is an official Status autopost API when there is not.
