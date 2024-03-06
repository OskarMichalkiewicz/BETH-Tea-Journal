export function TextInput({
  primary,
  secondary,
  label,
  id,
  ...rest
}: JSX.HtmlInputTag & {
  primary?: boolean;
  secondary?: boolean;
  label: string;
}) {
  return (
    <div class="relative">
      <input
        class="peer w-full border-b border-slate-100 bg-transparent py-1 text-slate-100 outline outline-0 autofill:transition-colors autofill:duration-[5000000ms] focus:outline-0"
        type="text"
        placeholder=" "
        {...rest}
      />
      <label
        for={id}
        class={`!peer-focus:-top-4 !peer-focus:text-base !peer-focus:text-transparent pointer-events-none absolute -top-4 left-0 inline-block h-full w-full cursor-text overflow-visible truncate ${
          primary ? "from-purple-600" : secondary && "from-teal-300"
        } ${primary ? "to-blue-600" : secondary && "to-lime-300"} bg-clip-text text-base text-transparent transition-all peer-placeholder-shown:top-0 peer-placeholder-shown:text-lg peer-placeholder-shown:text-slate-600 peer-focus:inline-block peer-focus:bg-gradient-to-r ${primary ? "peer-focus:from-purple-600" : secondary && "peer-focus:from-teal-300"} ${primary ? "peer-focus:to-blue-600" : secondary && "peer-focus:to-lime-200"} peer-focus:bg-clip-text`}
      >
        {label}
      </label>
    </div>
  );
}
