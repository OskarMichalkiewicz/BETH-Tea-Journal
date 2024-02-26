import { type PropsWithChildren } from "beth-stack/jsx";

export const Modal = ({
  children,
  title,
}: PropsWithChildren<{ title: string }>) => (
  <div
    id="modal"
    class="absolute inset-x-0 top-4 z-10 flex items-center justify-center transition-all duration-1000"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
    _="on closeModal transition my opacity to 0 over 0.2s then remove me"
  >
    <div class="overflow-hidden rounded-xl border border-gray-700 bg-gray-800 p-4 text-neutral-100 shadow-lg">
      <div class="flex items-baseline justify-between">
        <h1 safe class="text-3xl font-semibold">
          {title}
        </h1>
        <button
          type="button"
          class="i-lucide-x text-3xl"
          _="on click trigger closeModal"
        />
      </div>
      <div class="mt-2">{children}</div>
    </div>
  </div>
);
