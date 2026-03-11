// app/articles/layout.tsx
import React from "react";
import RightSidebar from "@/components/RightSidebar/RightSidebar";

interface ArticlesLayoutProps {
  children: React.ReactNode; // dynamic content (page.tsx)
}

export default function ArticlesLayout({ children }: ArticlesLayoutProps) {
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 grid lg:grid-cols-12 gap-8">
        {/* Main content */}
        <main className="lg:col-span-9">{children}</main>

        {/* Sidebar stays mounted */}
        <aside className="lg:col-span-3">
          <RightSidebar />
        </aside>
      </div>
    </section>
  );
}