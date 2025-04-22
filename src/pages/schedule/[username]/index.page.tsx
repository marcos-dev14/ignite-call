import type { GetStaticPaths, GetStaticProps } from "next"
import { Avatar, Heading, Text } from "@ignite-ui/react"

import { prisma } from "@/src/lib/prisma"

import { Container, UserHeader } from "./styles"
import { ScheduleForm } from "./scheduleForm"

interface ScheduleProps {
  user: {
    name: string
    bio: string
    avatarUrl: string
  }
}

export default function Schedule({ user }: ScheduleProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatarUrl} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  )
}


// Retornando o paths com array vazio, para ele não gerar as páginas dinâmicas e gerar somente quando essa página ela for acessada
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const username = String(params?.username)

  const user = await prisma.user.findUnique({
    where: {
      username,
    }
  })

  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user: {
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatar_url
      }
    },
    revalidate: 60 * 60 * 24, // 1 day 
  }
}