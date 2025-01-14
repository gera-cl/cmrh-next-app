import { eq } from "drizzle-orm";

import { db } from "../db";
import { InsertCredential, SelectUser, credentialsTable } from "../schema";

export async function createCredential(data: InsertCredential) {
  return await db.insert(credentialsTable).values(data).returning();
}

export async function getCredentialsByUserId(userId: SelectUser["id"]) {
  return db
    .select()
    .from(credentialsTable)
    .where(eq(credentialsTable.userId, userId));
}
