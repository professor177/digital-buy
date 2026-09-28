import fs from "node:fs";
const root = new URL("../", import.meta.url);
const required=["app/page.tsx","app/icon.svg","app/privacy/page.tsx","app/terms/page.tsx","app/not-found.tsx","app/orders/page.tsx","app/admin/login/page.tsx","supabase/migrations/001_initial.sql","supabase/migrations/002_admin_workflows.sql",".env.example"];
const missing=required.filter(x=>!fs.existsSync(new URL(x,root)));
if(missing.length){console.error("Missing required files:",missing);process.exit(1)}
const env=fs.readFileSync(new URL(".env.example",root),"utf8");
for(const key of ["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY","SUPABASE_SECRET_KEY","CREDENTIAL_ENCRYPTION_KEY","LAUNCH_READY"]){if(!env.includes(key)){console.error("Missing env name",key);process.exit(1)}}
console.log("Digital Buy static smoke checks passed.");
