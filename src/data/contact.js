const contactConfig = [
  {
    id: 'line',
    label: 'LINE',
    icon: 'simple-icons:line',
    href: import.meta.env.VITE_CONTACT_LINE_URL,
    value: import.meta.env.VITE_CONTACT_LINE_LABEL,
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'solar:letter-linear',
    href: import.meta.env.VITE_CONTACT_EMAIL ? `mailto:${import.meta.env.VITE_CONTACT_EMAIL}` : '',
    value: import.meta.env.VITE_CONTACT_EMAIL,
    external: false,
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: 'simple-icons:instagram',
    href: import.meta.env.VITE_CONTACT_INSTAGRAM_URL,
    value: import.meta.env.VITE_CONTACT_INSTAGRAM_LABEL,
    external: true,
  },
]

export const contactMethods = contactConfig.filter((method) => method.href && method.value)
