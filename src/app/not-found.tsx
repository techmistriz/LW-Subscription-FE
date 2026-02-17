import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-black transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
