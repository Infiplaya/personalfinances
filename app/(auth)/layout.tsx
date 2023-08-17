import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="container mx-auto h-full">{children}</div>;
}
