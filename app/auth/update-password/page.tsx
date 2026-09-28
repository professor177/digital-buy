import { requireUser } from "@/lib/auth";
import { UpdatePasswordForm } from "@/components/auth-forms";
export default async function UpdatePasswordPage(){await requireUser();return <div className="container py-20"><div className="surface mx-auto max-w-md p-6 sm:p-8"><p className="eyebrow">Account recovery</p><h1 className="mt-3 text-3xl font-black">Set a new password</h1><div className="mt-6"><UpdatePasswordForm/></div></div></div>}
