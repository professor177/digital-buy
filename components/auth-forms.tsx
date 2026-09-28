"use client";
import { useActionState } from "react";
import { signUpAction, loginAction, forgotPasswordAction, updatePasswordAction, adminLoginAction } from "@/lib/actions/auth-actions";
import { SubmitButton } from "@/components/submit-button";
import { ActionFeedback, type ActionState } from "@/components/action-feedback";

const initial: ActionState = {};
function ErrorText({ items }: { items?: string[] }) { return items?.[0] ? <p className="mt-1 text-xs text-red-300">{items[0]}</p> : null; }

export function SignUpForm() {
  const [state, action] = useActionState(signUpAction, initial);
  return <form action={action} className="space-y-4"><ActionFeedback state={state}/><div><label className="label" htmlFor="name">Name</label><input className="input" id="name" name="name" autoComplete="name" required maxLength={100}/><ErrorText items={state.fieldErrors?.name}/></div><div><label className="label" htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required/><ErrorText items={state.fieldErrors?.email}/></div><div><label className="label" htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required/><ErrorText items={state.fieldErrors?.password}/></div><SubmitButton pendingText="Creating account...">Create account</SubmitButton></form>;
}
export function LoginForm({ next = "/" }: { next?: string }) {
  const [state, action] = useActionState(loginAction, initial);
  return <form action={action} className="space-y-4"><ActionFeedback state={state}/><input type="hidden" name="next" value={next}/><div><label className="label" htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required/></div><div><label className="label" htmlFor="password">Password</label><input className="input" id="password" name="password" type="password" autoComplete="current-password" required/></div><SubmitButton pendingText="Signing in...">Login</SubmitButton></form>;
}
export function AdminLoginForm() {
  const [state, action] = useActionState(adminLoginAction, initial);
  return <form action={action} className="space-y-4"><ActionFeedback state={state}/><div><label className="label" htmlFor="admin-email">Admin email</label><input className="input" id="admin-email" name="email" type="email" autoComplete="username" required/></div><div><label className="label" htmlFor="admin-password">Password</label><input className="input" id="admin-password" name="password" type="password" autoComplete="current-password" required/></div><SubmitButton pendingText="Checking access...">Admin login</SubmitButton></form>;
}
export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, initial);
  return <form action={action} className="space-y-4"><ActionFeedback state={state}/><div><label className="label" htmlFor="email">Email</label><input className="input" id="email" name="email" type="email" autoComplete="email" required/></div><SubmitButton pendingText="Sending...">Send reset email</SubmitButton></form>;
}
export function UpdatePasswordForm() {
  const [state, action] = useActionState(updatePasswordAction, initial);
  return <form action={action} className="space-y-4"><ActionFeedback state={state}/><div><label className="label" htmlFor="password">New password</label><input className="input" id="password" name="password" type="password" autoComplete="new-password" minLength={8} required/></div><div><label className="label" htmlFor="confirmPassword">Confirm password</label><input className="input" id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required/></div><SubmitButton pendingText="Updating...">Update password</SubmitButton></form>;
}
