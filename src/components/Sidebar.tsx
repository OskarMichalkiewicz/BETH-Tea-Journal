import { type PropsWithChildren } from "beth-stack/jsx";

export const Sidebar = ({ children }: PropsWithChildren) => (
  <div class="flex h-full w-full">
    <aside class="min-w-46 flex w-2/6 max-w-64 border-r border-slate-700 bg-slate-800 text-slate-200">
      <nav class="flex h-full w-full flex-col overflow-y-auto px-5 py-6">
        <h1 class="mb-4 text-2xl">Your Journal</h1>
        <ul class="flex-grow space-y-2 text-xl font-medium">
          <CollapsableSidebarItem
            text="Teas"
            icon="i-lucide-leaf"
            collapseItems={{ Yellow: "/teas", Black: "/teas" }}
          />
          <SidebarItem
            text="Sign Out"
            icon="i-lucide-log-out"
            href="/api/auth/signout"
          />
        </ul>
        <div class="inline-block bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-xl font-bold text-transparent">
          TeeJ
        </div>
      </nav>
    </aside>
    <div class="relative h-full w-full p-6">
      <div id="modals" class="relative"></div>
      <div id="content">{children}</div>
    </div>
  </div>
);

function SidebarItem({
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
        class="group flex items-center rounded-lg px-2 py-1 text-xl hover:bg-slate-300 hover:text-slate-900 "
        href={href}
        target={newTab ? "_blank" : ""}
      >
        <div class={`${icon} group-hover:text-slate-900`} />
        <span class="ms-3 whitespace-nowrap">{text}</span>
      </a>
    </li>
  );
}

function CollapsableSidebarItem({
  text,
  icon,
  newTab,
  collapseItems,
}: {
  text: string;
  icon: string;
  newTab?: boolean;
  collapseItems: Record<string, GetRoutes>;
}) {
  return (
    <>
      <label for="collapsible" class="block transition-all">
        <li>
          <a
            class="group flex items-center rounded-lg px-2 py-1 hover:bg-slate-300 hover:text-slate-900 "
            target={newTab ? "_blank" : ""}
          >
            <div class={`${icon} group-hover:text-slate-900`} />
            <span class="ms-3 whitespace-nowrap">{text}</span>
          </a>
        </li>
      </label>
      <input id="collapsible" class="peer hidden" type="checkbox" />
      <ul class="max-h-0 w-full space-y-1 overflow-hidden pl-6 transition-all peer-checked:max-h-fit">
        {Object.entries(collapseItems).map(([text, href]) => (
          <li
            hx-get={href}
            hx-target="#content"
            hx-swap="innerHTML"
            class="group cursor-pointer rounded-lg px-2 py-1 text-base hover:bg-slate-300 hover:text-slate-900"
          >
            <span class="ms-3 whitespace-nowrap">{text}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
