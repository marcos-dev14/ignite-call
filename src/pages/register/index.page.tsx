import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react"
import { ArrowRight } from "phosphor-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Container, Form, Header, FormError } from "./styles"
import { useRouter } from "next/router"
import { useEffect } from "react"

const registerFormSchema = z.object({
  username: z.string()
  .min(3, { message: 'O usuário precisa ter pelo menos 3 letras' })
  .regex(/^([a-z\\-]+)$/i, { message: 'O usuário pode ter apenas letras e hifens.' })
  .transform(username => username.toLowerCase()),

  name: z.string()
    .min(3, { message: 'O nome precisa ter pelo menos 3 letras.'})
})

type RegisterFormData = z.infer<typeof registerFormSchema>

export default function Register() {
  const router = useRouter()

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
  })


  async function handleRegister(data: RegisterFormData) {
    console.log(data)
  }

  useEffect(() => {
    if(router.query.username) {
      setValue('username', String(router.query.username))
    }
  }, [router.query?.username, setValue])

  return (
    <Container>
      <Header>
        <Heading>
          Bem-vindo ao Ignite Call!
        </Heading>

        <Text>
          Precisamos de algumas informações para criar seu perfil! Ah,
          você pode editar essa informações depois.
        </Text>

        <MultiStep 
          size={4}
          currentStep={1}
        />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Nome do usuário</Text>
          
          <TextInput 
            prefix="ignite.com/" 
            placeholder="seu-usuário" 
            {...register('username')}  
          />

          {errors.username && 
            <FormError size="sm">{errors.username.message}</FormError>
          }
        </label>

        <label>
          <Text size="sm">Nome completo</Text>
          
          <TextInput 
            placeholder="Seu nome"
            {...register('name')}  
          />

          {errors.name && 
            <FormError size="sm">{errors.name.message}</FormError>
          }
        </label>

        <Button type="submit" disable={isSubmitting}>
          Próximo passo

          <ArrowRight />
        </Button>
      </Form>
    </Container>
  )
}