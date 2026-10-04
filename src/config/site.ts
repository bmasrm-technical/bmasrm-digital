export interface PlanConfig {
  title: string;
  subtitle: string;
  idea: string;
  process: string;
  included: string;
  afterSupport: string;
  priceText: string;
  managedMonthlyFrom?: string;
  buttonText: string;
  buttonHref: string;
}

export const siteConfig = {
  brand: {
    name: "BMASRM.digital",
    tagline: "Build. Move. Reach. Scale.",
    description:
      "BMASRM.digital is a premium digital studio that builds high-class websites and professional video experiences for ambitious businesses and luxury-oriented brands.",
  },
  contact: {
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
    whatsappUrl: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`
      : "",
    instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
    emailUrl: process.env.NEXT_PUBLIC_CONTACT_EMAIL
      ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`
      : "",
  },
  plans: {
    signatureBuild: {
      title: "Signature Build",
      subtitle: "One-time custom creation",
      idea: "You get the finished website.",
      process: "Requirements, Design, Development, Testing, Deployment, Handover",
      included:
        "Design, development, deployment, domain connection, basic configuration, handover and a walkthrough of how to upload and where to see things, 2 months of general support",
      afterSupport:
        "After the 2 months, no help with extra setup or adding offers (new work is a new request)",
      priceText: "Depends on requirements",
      buttonText: "Request Signature Build",
      buttonHref: "/contact?service=website&plan=signature_build",
    } as PlanConfig,
    managedWebsite: {
      title: "Managed Website",
      subtitle: "Monthly care & ongoing evolution",
      idea: "We keep running and improving it for you.",
      process: "Hosting, management, updates, maintenance",
      included:
        "Hosting, maintenance, up to 3 offers or content changes per month, traffic and performance monitoring, general technical management",
      afterSupport: "Continues every month while subscribed",
      priceText: "Monthly; depends on requirements",
      managedMonthlyFrom: "", // empty by default; render price line only if set
      buttonText: "Request Managed Website",
      buttonHref: "/contact?service=website&plan=managed_website",
    } as PlanConfig,
  },
  video: {
    minDurationMinutes: 5,
    minDurationNote:
      "We edit videos of 5 minutes or longer. We do not take short-form content or reels.",
  },
};
