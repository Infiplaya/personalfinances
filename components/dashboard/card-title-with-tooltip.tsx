import { Info } from 'lucide-react';
import { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

export function CardTitleWithTooltip({
    children,
    message,
}: {
    children: ReactNode;
    message: string;
}) {
    return (
        <div className="inline-flex space-x-4">
            {children}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className='hidden lg:block'>
                        <Info className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{message}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
