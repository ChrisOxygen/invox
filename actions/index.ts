"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { signUpFormSchema } from "@/formSchemas";
import { z } from "zod";
import { auth } from "@/auth";

const prisma = new PrismaClient();

interface SignUpResult {
  success: boolean;
  message: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function createUser(
  values: z.infer<typeof signUpFormSchema>
): Promise<SignUpResult> {
  try {
    // Validate the input data
    const validatedFields = signUpFormSchema.safeParse(values);

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs.",
      };
    }

    const { name, email, password } = validatedFields.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "An account with this email already exists.",
      };
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      success: true,
      message: "Account created successfully!",
      user: {
        id: newUser.id,
        name: newUser.name || "",
        email: newUser.email || "",
      },
    };
  } catch (error) {
    console.error("Error creating user:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUser(): Promise<SignUpResult> {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return {
        success: false,
        message: "User not authenticated.",
      };
    }
    const id = session.user.id;
    if (!id) {
      return {
        success: false,
        message: "User ID not found in session.",
      };
    }
    // Retrieve the user from the database
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    return {
      success: true,
      message: "User retrieved successfully!",
      user: {
        id: user.id,
        name: user.name || "",
        email: user.email || "",
      },
    };
  } catch (error) {
    console.error("Error retrieving user:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  } finally {
    await prisma.$disconnect();
  }
}
