import { Button, Heading, MultiStep, Text } from "@ignite-ui/react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { ArrowRight, Check } from "phosphor-react"

import { Container, Header } from "../styles"
import { AuthError, ConnectBox, ConnectItem } from "./styles"

export default function ConnectCalendar() {
  const session = useSession()
  const router = useRouter()
  
  const hasAuthErro = !!router.query.error
  const isSignedIn = session.status === 'authenticated'

  console.log(session)


  async function handleConnectCalendar() {
    await signIn('google')
  }


  return (
    <Container>
      <Header>
        <Heading>
          Conecte sua agenda!
        </Heading>

        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendadas.
        </Text>

        <MultiStep 
          size={4}
          currentStep={2}
        />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>
            Google Calendar
          </Text>

          {isSignedIn ? (
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar 
              <ArrowRight />
            </Button>
          )}

        </ConnectItem>

        {hasAuthErro && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as 
            permissões de acesso ao Google Calendar
          </AuthError>
        )}

        <Button type="submit" disabled={!isSignedIn}>
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  )
}