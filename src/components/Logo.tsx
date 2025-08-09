export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-red-500"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <path d="M12 11a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        <path d="M12 21.5c4-3.5 6-7.5 6-11.5a6 6 0 0 0-12 0c0 4 2 8 6 11.5z" strokeWidth="0" fill="currentColor"/>
        <circle cx="12" cy="14" r="1.5" fill="white" strokeWidth="0"/>
         <rect x="15" y="11" width="2" height="2" rx="0.5" fill="white" stroke="none" />
         <rect x="15" y="14" width="2" height="2" rx="0.5" fill="white" stroke="none"/>
         <rect x="15" y="17" width="2" height="2" rx="0.5" fill="white" stroke="none"/>
      </svg>
       <span className="inline-block font-headline text-lg font-bold">
        Book My Venue
      </span>
    </div>
  );
}
