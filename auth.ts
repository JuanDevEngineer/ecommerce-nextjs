/* eslint-disable @typescript-eslint/no-explicit-any */

import NexthAuth from 'next-auth'
import type { NextAuthConfig } from 'next-auth'
import { cookies } from 'next/headers'

import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { compareSync } from 'bcrypt-ts-edge'

import { prisma } from '@/db/prisma'
import { authConfig } from './auth.config'

export const config = {
  pages: {
    signIn: '/sign-in',
    error: '/sign-in',
    newUser: '/sign-up',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials == null) return null

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        })

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          )

          if (isMatch) {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }
          }
        }
        return null
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, trigger, token }: any) {
      session.user.id = token.sub
      session.user.name = token.name
      session.user.role = token.role

      if (trigger == 'update' && token.name) {
        session.user.name = token.name
      }

      return session
    },
    async jwt({ token, user, trigger, session }: any) {
      // Assign user fields to token
      if (user) {
        token.id = user.id
        token.role = user.role
        // If user has no name, use email as their default name
        if (user.name === 'NO_NAME') {
          token.name = user.email!.split('@')[0]

          // Update the user in the database with the new name
          await prisma.user.update({
            where: { id: user.id },
            data: { name: token.name },
          })
        }

        if (trigger === 'signIn' || trigger === 'signUp') {
          const cookiesObject = await cookies()
          const sessionCartId = cookiesObject.get('sessionCartId')?.value
  
          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId },
            })
  
            if (sessionCart) {
              // Overwrite any existing user cart
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              })
  
              // Assign the guest cart to the logged-in user
              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: { userId: user.id },
              })
            }
          }
        }
      }

      // Handle session updates (e.g., name change)
      if (session?.user.name && trigger === 'update') {
        token.name = session.user.name;
      }

      return token
    },
  },
} satisfies NextAuthConfig

export const { auth, handlers, signIn, signOut } = NexthAuth(config)
