import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-xl text-center">
        {/* Icon / Shape */}
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-4xl">🤔</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Page not found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you’re looking for doesn’t exist or may have been moved.
          Let’s get you back on track.
        </p>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition"
          >
            Go to homepage
          </Link>

          <Link
            href="/"
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-100 transition"
          >
            Redirect Home Page
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-10 text-sm text-gray-400">
          © {new Date().getFullYear()} OntoEdge
        </p>
      </div>
    </section>
  );
}
