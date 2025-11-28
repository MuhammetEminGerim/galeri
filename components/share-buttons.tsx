'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Instagram } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonsProps {
    carTitle: string;
    shareUrl: string;
}

export function ShareButtons({ carTitle, shareUrl }: ShareButtonsProps) {

    const copyAndRedirect = async (url: string, redirectUrl: string, message: string) => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success(message);

            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 1000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Link kopyalanamadı');
            window.location.href = redirectUrl;
        }
    };

    const handleStoryShare = () => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const targetUrl = isMobile ? 'instagram://story-camera' : 'https://www.instagram.com/';

        copyAndRedirect(
            shareUrl,
            targetUrl,
            'Link kopyalandı! Instagram Hikaye ekranı açılıyor...'
        );
    };

    const handleWhatsAppShare = () => {
        const text = `Bu araca göz at: ${carTitle} - ${shareUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <Button
                variant="outline"
                className="w-full flex flex-col items-center gap-1 h-auto py-3 hover:bg-[#25D366]/10 hover:text-[#25D366] hover:border-[#25D366] rounded-xl transition-all duration-300"
                onClick={handleWhatsAppShare}
            >
                <MessageCircle className="h-4 w-4" />
                <span className="text-[10px] font-medium">WhatsApp</span>
            </Button>

            <Button
                variant="outline"
                className="w-full flex flex-col items-center gap-1 h-auto py-3 hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C] rounded-xl transition-all duration-300"
                onClick={handleStoryShare}
            >
                <Instagram className="h-4 w-4" />
                <span className="text-[10px] font-medium">Story</span>
            </Button>
        </div>
    );
}
