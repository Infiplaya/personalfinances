import Link from "next/link";

export function Sidebar() {
  return (
    <aside
      id="default-sidebar"
      className="fixed hidden lg:block left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full px-4 py-4 overflow-y-auto bg-white dark:bg-black">
        <ul className="py-4 space-y-4">
          <li>
            <Link
              href="/"
              className="hover:bg-gray-100 px-3 py-1 pl-6 w-full block rounded-md dark:hover:bg-white/10"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              className="hover:bg-gray-100 px-3 py-1 pl-6 w-full block rounded-md dark:hover:bg-white/10"
              href="/transactions"
            >
              Transactions
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
