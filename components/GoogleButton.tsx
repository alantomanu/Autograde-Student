import Image from 'next/image';

interface GoogleButtonProps {
  onClick: () => void;
  text: string;
}

export default function GoogleButton({ onClick, text }: GoogleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full transform-gpu items-center justify-center overflow-hidden rounded-xl bg-white p-[1px] shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]"
    >
      {/* Subtle border gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Button content */}
      <div className="relative flex w-full items-center justify-center rounded-xl px-6 py-2.5">
        {/* Content wrapper */}
        <div className="flex items-center justify-center gap-4">
          {/* Google logo */}
          <div className="relative flex h-5 w-5 items-center justify-center">
            <Image
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="relative transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Text */}
          <span className="text-center text-sm font-semibold tracking-wide text-gray-800 transition-colors duration-300 group-hover:text-black">
            {text}
          </span>
        </div>
      </div>
    </button>
  );
} 