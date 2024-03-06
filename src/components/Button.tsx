export function Button({
  width,
  primary,
  secondary,
  text,
  as,
  ...rest
}: (JSX.HtmlButtonTag | JSX.HtmlAnchorTag) & {
  width?: string;
  primary?: boolean;
  secondary?: boolean;
  text: string;
  as?: "a" | "button";
}) {
  const classStr = `group relative mb-2 me-2 flex ${width ? (width === "full" ? "w-full" : `w-${width}`) : "w-auto"} items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${primary ? "from-purple-600" : secondary ? "from-teal-300" : "from-slate-100"} ${primary ? "to-blue-600" : secondary ? "to-lime-300" : "to-slate-100"} p-0.5 font-medium text-slate-50 focus:outline-none  focus:ring-4 focus:ring-lime-200 disabled:cursor-not-allowed disabled:bg-slate-600 ${primary ? "group-hover:from-purple-600" : "group-hover:from-teal-300"} ${primary ? "group-hover:to-blue-600" : secondary ? "group-hover:to-lime-300" : "group-hover:to-slate-100"}`;

  const children = (
    <div class="relative w-full rounded-md bg-slate-800 px-5 py-2.5 text-center transition-all duration-75 ease-in group-hover:bg-opacity-0">
      {text}
      <span data-loading class="i-lucide-loader-2 ml-2 animate-spin text-2xl" />
    </div>
  );
  switch (as) {
    case "button":
      return (
        <button class={classStr} {...rest}>
          {children}
        </button>
      );
    case "a":
      return (
        <a class={classStr} {...rest}>
          {children}
        </a>
      );
    default:
      return (
        <button class={classStr} {...rest}>
          {children}
        </button>
      );
  }
}
