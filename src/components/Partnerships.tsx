/**
 * @file Partnerships.tsx
 * @description This component displays a section showcasing the company's partnerships.
 * It features an infinite scrolling carousel of partner logos, each linking to a detailed partner page.
 * The component is animated with Framer Motion for a dynamic and engaging user experience.
 */

// Import necessary libraries and components.
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";
import { usePartners } from "@/hooks/usePartners";

/**
 * @component Partnerships
 * @description The main component for the partnerships section.
 */
const Partnerships = () => {
    // Hook to get the translation function.
    const { t, language } = useTranslation();
    const { data: partners, isLoading } = usePartners();

    type TranslationItem = { lang: string; value: string; };
    type TranslatableField = TranslationItem[] | undefined;

    const getTranslated = (field: TranslatableField, fallback: string = ''): string => {
        if (!field || !Array.isArray(field)) return fallback;
        const translation = field.find(item => item.lang === language) 
            || field.find(item => item.lang === 'en') 
            || field.find(item => item.lang === 'fr')
            || field[0];
        return translation?.value || fallback;
    };

    const getImageUrl = (path: string | undefined): string => {
        if (!path) return '/placeholder.svg';
        if (path.startsWith('http')) return path;
        const BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000';
        const cleanBase = BASE_URL.replace('/api', '');
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${cleanBase}${cleanPath}`;
    };

    // Filter active partners and sort by priority
    const activePartners = (partners || [])
        .filter(partner => partner.actif !== false)
        .sort((a, b) => (a.priorite_affichage || 0) - (b.priorite_affichage || 0));

    if (isLoading) {
        return (
            <section id="partnerships" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {t("partnerships.title")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("partnerships.subtitle")}
                        </p>
                    </div>
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-pulse text-muted-foreground">Loading partners...</div>
                    </div>
                </div>
            </section>
        );
    }

    if (!activePartners || activePartners.length === 0) {
        return (
            <section id="partnerships" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            {t("partnerships.title")}
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("partnerships.subtitle")}
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="partnerships" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                {/* Animated section header. */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        {t("partnerships.title")}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {t("partnerships.subtitle")}
                    </p>
                </motion.div>

                {/* Container for the infinite scrolling carousel. */}
                <div className="relative overflow-hidden py-4">
                    {/* Gradient overlays to create a fade-out effect on the edges. */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

                    {/* The scrolling container. The `animate-scroll-infinite` class applies the infinite scroll animation. */}
                    <div className="flex w-max gap-6 animate-scroll-infinite">
                        {/* The activePartners array is duplicated multiple times to create a seamless loop. */}
                        {Array(8).fill(activePartners).flat().map((partner, index) => {
                            const partnerId = partner.partenaire_id || partner.id?.toString();
                            const partnerName = getTranslated(partner.nom_partenaire, `Partner ${partnerId}`);
                            const logoUrl = getImageUrl(partner.logo);
                            
                            return (
                                <Link
                                    key={`${partnerId}-${index}`}
                                    to={`/partner/${partnerId}`}
                                    className="flex-shrink-0"
                                >
                                    {/* Animated partner logo card with hover effects. */}
                                    <motion.div
                                        className="group relative cursor-pointer"
                                        whileHover={{ y: -4 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        {/* A blurred gradient that appears on hover for a glowing effect. */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 rounded-xl blur-xl transition-opacity duration-500" />
                                        <div className="relative flex items-center justify-center w-48 h-32 border border-border/50 rounded-xl bg-background/80 backdrop-blur-md transition-all duration-300 overflow-hidden">
                                            {/* A subtle gradient overlay that appears on hover. */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            <img
                                                src={logoUrl}
                                                alt={partnerName}
                                                className="w-40 h-24 object-contain relative z-10 transition-all duration-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = '/placeholder.svg';
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Partnerships;
