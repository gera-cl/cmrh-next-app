import { eq } from "drizzle-orm";

import { db } from "../db";
import { InsertCredential, SelectCredential, SelectUser, credentialsTable } from "../schema";

export async function createCredential(data: InsertCredential) {
  return await db.insert(credentialsTable).values(data).returning();
}

export async function getCredentialsByUserId(userId: SelectUser["id"]) {
  return db
    .select()
    .from(credentialsTable)
    .where(eq(credentialsTable.userId, userId));
}

export async function getCredentialById(id: SelectCredential["id"]) {
  return db
    .select()
    .from(credentialsTable)
    .where(eq(credentialsTable.id, id));
}

export async function updateCredential(id: SelectCredential["id"], data: Partial<InsertCredential>) {
  return await db
    .update(credentialsTable)
    .set(data)
    .where(eq(credentialsTable.id, id))
    .returning();
}

export async function deleteCredential(id: SelectCredential["id"]) {
  return await db
    .delete(credentialsTable)
    .where(eq(credentialsTable.id, id))
    .returning();
}