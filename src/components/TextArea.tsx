export function TextArea({
  primary,
  secondary,
  label,
  id,
  ...rest
}: JSX.HtmlTextAreaTag & {
  primary?: boolean;
  secondary?: boolean;
  label: string;
}) {
  return (
    <div class="relative">
      <textarea
        class="peer w-full  border-b border-slate-100 bg-transparent py-1 text-slate-100 outline outline-0 autofill:transition-colors autofill:duration-[5000000ms] focus:outline-0"
        placeholder=" "
        {...rest}
      />
      <label
        for={id}
        class={`!peer-focus:-top-4 !peer-focus:text-sm !peer-focus:text-transparent pointer-events-none absolute -top-4 left-0 inline-block h-full w-full cursor-text overflow-visible truncate bg-gradient-to-r ${
          primary
            ? "from-purple-600"
            : secondary
              ? "from-teal-300"
              : "from-slate-100"
        } ${primary ? "to-blue-600" : secondary ? "to-lime-300" : "to-slate-100"} bg-clip-text text-sm text-transparent transition-all peer-placeholder-shown:top-0 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-600 peer-focus:inline-block peer-focus:bg-gradient-to-r ${primary ? "peer-focus:from-purple-600" : secondary ? "peer-focus:from-teal-300" : "peer-focus:from-slate-100"} ${primary ? "peer-focus:to-blue-600" : secondary ? "peer-focus:to-lime-200" : "peer-focus:to-slate-100"} peer-focus:bg-clip-text`}
      >
        {label}
      </label>
    </div>
  );
}
