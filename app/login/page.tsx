import AuthForms from "@/components/AuthForms";
export const metadata = { title: "Login" };
export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <main><h1>Login</h1><AuthForms next={(await searchParams).next || "/orders"} /></main>;
}
