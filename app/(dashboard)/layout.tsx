import type { Metadata } from "next";
import Navbar from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Personal Finances App",
  description: "Generated by Personal Finances App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="container mx-auto lg:pl-52">{children}</div>
    </>
  );
}
