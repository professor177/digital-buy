import Link from "next/link";
export default function NotFound() { return <div className="container py-28 text-center"><p className="eyebrow">404</p><h1 className="title-xl mt-4">Page not found.</h1><p className="muted mx-auto mt-5 max-w-lg">The page may have moved, or the product is no longer published.</p><Link className="btn btn-primary mt-8" href="/">Return to store</Link></div>; }
