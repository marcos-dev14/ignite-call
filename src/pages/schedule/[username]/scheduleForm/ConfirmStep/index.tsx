import { Button, Text, TextArea, TextInput } from "@ignite-ui/react"
import { CalendarBlank, Clock } from "phosphor-react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { ConfirmForm, FormActions, FormError, FormHeader } from "./styled"
import { useForm } from "react-hook-form"

const confirmaFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome precisa no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  observations: z.string().nullable()
})

type ConfirmFormData = z.infer<typeof confirmaFormSchema>

export function ConfirmStep() {
  const {
    register,
    handleSubmit,
    formState: {
      isSubmitting,
      errors
    }
  } = useForm<ConfirmFormData>({
    resolver: zodResolver(confirmaFormSchema)
  })

  async function handleConfirmScheduling(data: ConfirmFormData) {
    console.log(data)
  }

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          23 de abril de 2022
        </Text>

        <Text>
          <Clock />
          18:00h
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Nome completo</Text>
        <TextInput placeholder="Seu nome" {...register('name')} />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Endereço de e-mail</Text>
        <TextInput type="email" placeholder="johndoe@exemple.com"  {...register('email')}/>
        {errors.email && <FormError size="sm">{errors.email.message}</FormError>}
      </label>

      <label>
        <Text size="sm">Observação</Text>
        <TextArea {...register('observations')} />
      </label>

      <FormActions>
        <Button 
          type="button"
          variant="tertiary"
        >
          Cancelar
        </Button>

        <Button 
          type="submit"
          disabled={isSubmitting}
        >
          Confirmar
        </Button>
      </FormActions>
    </ConfirmForm>
  )
}