import { type PropsWithChildren } from "beth-stack/jsx";

export const Dashboard = ({ children }: PropsWithChildren) => (
  <div class="flex h-screen w-full flex-col md:flex-row">
    <nav class="flex h-full min-w-[18rem] flex-col border-r border-gray-700 bg-gray-800 p-5 text-gray-100 lg:w-64">
      <h1 class="mb-4 text-4xl">Your Journal</h1>
      <ul class="flex-grow space-y-6">
        <DashboardItem text="Teas" icon="i-lucide-leaf" href="/teas" />
        <DashboardItem
          text="Sign Out"
          icon="i-lucide-log-out"
          href="/api/auth/signout"
        />
      </ul>
      <div class="text-2xl font-bold">TeeJ</div>
    </nav>
    <div class="relative h-full w-full p-[1%]">
      <div id="modals" class="relative"></div>
      {children}
    </div>
  </div>
);

function DashboardItem({
  text,
  icon,
  href,
  newTab,
}: {
  text: string;
  icon: string;
  href: string;
  newTab?: boolean;
}) {
  return (
    <li>
      <a
        class="flex items-center gap-3 py-2 text-2xl font-light hover:underline"
        href={href}
        target={newTab ? "_blank" : ""}
      >
        <div class={icon} />
        <span>{text}</span>
      </a>
    </li>
  );
}
