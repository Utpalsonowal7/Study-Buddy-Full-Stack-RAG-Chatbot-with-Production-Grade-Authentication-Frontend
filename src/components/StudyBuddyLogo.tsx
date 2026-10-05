interface StudyBuddyMarkProps {
     size?: number;
     className?: string;
}

interface StudyBuddyLogoProps extends StudyBuddyMarkProps {
     textClassName?: string;
}

export function StudyBuddyMark({ size = 36, className = "" }: StudyBuddyMarkProps) {
     return (
          <svg
               width={size}
               height={size}
               viewBox="0 0 40 40"
               fill="none"
               className={`shrink-0 text-short ${className}`}
               role="img"
               aria-label="Study Buddy mark"
               xmlns="http://www.w3.org/2000/svg"
          >
               <rect x="1" y="1" width="38" height="38" rx="12" fill="currentColor" />
               <path d="M8 13.2c4.1-.8 8.1.1 12 2.8v14c-3.9-2.6-7.9-3.5-12-2.7v-14.1Zm24 0c-4.1-.8-8.1.1-12 2.8v14c3.9-2.6 7.9-3.5 12-2.7v-14.1Z" fill="white" fillOpacity=".96" />
               <path d="M20 16v14M28.5 7.5v6m-3-3h6" stroke="#BFDBFE" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
     );
}

export default function StudyBuddyLogo({ size = 36, className = "", textClassName = "" }: StudyBuddyLogoProps) {
     return (
          <span className={`inline-flex items-center gap-2.5 ${className}`}>
               <StudyBuddyMark size={size} />
               <span className={textClassName || "font-semibold text-title"}>Study Buddy</span>
          </span>
     );
}
