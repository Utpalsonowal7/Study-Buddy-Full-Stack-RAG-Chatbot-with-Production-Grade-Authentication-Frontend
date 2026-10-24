import { Info } from "lucide-react";

interface InfoModelData {
     info: string;
     isShown: boolean;
}

function InfoModel(props: InfoModelData) {
     if (!props.isShown) return null;

     return (
          <div
               role="alert"
               className="fixed top-4 left-1/2 -translate-x-1/2 z-50
               w-[calc(100%-2rem)] max-w-xl
               flex items-start gap-3
               rounded-xl border border-orange-300
               bg-white px-5 py-4 text-orange-950
               shadow-xl animate-[fade-out_15s_ease-out_forwards]
               dark:border-orange-800 dark:bg-gray-900 dark:text-orange-100"
          >
               <Info className="mt-0.5 size-5 shrink-0 text-orange-600" />

               <div className="min-w-0">
                    <p className="font-semibold">
                         Service Temporarily Unavailable
                    </p>

                    <p className="mt-1 text-sm leading-relaxed">{props.info}</p>
               </div>
          </div>
     );
}

export default InfoModel;
