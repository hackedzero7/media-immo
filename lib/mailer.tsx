import nodemailer from "nodemailer"

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env

const FROM = MAIL_FROM || SMTP_USER

if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !FROM) {
  console.warn(
    "[v0] Missing SMTP env vars. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM (or allow fallback to SMTP_USER).",
  )
}

let transporter: nodemailer.Transporter | null = null

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT || 587),
      secure: Number(SMTP_PORT || 587) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  return transporter
}

export async function sendMail(params: {
  to: string
  subject: string
  html?: string
  text?: string
}) {
  const tx = getTransporter()
  const { to, subject, html, text } = params
  return tx.sendMail({
    from: FROM,
    to,
    subject,
    text,
    html,
  })
}

export async function sendPurchaseEmails(params: {
  userEmail: string
  productName: string
  priceAmount: number
  priceCurrency: string
  interval?: string
  subscriptionId: string
  currentPeriodEnd: Date | string | number
}) {
  const { userEmail, productName, priceAmount, priceCurrency, interval, subscriptionId, currentPeriodEnd } = params

  const adminEmail = process.env.ADMIN_EMAIL
  if (!userEmail) {
    console.warn("[v0] sendPurchaseEmails called without userEmail")
    return
  }

  const amount = (() => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (priceCurrency || "USD").toUpperCase(),
      }).format(Number(priceAmount || 0))
    } catch {
      return `${priceAmount} ${priceCurrency || "usd"}`
    }
  })()

  const periodEnd = new Date(currentPeriodEnd)
  const periodEndStr = isNaN(periodEnd.getTime())
    ? String(currentPeriodEnd)
    : `${periodEnd.toLocaleDateString()} ${periodEnd.toLocaleTimeString()}`

  const commonLines = [
    `Product: ${productName}`,
    `Plan: ${interval || "N/A"}`,
    `Amount: ${amount}`,
    `Subscription ID: ${subscriptionId}`,
    `Current Period End: ${periodEndStr}`,
  ]

  // DEFAULT user email content (generic)
  let userSubject = `Subscription confirmed: ${productName}`
  let userText = `Thanks for your purchase!
${commonLines.join("\n")}`
  let userHtml = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">Thanks for your purchase!</h2>
      <p style="margin: 0 0 8px;">Your subscription is active.</p>
      <ul style="margin: 0; padding-left: 18px;">
        <li><strong>Product:</strong> ${productName}</li>
        <li><strong>Plan:</strong> ${interval || "N/A"}</li>
        <li><strong>Amount:</strong> ${amount}</li>
        <li><strong>Subscription ID:</strong> ${subscriptionId}</li>
        <li><strong>Current Period End:</strong> ${periodEndStr}</li>
      </ul>
    </div>
  `

  // Override user email content based on productName (Indépendant vs Agence)
  const n = (productName || "").toLowerCase()
  if (n.includes("indépendant") || n.includes("independant") || n.includes("independent")) {
    const t = buildIndependentWelcomeEmail()
    userSubject = t.subject
    userText = t.text
    userHtml = t.html
  } else if (n.includes("agence") || n.includes("agency")) {
    const t = buildAgencyWelcomeEmail()
    userSubject = t.subject
    userText = t.text
    userHtml = t.html
  }

  // Admin notification (unchanged)
  const adminSubject = `New subscription: ${productName} by ${userEmail}`
  const adminText = `A user completed a subscription.
