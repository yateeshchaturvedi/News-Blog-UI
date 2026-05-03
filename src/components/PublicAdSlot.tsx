import Link from 'next/link';
import Image from 'next/image';
import { getAdvertisements } from '@/lib/api';
import { ArrowRight } from 'lucide-react';

function isYouTubeUrl(url: string) {
    return /(?:youtube\.com|youtu\.be)/i.test(url);
}

function toYouTubeEmbedUrl(url: string) {
    const watchMatch = url.match(/[?&]v=([^&]+)/i);
    if (watchMatch?.[1]) {
        return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }
    const shortMatch = url.match(/youtu\.be\/([^?&/]+)/i);
    if (shortMatch?.[1]) {
        return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }
    return null;
}

function isVideoFileUrl(url: string) {
    return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

function isImageFileUrl(url: string) {
    return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|#|$)/i.test(url);
}

function isVercelBlobUrl(url: string) {
    return /https:\/\/.*\.public\.blob\.vercel-storage\.com\//i.test(url);
}

export default async function PublicAdSlot({
    placement,
    title = 'Sponsored',
    compact = false,
}: {
    placement?: string;
    title?: string;
    compact?: boolean;
}) {
    const ads = await getAdvertisements();
    const activeAds = ads.filter((ad) => ad.isActive !== false);

    if (activeAds.length === 0) return null;

    const normalizedPlacement = (placement || '').trim().toLowerCase();
    const matchedAds = normalizedPlacement
        ? activeAds.filter((ad) => (ad.placement || '').trim().toLowerCase() === normalizedPlacement)
        : activeAds;

    const adToShow = matchedAds[0] || activeAds[0];
    if (!adToShow) return null;
    const mediaUrl = (adToShow.imageUrl || '').trim();
    const linkUrl = (adToShow.linkUrl || '').trim();
    const youtubeEmbedUrl =
        mediaUrl && isYouTubeUrl(mediaUrl)
            ? toYouTubeEmbedUrl(mediaUrl)
            : linkUrl && isYouTubeUrl(linkUrl)
                ? toYouTubeEmbedUrl(linkUrl)
                : null;
    const videoUrl =
        mediaUrl && isVideoFileUrl(mediaUrl)
            ? mediaUrl
            : linkUrl && isVideoFileUrl(linkUrl)
                ? linkUrl
                : null;
    const imageUrl =
        mediaUrl ||
        (linkUrl && (isImageFileUrl(linkUrl) || isVercelBlobUrl(linkUrl)) ? linkUrl : '');

    const adContent = (
        <div className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/40 shadow-2xl backdrop-blur-md transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20 dark:border-slate-700/50 dark:bg-slate-900/40 ${compact ? 'max-w-xs' : 'w-full'}`}>
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            
            <div className="relative overflow-hidden">
                {youtubeEmbedUrl ? (
                    <iframe
                        src={youtubeEmbedUrl}
                        title={adToShow.title}
                        className={`${compact ? 'h-40' : 'h-64'} w-full border-none`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : videoUrl ? (
                    <video
                        src={videoUrl}
                        className={`${compact ? 'h-40' : 'h-64'} w-full object-cover`}
                        controls
                        muted
                        playsInline
                    />
                ) : imageUrl ? (
                    <div className="relative">
                        {isVercelBlobUrl(imageUrl) ? (
                            <Image
                                src={imageUrl}
                                alt={adToShow.title}
                                width={1200}
                                height={400}
                                sizes={compact ? '(max-width: 1024px) 100vw, 320px' : '100vw'}
                                className={`${compact ? 'h-40' : 'h-64'} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                            />
                        ) : (
                            <img
                                src={imageUrl}
                                alt={adToShow.title}
                                className={`${compact ? 'h-40' : 'h-64'} w-full object-cover transition-transform duration-700 group-hover:scale-105`}
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </div>
                ) : (
                    <div className={`${compact ? 'h-40' : 'h-64'} flex items-center justify-center bg-slate-100 dark:bg-slate-800`}>
                        <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    </div>
                )}
                
                <div className="absolute top-4 right-4">
                    <span className="rounded-full bg-slate-950/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/20">
                        {title}
                    </span>
                </div>
            </div>

            <div className={compact ? 'p-5' : 'p-6'}>
                <h4 className={`${compact ? 'text-sm' : 'text-lg'} font-black leading-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors`}>
                    {adToShow.title}
                </h4>
                {!compact && adToShow.createdAt && (
                    <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                        Published by Partner
                    </p>
                )}
                <div className={`mt-4 flex items-center gap-2 ${compact ? 'text-[10px]' : 'text-xs'} font-bold text-primary uppercase tracking-wider`}>
                    Learn More <ArrowRight size={compact ? 12 : 14} className="transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </div>
    );

    if (linkUrl && !youtubeEmbedUrl && !videoUrl) {
        return (
            <Link href={linkUrl} target="_blank" rel="noopener noreferrer" className="block">
                {adContent}
            </Link>
        );
    }

    return adContent;
}
