import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'

import { useDictionary, useLocale } from '@/shared/i18n'

import { createContactSchema } from '@/modules/contact/domain/contactSchema'
import { sendContactMessage } from '@/modules/contact/infrastructure/sendContactMessage'

import type { Contact } from '@/modules/contact/domain/contactSchema'

const DEFAULT_VALUES: Contact.FormValues = { name: '', email: '', message: '' }

/** `productSlug` : demande de renseignement sur ce produit, envoyé avec le message. */
export const useContactForm = (productSlug: string | null) => {
  const { locale } = useLocale()
  const messages = useDictionary().contact.validation
  const schema = useMemo(() => createContactSchema(messages), [messages])
  const form = useForm<Contact.FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  })

  const mutation = useMutation({
    mutationFn: sendContactMessage,
    onSuccess: (result) => {
      if (result.status === 'sent') return form.reset(DEFAULT_VALUES)
      for (const { field, message } of result.fieldErrors) {
        form.setError(field === 'product' ? 'root' : field, { message })
      }
    },
  })

  const onSubmit = form.handleSubmit((values) =>
    mutation.mutate({ message: { ...values, product: productSlug }, locale }),
  )

  return { form, mutation, onSubmit }
}
