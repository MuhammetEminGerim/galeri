'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Instagram, Send, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
    carTitle: string;
    shareUrl: string; // We can pass this or use window.location.href
}

export function ShareButtons({ carTitle, shareUrl }: ShareButtonsProps) {

    const copyAndRedirect = async (url: string, redirectUrl: string, message: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success(message);

            // Small delay to let the toast appear and clipboard write to finish
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Link kopyalanamadı');
            // Still try to redirect
            window.location.href = redirectUrl;
        }
    };

    const handleStoryShare = () => {
        // Try to open Instagram Story camera (mobile) or main page
        // Note: Deep linking to story camera with content isn't standard across all devices without native code.
        // We'll redirect to the app/site.
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const targetUrl = isMobile ? 'instagram://story-camera' : 'https://www.instagram.com/';

        copyAndRedirect(
            shareUrl,
            targetUrl,
            'Link kopyalandı! Instagram Hikaye ekranı açılıyor...'
        );
    };

    const handleDMShare = () => {
        // Open Direct Inbox
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const targetUrl = isMobile ? 'instagram://direct/inbox' : 'https://www.instagram.com/direct/inbox/';

        copyAndRedirect(
            shareUrl,
            targetUrl,
            'Link kopyalandı! Instagram DM kutusu açılıyor...'
        );
    };

    const handleWhatsAppShare = () => {
        const text = `Bu araca göz at: ${carTitle} - ${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            <Button
                variant="outline"
                className="w-full flex flex-col items-center gap-1 h-auto py-3 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366]"
                onClick={handleWhatsAppShare}
            >
                <MessageCircle className="h-5 w-5" />
                <span className="text-[10px] font-medium">WhatsApp</span>
            </Button>

            <Button
                variant="outline"
                className="w-full flex flex-col items-center gap-1 h-auto py-3 hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]"
                onClick={handleStoryShare}
            >
                <Instagram className="h-5 w-5" />
                <span className="text-[10px] font-medium">Story</span>
            </Button>

            <Button
                variant="outline"
                className="w-full flex flex-col items-center gap-1 h-auto py-3 hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]"
                onClick={handleDMShare}
            >
                <Send className="h-5 w-5" />
                <span className="text-[10px] font-medium">DM</span>
            </Button>
        </div>
    );
}
