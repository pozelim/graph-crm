# Migration `20201003121542-start`

This migration has been generated at 10/3/2020, 9:15:42 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY ("id")
)

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE,
PRIMARY KEY ("id")
)

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20201003121542-start
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,24 @@
+datasource db {
+    provider = "sqlite"
+    url = "***"
+}
+
+generator client {
+    provider = "prisma-client-js"
+}
+
+model Company {
+    id        String   @id @default(uuid())
+    name      String
+    createdAt DateTime @default(now())
+    users     User[]
+}
+
+model User {
+    id        String   @id @default(uuid())
+    email     String   @unique
+    name      String
+    createdAt DateTime @default(now())
+    companyId String
+    company   Company  @relation(fields: [companyId], references: [id])
+}
```


