export function Button({
  primary,
  secondary,
  text,
  ...rest
}: JSX.HtmlButtonTag & {
  primary?: boolean;
  secondary?: boolean;
  text: string;
}) {
  return (
    <button
      class={`group relative mb-2 me-2 inline-flex w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${primary ? "from-purple-600" : secondary ? "from-teal-300" : "from-gray-100"} ${primary ? "to-blue-600" : secondary ? "to-lime-300" : "to-gray-100"} p-0.5 text-sm font-medium text-gray-50 focus:outline-none  focus:ring-4 focus:ring-lime-200 disabled:cursor-not-allowed disabled:bg-gray-600 ${primary ? "group-hover:from-purple-600" : "group-hover:from-teal-300"} ${primary ? "group-hover:to-blue-600" : secondary ? "group-hover:to-lime-300" : "group-hover:to-gray-100"}`}
      {...rest}
    >
      <span class="relative w-full rounded-md bg-gray-800 px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0">
        {text}
      </span>
      <div data-loading class="i-lucide-loader-2 ml-2 animate-spin text-2xl" />
    </button>
  );
}
