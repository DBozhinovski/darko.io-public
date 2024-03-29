import nightwind from "nightwind/helper";

export const ThemeSwitch = () => {
  return (
    <button
      class="text-neutral-500 hover:text-neutral-700"
      onClick={() => {
        nightwind.toggle();
      }}
      title="Toggle Dark Mode"
    >
      <svg
        class="w-6 h-6"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="currentColor">
          <path d="M12 16a4 4 0 0 0 0-8v8Z" />
          <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2Zm0 2v4a4 4 0 1 0 0 8v4a8 8 0 1 0 0-16Z"
            clip-rule="evenodd"
          />
        </g>
      </svg>
    </button>
  );
};
