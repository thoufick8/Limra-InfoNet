
import React, { useEffect, useRef } from 'react';

// Add adsbygoogle to the window interface to avoid TypeScript errors.
declare global {
    interface Window {
        adsbygoogle?: { [key: string]: unknown }[];
    }
}

interface AdSenseBlockProps {
    adSlot: string;
    style?: React.CSSProperties;
    adFormat?: string;
    responsive?: string;
    className?: string;
}

const AdSenseBlock: React.FC<AdSenseBlockProps> = ({ 
    adSlot, 
    style = { display: 'block' }, 
    adFormat = 'auto', 
    responsive = 'true',
    className = ''
}) => {
    const adRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use a timeout to ensure the ad container has been rendered and sized in the DOM.
        // This is a common solution for SPAs to prevent the "availableWidth=0" error.
        const timeoutId = setTimeout(() => {
            try {
                if (adRef.current && adRef.current.offsetParent !== null && window.adsbygoogle) {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                }
            } catch (e) {
                console.error("AdSense error:", e);
            }
        }, 100); // 100ms delay as a safe margin

        return () => {
            clearTimeout(timeoutId);
        };
    }, [adSlot]); // Rerun effect if adSlot changes

    return (
        // This container div is simplified to avoid layout issues (e.g., from flexbox) during initial render.
        // The ad unit itself should be responsive and fill this container.
        <div ref={adRef} className={`my-6 ${className}`}>
            <ins className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-4306845181369248"
                // IMPORTANT: Replace this with your real AdSense ad unit slot ID.
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={responsive}
                aria-hidden="true"
            ></ins>
        </div>
    );
};

export default AdSenseBlock;