User: ${userEmail}
${commonLines.join("\n")}`
  const adminHtml = `
    <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">
      <h2 style="margin: 0 0 12px;">New subscription</h2>
      <p style="margin: 0 0 8px;">A user has purchased a subscription.</p>
      <p style="margin: 0 0 8px;"><strong>User:</strong> ${userEmail}</p>
      <ul style="margin: 0; padding-left: 18px;">
        <li><strong>Product:</strong> ${productName}</li>
        <li><strong>Plan:</strong> ${interval || "N/A"}</li>
        <li><strong>Amount:</strong> ${amount}</li>
        <li><strong>Subscription ID:</strong> ${subscriptionId}</li>
        <li><strong>Current Period End:</strong> ${periodEndStr}</li>
      </ul>
    </div>
  `

  const tasks: Promise<unknown>[] = [sendMail({ to: userEmail, subject: userSubject, text: userText, html: userHtml })]
  if (adminEmail) {
    tasks.push(sendMail({ to: adminEmail, subject: adminSubject, text: adminText, html: adminHtml }))
  } else {
    console.warn("[v0] ADMIN_EMAIL is not set; skipping admin notification")
  }

  await Promise.allSettled(tasks)
}

export async function sendCancellationEmails(params: {
  actor: "user" | "admin"
  userEmail?: string
  productName?: string
  subscriptionId: string
}) {
  const adminEmail = process.env.ADMIN_EMAIL
  const { actor, userEmail, productName = "Subscription", subscriptionId } = params

  // Build common pieces
  const subLine = `Subscription ID: ${subscriptionId}`
  const subjectUser = `Your subscription was cancelled`
  const subjectAdmin = `User cancelled subscription`
  const bodyUserText = `Your ${productName} subscription has been cancelled.\n${subLine}`
  const bodyAdminText = `A user has cancelled their ${productName} subscription.\n${subLine}`
  const bodyUserHtml = `
    <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6">
      <h3 style="margin:0 0 8px">Your subscription was cancelled</h3>
      <p style="margin:0 0 8px"><strong>Product:</strong> ${productName}</p>
      <p style="margin:0 0 8px"><strong>${subLine}</strong></p>
    </div>
  `
  const bodyAdminHtml = `
    <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.6">
      <h3 style="margin:0 0 8px">User cancelled subscription</h3>
      <p style="margin:0 0 8px"><strong>Product:</strong> ${productName}</p>
      <p style="margin:0 0 8px"><strong>${subLine}</strong></p>
    </div>
  `

  const tasks: Promise<unknown>[] = []

  if (actor === "user") {
    // Notify admin only
    if (adminEmail) {
      tasks.push(
        sendMail({
          to: adminEmail,
          subject: subjectAdmin,
          text: bodyAdminText,
          html: bodyAdminHtml,
        }),
      )
    } else {
      console.warn("[v0] ADMIN_EMAIL is not set; skipping admin cancellation notification")
    }
  } else if (actor === "admin") {
    // Notify user only
    if (userEmail) {
      tasks.push(
        sendMail({
          to: userEmail,
          subject: subjectUser,
          text: bodyUserText,
          html: bodyUserHtml,
        }),
      )
    } else {
      console.warn("[v0] userEmail not provided; skipping user cancellation notification")
    }
  }

  await Promise.allSettled(tasks)
}

function buildIndependentWelcomeEmail() {
  const subject = "🎉 Bienvenue dans l’abonnement Indépendant de MEDIA IMMO !"
  const text = [
    "Bonjour,",
    "",
    "Un grand bravo 🎉 et félicitations pour votre abonnement au plan Indépendant MEDIA IMMO !",
    "Vous venez de rejoindre une communauté d’agents ambitieux qui se démarquent par leur professionnalisme et leur image.",
    "",
    "Votre abonnement est actif dès aujourd’hui ✅",
    "Voici ce qui vous attend :",
    "• 📸 Un portrait professionnel offert tous les 6 mois",
    "• 🏠 Home staging virtuel offert pour vos appartements",
    "• 🌅 Photos crépusculaires offertes pour vos maisons",
    "• ⚡ Livraison express 24h garantie",
    "• 💎 Support client VIP + priorité sur les créneaux",
    "• 🎁 10% de remise sur tous nos services",
    "• 📷 Un shooting offert à chaque 11ᵉ projet",
    "• 🌐 Kit réseaux sociaux + mini-site web pour chaque bien",
    "",
    "👉 Dans un prochain mail, vous recevrez votre code coupon personnel, à utiliser sur votre prochaine commande.",
    "",
    "Merci encore pour votre confiance — on a hâte de sublimer vos prochains biens !",
    "",
    "À très vite,",
    "L’équipe MEDIA IMMO",
    "📞 +33 7 67 57 92 28",
    "🌐 https://www.forfaitsmediaimmobilier.com/",
    "📸 Instagram : @mediaimmo",
  ].join("\n")

  const html = `
    <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; line-height:1.6;">
      <p style="margin:0 0 8px;">Bonjour,</p>
      <p style="margin:0 0 8px;">Un grand bravo 🎉 et félicitations pour votre abonnement au plan <strong>Indépendant MEDIA IMMO</strong> !</p>
      <p style="margin:0 0 8px;">Vous venez de rejoindre une communauté d’agents ambitieux qui se démarquent par leur professionnalisme et leur image.</p>
      <p style="margin:0 0 8px;">Votre abonnement est actif dès aujourd’hui ✅</p>
      <p style="margin:0 0 8px;">Voici ce qui vous attend :</p>
      <ul style="margin:0 0 8px; padding-left: 18px;">
        <li>📸 Un portrait professionnel offert tous les 6 mois</li>
        <li>🏠 Home staging virtuel offert pour vos appartements</li>
        <li>🌅 Photos crépusculaires offertes pour vos maisons</li>
        <li>⚡ Livraison express 24h garantie</li>
        <li>💎 Support client VIP + priorité sur les créneaux</li>
        <li>🎁 10% de remise sur tous nos services</li>
        <li>📷 Un shooting offert à chaque 11ᵉ projet</li>
        <li>🌐 Kit réseaux sociaux + mini-site web pour chaque bien</li>
      </ul>
      <p style="margin:0 0 8px;">👉 Dans un prochain mail, vous recevrez votre code coupon personnel, à utiliser sur votre prochaine commande.</p>
      <p style="margin:0 0 8px;">Merci encore pour votre confiance — on a hâte de sublimer vos prochains biens !</p>
      <p style="margin:0 0 8px;">À très vite,<br/>L’équipe MEDIA IMMO</p>
      <p style="margin:0 0 8px;">📞 +33 7 67 57 92 28<br/>🌐 https://www.forfaitsmediaimmobilier.com/<br/>📸 Instagram : @mediaimmo</p>
    </div>
  `
  return { subject, text, html }
}

function buildAgencyWelcomeEmail() {
  const subject = "🚀 Votre agence rejoint la communauté MEDIA IMMO PRO !"
  const text = [
    "Bonjour,",
    "",
    "Bienvenue à bord et félicitations pour votre abonnement au plan Agence MEDIA IMMO ! 🎉",
    "Votre équipe fait désormais partie des agences les plus dynamiques et ambitieuses de la région 🏆",
    "",
    "Votre abonnement est activé dès maintenant ✅",
    "Voici un aperçu des avantages exclusifs réservés à votre agence :",
    "• 👥 Portraits pro pour toute l’équipe et chaque agent",
    "• ⚡ Priorité maximale sur tous les shootings",
    "• 🚀 Livraison express 24h garantie pour toute l’agence",
    "• 🎨 Charte graphique personnalisée (logo, couleurs, style visuel)",
    "• 🏡 Galerie immobilière dédiée à votre agence",
    "• 🎓 Formations express offertes (cadrage, retouche, communication…)",
    "",
    "👉 Dans un prochain mail, vous recevrez votre code coupon exclusif, à partager avec votre équipe pour profiter de vos réductions.",
    "",
    "Merci pour votre confiance et bienvenue dans l’aventure MEDIA IMMO PRO !",
    "Ensemble, faisons briller vos biens et votre image ✨",
    "",
    "À très bientôt,",
    "L’équipe MEDIA IMMO",
    "📞 +33 7 67 57 92 28",
    "🌐 https://www.forfaitsmediaimmobilier.com/",
    "📸 Instagram : @mediaimmo",
  ].join("\n")

  const html = `
    <div style="font-family: system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif; line-height:1.6;">
      <p style="margin:0 0 8px;">Bonjour,</p>
      <p style="margin:0 0 8px;">Bienvenue à bord et félicitations pour votre abonnement au plan <strong>Agence MEDIA IMMO</strong> ! 🎉</p>
      <p style="margin:0 0 8px;">Votre équipe fait désormais partie des agences les plus dynamiques et ambitieuses de la région 🏆</p>
      <p style="margin:0 0 8px;">Votre abonnement est activé dès maintenant ✅</p>
      <p style="margin:0 0 8px;">Voici un aperçu des avantages exclusifs réservés à votre agence :</p>
      <ul style="margin:0 0 8px; padding-left: 18px;">
        <li>👥 Portraits pro pour toute l’équipe et chaque agent</li>
        <li>⚡ Priorité maximale sur tous les shootings</li>
        <li>🚀 Livraison express 24h garantie pour toute l’agence</li>
        <li>🎨 Charte graphique personnalisée (logo, couleurs, style visuel)</li>
        <li>🏡 Galerie immobilière dédiée à votre agence</li>
        <li>🎓 Formations express offertes (cadrage, retouche, communication…)</li>
      </ul>
      <p style="margin:0 0 8px;">👉 Dans un prochain mail, vous recevrez votre code coupon exclusif, à partager avec votre équipe pour profiter de vos réductions.</p>
      <p style="margin:0 0 8px;">Merci pour votre confiance et bienvenue dans l’aventure MEDIA IMMO PRO !</p>
      <p style="margin:0 0 8px;">Ensemble, faisons briller vos biens et votre image ✨</p>
      <p style="margin:0 0 8px;">À très bientôt,<br/>L’équipe MEDIA IMMO</p>
      <p style="margin:0 0 8px;">📞 +33 7 67 57 92 28<br/>🌐 https://www.forfaitsmediaimmobilier.com/<br/>📸 Instagram : @mediaimmo</p>
    </div>
  `
  return { subject, text, html }
}
