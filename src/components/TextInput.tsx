export function TextInput({
  primary,
  secondary,
  label,
  name,
  ...rest
}: JSX.HtmlInputTag & {
  primary?: boolean;
  secondary?: boolean;
  label: string;
}) {
  const str = `!peer-focus:-top-4 !peer-focus:text-xs !peer-focus:text-transparent pointer-events-none absolute -top-4 left-0 inline-block h-full w-full cursor-text overflow-visible truncate bg-gradient-to-r ${
    primary ? "from-purple-600" : secondary ? "from-teal-300" : "from-gray-100"
  } ${primary ? "to-blue-600" : secondary ? "to-lime-300" : "to-gray-100"} bg-clip-text text-xs text-transparent transition-all peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 peer-focus:inline-block peer-focus:bg-gradient-to-r ${primary ? "peer-focus:from-purple-600" : secondary ? "peer-focus:from-teal-300" : "peer-focus:from-gray-100"} ${primary ? "peer-focus:to-blue-600" : secondary ? "peer-focus:to-lime-200" : "peer-focus:to-gray-100"} peer-focus:bg-clip-text`;
  return (
    <div class="relative">
      <input
        class="peer w-full border-b border-gray-100 bg-transparent py-1 text-gray-100 outline outline-0 focus:outline-0"
        type="text"
        placeholder=" "
        {...rest}
      />
      <label for={name} class={str}>
        {label}
      </label>
    </div>
  );
}
