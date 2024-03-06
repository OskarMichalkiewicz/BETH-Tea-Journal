import { type PropsWithChildren } from "beth-stack/jsx";

interface ItemProps extends JSX.HtmlLITag {
  text: string;
  path: GetRoutes;
  icon?: string | undefined;
}

interface Items extends ItemProps {
  subpaths?: ItemProps[] | undefined;
}

export const Sidebar = ({
  children,
  items,
}: PropsWithChildren & { items: Items[] }) => (
  <div class="flex">
    <aside class="relative min-w-max border-r border-slate-700 bg-slate-800 text-slate-200">
      <nav class="sticky top-0 flex h-screen flex-col overflow-y-auto px-5 py-6">
        <h1 class="mb-4 text-2xl">Your Journal</h1>
        <ul class="flex-grow space-y-2 text-xl font-medium">
          {items.map(({ text, path, icon, subpaths, ...rest }) => (
            <SidebarItem
              text={text}
              path={path}
              icon={icon}
              subpaths={subpaths}
              {...rest}
            />
          ))}
        </ul>
        <div class="inline-block bg-gradient-to-r from-teal-400 to-lime-400 bg-clip-text text-xl font-bold text-transparent">
          TeeJ
        </div>
      </nav>
    </aside>
    <div class="relative w-full">
      <div id="modals"></div>
      <div id="content" class="min-h-screen p-6">
        {children}
      </div>
    </div>
  </div>
);

function SidebarItem({ text, path, icon, subpaths, ...rest }: Items) {
  return (
    <>
      <label for="collapsible" class="block transition-all">
        <li
          hx-get={path}
          hx-target="#content"
          hx-swap="innerHTML"
          class="group flex cursor-pointer items-center rounded-lg px-2 py-1 hover:bg-slate-300 hover:text-slate-900"
          {...rest}
        >
          <div class={`${icon} group-hover:text-slate-900`} />
          <span class="ms-3 whitespace-nowrap">{text}</span>
        </li>
      </label>
      {subpaths && (
        <>
          <input id="collapsible" class="peer hidden" type="checkbox" />
          <ul class="max-h-0 w-full space-y-1 overflow-hidden pl-6 transition-all peer-checked:max-h-fit">
            {subpaths.map(({ text, path, ...rest }) => (
              <li
                hx-get={path}
                hx-target="#content"
                hx-swap="innerHTML"
                class="group cursor-pointer rounded-lg px-2 py-1 text-base hover:bg-slate-300 hover:text-slate-900"
                {...rest}
              >
                <span class="ms-3 whitespace-nowrap">{text}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
