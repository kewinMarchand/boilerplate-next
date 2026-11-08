'use client'

import { Alert, Button, TextArea, TextField } from '@kewinmarchand/boilerplates-ui/react'

import styles from './ContactForm.module.css'
import { useContactForm } from './hooks/useContactForm'

import type { Contact } from '../domain/contactSchema'

interface ContactFormProps {
  /** Demande de renseignement : le produit part avec le message. */
  product: Contact.InquiryProduct | null
}

export const ContactForm = ({ product }: ContactFormProps) => {
  const { form, mutation, onSubmit } = useContactForm(product?.slug ?? null)
  const { errors } = form.formState

  return (
    <form noValidate onSubmit={onSubmit} className={`bui-stack ${styles.form}`}>
      {product && <input type="hidden" name="product" value={product.slug} />}
      <TextField
        id="contact-nom"
        label="Nom"
        autoComplete="name"
        required
        error={errors.name?.message ?? ''}
        data-testid="contact-name"
        {...form.register('name')}
      />
      <TextField
        id="contact-email"
        label="E-mail"
        type="email"
        autoComplete="email"
        required
        error={errors.email?.message ?? ''}
        data-testid="contact-email"
        {...form.register('email')}
      />
      <TextArea
        id="contact-message"
        label="Message"
        required
        error={errors.message?.message ?? ''}
        data-testid="contact-message"
        {...form.register('message')}
      />
      <Button type="submit" icon="mail" loading={mutation.isPending} data-testid="contact-submit">
        Envoyer
      </Button>
      <div aria-live="polite">
        {mutation.data?.status === 'sent' && (
          <div data-testid="contact-success">
            <Alert variant="success">
              {product
                ? 'Votre demande de renseignement a bien été envoyée.'
                : 'Merci, votre message a bien été envoyé.'}
            </Alert>
          </div>
        )}
        {errors.root && (
          <div data-testid="contact-error">
            <Alert variant="error">{errors.root.message}</Alert>
          </div>
        )}
        {mutation.isError && (
          <div data-testid="contact-error">
            <Alert variant="error">L'envoi a échoué. Réessayez dans quelques instants.</Alert>
          </div>
        )}
      </div>
    </form>
  )
}
