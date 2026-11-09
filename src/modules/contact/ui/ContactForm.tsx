'use client'

import { Alert, Button, TextArea, TextField } from '@kewinmarchand/boilerplates-ui/react'

import { useDictionary } from '@/shared/i18n'

import styles from './ContactForm.module.css'
import { useContactForm } from './hooks/useContactForm'

import type { Contact } from '../domain/contactSchema'

interface ContactFormProps {
  /** Demande de renseignement : le produit part avec le message. */
  product: Contact.InquiryProduct | null
}

export const ContactForm = ({ product }: ContactFormProps) => {
  const { contact: t, ui } = useDictionary()
  const { form, mutation, onSubmit } = useContactForm(product?.slug ?? null)
  const { errors } = form.formState

  return (
    <form noValidate onSubmit={onSubmit} className={`bui-stack ${styles.form}`}>
      {product && <input type="hidden" name="product" value={product.slug} />}
      <TextField
        id="contact-nom"
        label={t.name}
        autoComplete="name"
        required
        requiredLabel={ui.required}
        error={errors.name?.message ?? ''}
        data-testid="contact-name"
        {...form.register('name')}
      />
      <TextField
        id="contact-email"
        label={t.email}
        type="email"
        autoComplete="email"
        required
        requiredLabel={ui.required}
        error={errors.email?.message ?? ''}
        data-testid="contact-email"
        {...form.register('email')}
      />
      <TextArea
        id="contact-message"
        label={t.message}
        required
        requiredLabel={ui.required}
        error={errors.message?.message ?? ''}
        data-testid="contact-message"
        {...form.register('message')}
      />
      <Button
        type="submit"
        icon="mail"
        loading={mutation.isPending}
        loadingLabel={ui.loading}
        data-testid="contact-submit"
      >
        {t.send}
      </Button>
      <div aria-live="polite">
        {mutation.data?.status === 'sent' && (
          <div data-testid="contact-success">
            <Alert variant="success" prefix={ui.alert.success}>
              {product ? t.inquirySent : t.sent}
            </Alert>
          </div>
        )}
        {errors.root && (
          <div data-testid="contact-error">
            <Alert variant="error" prefix={ui.alert.error}>
              {errors.root.message}
            </Alert>
          </div>
        )}
        {mutation.isError && (
          <div data-testid="contact-error">
            <Alert variant="error" prefix={ui.alert.error}>
              {t.sendError}
            </Alert>
          </div>
        )}
      </div>
    </form>
  )
}
