# Migration `20201003122830-company-name-uniq`

This migration has been generated at 10/3/2020, 9:28:30 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE UNIQUE INDEX "Company.name_unique" ON "Company"("name")
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201003121542-start..20201003122830-company-name-uniq
--- datamodel.dml
+++ datamodel.dml
@@ -1,16 +1,16 @@
 datasource db {
     provider = "sqlite"
-    url = "***"
+    url = "***"
 }
 generator client {
     provider = "prisma-client-js"
 }
 model Company {
     id        String   @id @default(uuid())
-    name      String
+    name      String   @unique
     createdAt DateTime @default(now())
     users     User[]
 }
```


