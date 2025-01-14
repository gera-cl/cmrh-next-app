import { eq } from "drizzle-orm";

import { db } from "../db";
import { InsertUser, SelectUser, usersTable } from "../schema";

export async function createUser(data: InsertUser) {
  return await db.insert(usersTable).values(data).returning();
}

export async function getUserByEmail(
  email: SelectUser["email"],
): Promise<Array<SelectUser>> {
  return db.select().from(usersTable).where(eq(usersTable.email, email));
}
