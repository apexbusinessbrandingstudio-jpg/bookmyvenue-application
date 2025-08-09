export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-primary"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
        <path d="M12 2v4"></path>
        <path d="M8 2v4"></path>
        <path d="M16 2v4"></path>
      </svg>
       <span className="inline-block font-headline text-lg font-bold">
        Book My Venue
      </span>
    </div>
  );
}
