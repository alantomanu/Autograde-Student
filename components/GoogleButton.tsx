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
      className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      <Image
        src="https://authjs.dev/img/providers/google.svg"
        alt="Google logo"
        width={20}
        height={20}
      />
      {text}
    </button>
  );
} 