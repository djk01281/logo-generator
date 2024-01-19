type buttonProps = {
  text: string;
  fn: () => void;
};

export const Button = (buttonProps: buttonProps) => {
  return (
    <button
      className={`order-[1.5px] ml-auto rounded-md border-[1px] border-[#eaeaea] 
              bg-[#171717] px-6
           py-3 font-sans text-[14px] text-white no-underline transition hover:border-[#383838] hover:bg-[#383838]`}
      onClick={buttonProps.fn}
    >
      {buttonProps.text}
    </button>
  );
};

export const LoadingButton = () => {
  return (
    <button
      disabled={true}
      className={`relative order-[1.5px] ml-auto  flex cursor-not-allowed items-center gap-2 rounded-md
       border-[1px] border-[#eaeaea] bg-[#f2f2f2] px-3 py-3 font-sans text-[14px] text-[8f8f8f] no-underline transition`}
    >
      <svg
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        viewBox="0 0 24 24"
        stroke-linecap="round"
        stroke-linejoin="round"
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 animate-spin stroke-[#666]"
      >
        <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
      </svg>
      <span>Loading</span>
    </button>
  );
};
