import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
// import GitHubProvider from "next-auth/providers/github";
// import { generateVerificationCode } from "./lib/actions";
// import { sendWelcomeEmail } from "./lib/email-actions";

const prisma = new PrismaClient();

// Define the extended user type returned by authorize
interface ExtendedUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes in seconds
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // If user doesn't exist
        if (!user) {
          return null;
        }

        // Skip password check for social auth users
        if (user.hashedPassword) {
          // Check password for credential-based users
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.hashedPassword as string
          );

          if (!isPasswordValid) {
            return null;
          }
        }

        // Return the user object that will be stored in the token
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          emailVerified: user.emailVerified || false,
          image: user.image,
          // hasCreatedProfile: user.hasCreatedProfile,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only process social provider logins (Google, GitHub)
      if (!account || account.provider === "credentials" || !user.email) {
        // For credential-based login, use default behavior
        return true;
      }

      try {
        // STEP 1: Check if a user with this email already exists
        const existingUser = await prisma.user.findUnique({
          where: {
            email: user.email,
          },
          include: {
            accounts: true,
          },
        });

        // STEP 2: Handle existing user case
        if (existingUser) {
          // Check if this specific provider is already linked to this user
          const linkedAccount = existingUser.accounts.find(
            (acc) => acc.provider === account.provider
          );

          // If this provider isn't linked yet, create the link
          if (!linkedAccount) {
            console.log(
              `Linking new provider (${account.provider}) to existing user`
            );

            // Create a new account connection for this provider
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token || null,
                refresh_token: account.refresh_token || null,
                expires_at: account.expires_at || null,
                token_type: account.token_type || null,
                scope: account.scope || null,
                id_token: account.id_token || null,
                session_state: account.session_state
                  ? String(account.session_state)
                  : null,
              },
            });
          }

          // Use the existing user's ID for this session
          user.id = existingUser.id;
          return true;
        }

        // STEP 3: Handle new user case
        else {
          console.log("Creating new user from social auth");

          // Create user directly with Prisma instead of using helper function
          // This ensures atomic transaction and prevents orphaned accounts
          const newUser = await prisma.user.create({
            data: {
              name: user.name || `User-${Date.now().toString().slice(-4)}`,
              email: user.email,
              image: user.image || null,
              emailVerified: false,

              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token || null,
                  refresh_token: account.refresh_token || null,
                  expires_at: account.expires_at || null,
                  token_type: account.token_type || null,
                  scope: account.scope || null,
                  id_token: account.id_token || null,
                  session_state: account.session_state
                    ? String(account.session_state)
                    : null,
                },
              },
            },
            include: {
              accounts: true,
            },
          });

          console.log("New user created:", newUser.id);

          // Set the user ID for the session
          user.id = newUser.id;

          // Optionally send welcome email (non-blocking)
          // await sendWelcomeEmail(newUser.fullName || "there", newUser.email);

          // await generateVerificationCode(newUser.id);

          return true;
        }
      } catch (error) {
        console.error("Fatal error during social authentication:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Cast user to ExtendedUser type
        const typedUser = user as ExtendedUser;

        return {
          ...token,
          id: typedUser.id,
          emailVerified: typedUser.emailVerified,
        };
      }

      // For social auth users, make sure we have the latest profile data
      if (token.email) {
        const currentUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });

        if (currentUser) {
          token.id = currentUser.id;
          token.emailVerified = currentUser.emailVerified || false;
          token.name = currentUser.name;
          token.picture = currentUser.image;
        }
      }

      // Return previous token if the user data hasn't changed
      return token;
    },

    async session({ session, token }) {
      // Add user ID and emailVerified to the session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified;
        // session.user.hasCreatedProfile = token.hasCreatedProfile as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  events: {
    async createUser(message) {
      // This event is triggered when a new user is created
      // You can add additional setup logic here if needed
      console.log("New user created:", message.user.id);
    },
    async linkAccount({ user, account, profile }) {
      console.log("linkAccount callback:", { user, account, profile });
      // This event is triggered when a new account is linked to a user
      console.log(`Account linked: ${account.provider} for user ${user.id}`);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
