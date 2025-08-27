import React from "react";

export const Footer = () => {
  return (
    <footer className="w-full border-t-[1px] border-border/50 bg-slate-900 p-4 text-gray-300 shadow-md mt-auto">
      <div className="mx-auto max-w-[45rem]">
        <div className="flex flex-col items-center justify-center gap-1 md:flex-row md:justify-between">
          <small className="text-xs">
            © 2025 Hiratra. All rights reserved.
          </small>
          <p className="flex items-center justify-center gap-1 text-xs">
            Made with
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="24"
              fill="none"
              viewBox="0 0 25 24"
            >
              <path
                fill="#F44336"
                d="M12.11 18.996c.196 0 .482-.15.716-.301 4.211-2.712 6.908-5.891 6.908-9.108 0-2.78-1.92-4.709-4.324-4.709-1.5 0-2.622.83-3.3 2.065-.663-1.236-1.793-2.065-3.292-2.065-2.41 0-4.332 1.929-4.332 4.709 0 3.217 2.705 6.396 6.909 9.108.233.15.52.301.715.301z"
              ></path>
            </svg>
            by <span className="font-semibold">Hiratra DANARSON</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
