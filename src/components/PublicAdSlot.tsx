import Link from 'next/link';
import Image from 'next/image';
import { getAdvertisements } from '@/lib/api';

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
}: {
    placement?: string;
    title?: string;
}) {
    const ads = await getAdvertisements();
    const activeAds = ads.filter((ad) => ad.isActive !== false);

    if (activeAds.length === 0) {
        return null;
    }

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
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-sm">
            {youtubeEmbedUrl ? (
                <iframe
                    src={youtubeEmbedUrl}
                    title={adToShow.title}
                    className="h-56 w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            ) : videoUrl ? (
                <video
                    src={videoUrl}
                    className="h-56 w-full object-cover"
                    controls
                    muted
                    playsInline
                />
            ) : imageUrl ? (
                isVercelBlobUrl(imageUrl) ? (
                    <Image
                        src={imageUrl}
                        alt={adToShow.title}
                        width={1200}
                        height={360}
                        className="h-48 w-full object-cover"
                    />
                ) : (
                    <img
                        src={imageUrl}
                        alt={adToShow.title}
                        className="h-48 w-full object-cover"
                    />
                )
            ) : null}
            <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{adToShow.title}</p>
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
