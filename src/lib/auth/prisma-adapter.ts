import { Adapter } from "next-auth/adapters"
import { prisma } from "../prisma"
import { parseCookies, destroyCookie } from "nookies"
import { NextApiRequest, NextApiResponse } from "next"

export function PrismaAdapter(
  req: NextApiRequest,
  res: NextApiResponse,
): Adapter {
  return {
    async createUser(user) {
      const { '@ignitecall:userId': userIdOnCookies } = parseCookies({ req })

      if(!userIdOnCookies) {
        throw new Error('User ID not found on cookies.')
      }

      const prismaUser = await prisma.user.update({
        where: {
          id: userIdOnCookies
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url
        }
      })

      destroyCookie({ res }, '@ignitecall:userId', {
        path: '/',
      })

      return {
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },
    
    async getUser(id) {
      const user = await prisma.user.findUnique({
        where: {
          id
        }
      })

      if (!user) return null

      return { 
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email
        }
      })

      if (!user) return null

      return { 
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email!,
        emailVerified: null,
        avatar_url: user.avatar_url!,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await prisma.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId
          }
        },
        include: {
          user: true,
        }
      })

      if (!account) return null

      return { 
        id: account.user.id,
        name: account.user.name,
        username: account.user.username,
        email: account.user.email!,
        emailVerified: null,
        avatar_url: account.user.avatar_url!,
      }
    },

    async updateUser(user) {
      const prismaUser = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          name: user.name,
          email: user.email,
          avatar_url: user.avatar_url
        }
      })

      return { 
        id: prismaUser.id,
        name: prismaUser.name,
        username: prismaUser.username,
        email: prismaUser.email!,
        emailVerified: null,
        avatar_url: prismaUser.avatar_url!,
      }
    },

    async linkAccount(account) {
      await prisma.account.create({
        data: {
          user_id: account.userId,
          type: account.type,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state
        }
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      await prisma.session.create({
        data: {
          user_id: userId,
          expires,
          session_token: sessionToken
        },
      })

      return {
        userId,
        sessionToken,
        expires
      }
    },

    async getSessionAndUser(sessionToken) {
      const sessionAndUser = await prisma.session.findUnique({
        where: {
          session_token: sessionToken
        },
        include: {
          user: true,
        }
      })

      if (!sessionAndUser) return null

      return {
        session: {
          userId: sessionAndUser.user_id,
          expires: sessionAndUser.expires,
          sessionToken: sessionAndUser.session_token
        },
        user: {
          id: sessionAndUser.user.id,
          name: sessionAndUser.user.name,
          username: sessionAndUser.user.username,
          email: sessionAndUser.user.email!,
          emailVerified: null,
          avatar_url: sessionAndUser.user.avatar_url!,
        }
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const prismaSession = await prisma.session.update({
        where: {
          session_token: sessionToken
        },
        data: {
          expires,
          user_id: userId
        }
      })

      return {
        sessionToken: prismaSession.session_token,
        userId: prismaSession.user_id,
        expires: prismaSession.expires,
      }
    },

    async deleteSession(sessionToken) {
      await prisma.session.delete({
        where: {
          session_token: sessionToken
        }
      })
    }
  }
}