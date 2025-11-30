/**
 * Partner Detail Page
 *
 * Dynamic page displaying comprehensive information about a specific partner.
 * Includes company details, collaboration information, statistics, and impact metrics.
 */

import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Calendar, MapPin, TrendingUp, Users, CheckCircle2, Mail, Phone, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "@/contexts/TranslationContext";
import { usePartner } from "@/hooks/usePartners";
const PartnerDetail = () => {
    const { partnerId } = useParams<{ partnerId: string; }>();
    const { t, language } = useTranslation();
    const { data: partner, isLoading, error } = usePartner(partnerId || '');

    type TranslatableField = { fr?: string; ar?: string; en?: string; } | undefined | {};
    type Language = 'en' | 'fr' | 'ar';

    const getTranslated = (field: TranslatableField, fallback: string = ''): string => {
        if (!field || typeof field !== 'object') return fallback;
        const translated = field[language as Language] || field['en'] || field['fr'] || field['ar'];
        return translated || fallback;
    };

    const getImageUrl = (path: string | undefined): string => {
        if (!path) return '/placeholder.svg';
        if (path.startsWith('http')) return path;
        const BASE_URL = import.meta.env.VITE_DJANGO_API_URL || 'http://127.0.0.1:8000';
        return `${BASE_URL.replace('/api', '')}/${path}`;
    };

    if (isLoading) {
        return <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{t('partner.loading') || 'Loading...'}</h1>
                </div>
            </div>
            <Footer />
        </div>;
    }

    if (error || !partner) {
        return <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">{t('partner.notFound')}</h1>
                    <p className="text-muted-foreground mb-8">{t('partner.notFoundDesc')}</p>
                    <Link to="/#partnerships">
                        <Button>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {t('partner.backToPartnerships')}
                        </Button>
                    </Link>
                </div>
            </div>
            <Footer />
        </div>;
    }
    return <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-24 pb-20">
            {/* Back Button */}
            <div className="container mx-auto px-6 mb-8">
                <Link to="/#partnerships">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        {t('nav.partnerships')}
                    </Button>
                </Link>
            </div>

            {/* Hero Section */}
            <section className="container mx-auto px-6 mb-16">
                <motion.div initial={{
                    opacity: 0,
                    y: 20
                }} animate={{
                    opacity: 1,
                    y: 0
                }} transition={{
                    duration: 0.6
                }} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border p-12">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />

                    <div className="relative grid md:grid-cols-[1.5fr,1fr] gap-16 items-center">
                        <div className="space-y-6">
                            {partner.type_partenaire && <Badge className="mb-2 text-sm px-4 py-1.5">{partner.type_partenaire}</Badge>}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                {getTranslated(partner.nom_partenaire, `Partner ${partnerId}`)}
                            </h1>
                            {getTranslated(partner.description) && (
                                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                                    {getTranslated(partner.description)}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-6 pt-4">
                                {partner.date_creation_entreprise && <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('partner.founded')}</p>
                                        <p className="font-semibold text-lg">{new Date(partner.date_creation_entreprise).getFullYear()}</p>
                                    </div>
                                </div>}
                                {partner.adresse && partner.adresse.length > 0 && <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('partner.headquarters')}</p>
                                        <p className="font-semibold text-lg">{getTranslated(partner.adresse[0].ville)}</p>
                                    </div>
                                </div>}
                                {partner.date_deb && <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('partner.partnershipSince')}</p>
                                        <p className="font-semibold text-lg">{new Date(partner.date_deb).getFullYear()}</p>
                                    </div>
                                </div>}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-4">
                                {partner.site_web && <a href={partner.site_web} target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="gap-2">
                                        {t('partner.visitWebsite')}
                                        <ExternalLink className="w-4 h-4" />
                                    </Button>
                                </a>}
                                {partner.email && <a href={`mailto:${partner.email}`}>
                                    <Button size="lg" variant="outline" className="gap-2">
                                        <Mail className="w-4 h-4" />
                                        {t('contact.email')}
                                    </Button>
                                </a>}
                            </div>
                        </div>

                        <div className="h-full min-h-[300px] relative">
                            <div className="sticky top-8 h-full rounded-2xl flex items-center justify-center p-8">
                                <img 
                                    src={getImageUrl(partner.logo)} 
                                    alt={getTranslated(partner.nom_partenaire, `Partner ${partnerId}`)} 
                                    className="relative w-full h-full object-contain drop-shadow-2xl"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>


            {/* About Section - Full Width Editorial */}
            <section className="mb-32">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto"
                    >
                        <div className="relative mb-16">
                            <div className="absolute -left-8 top-0 text-[12rem] font-black text-primary/5 leading-none select-none">"</div>
                            <div className="relative">
                                <h3 className="text-5xl md:text-6xl lg:text-7xl font-black mb-12 leading-tight">
                                    {t('partner.aboutTitle')} {getTranslated(partner.nom_partenaire, `Partner ${partnerId}`)}
                                </h3>

                                {getTranslated(partner.description) && <div className="space-y-8">
                                    <p className="text-2xl md:text-3xl text-foreground leading-relaxed font-light">
                                        {getTranslated(partner.description)}
                                    </p>

                                    {/* Contact Information */}
                                    <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-border/50 mt-8">
                                        {partner.email && <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-primary mb-3">
                                                <Mail className="w-5 h-5" />
                                                <span className="font-semibold text-sm uppercase tracking-wider">{t('contact.email')}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed break-all">
                                                {partner.email}
                                            </p>
                                        </div>}

                                        {partner.telephone && <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-primary mb-3">
                                                <Phone className="w-5 h-5" />
                                                <span className="font-semibold text-sm uppercase tracking-wider">{t('contact.phone')}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {partner.telephone}
                                            </p>
                                        </div>}

                                        {partner.adresse && partner.adresse.length > 0 && <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-primary mb-3">
                                                <MapPin className="w-5 h-5" />
                                                <span className="font-semibold text-sm uppercase tracking-wider">{t('contact.location')}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {getTranslated(partner.adresse[0].rue)}, {getTranslated(partner.adresse[0].ville)}, {getTranslated(partner.adresse[0].pays)}
                                            </p>
                                        </div>}
                                    </div>

                                    {/* External Links */}
                                    {partner.liens_externes && Object.keys(partner.liens_externes).length > 0 && <div className="space-y-4 pt-8">
                                        <h4 className="font-semibold text-lg">{t('partner.externalLinks') || 'External Links'}</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {Object.entries(partner.liens_externes).map(([key, url]) => url && (
                                                <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <Globe className="w-4 h-4" />
                                                        {key}
                                                    </Button>
                                                </a>
                                            ))}
                                        </div>
                                    </div>}
                                </div>}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Gallery Section - Creative Bento Grid */}
            {partner.image_banniere && (
                <section className="container mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-12">
                            <h3 className="text-3xl md:text-4xl font-black mb-3">{t('partner.galleryTitle')}</h3>
                            <p className="text-muted-foreground text-lg">{t('partner.gallerySubtitle')}</p>
                        </div>

                        {/* Banner Image Display */}
                        <div className="w-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="relative group overflow-hidden rounded-3xl aspect-video"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                <img
                                    src={getImageUrl(partner.image_banniere)}
                                    alt={`${getTranslated(partner.nom_partenaire, `Partner ${partnerId}`)} banner`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder.svg';
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </section>
            )}


            {/* Impact - Full Width Feature */}
            <section className="container mx-auto px-6 mb-32">
                <motion.div initial={{
                    opacity: 0,
                    y: 30
                }} whileInView={{
                    opacity: 1,
                    y: 0
                }} viewport={{
                    once: true
                }} className="relative">

                </motion.div>
            </section>

            {/* CTA Section - Split Design */}
            <section className="container mx-auto px-6 mb-20">
                <motion.div initial={{
                    opacity: 0,
                    y: 30
                }} whileInView={{
                    opacity: 1,
                    y: 0
                }} viewport={{
                    once: true
                }} className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border">
                    {/* Left Side - Dark */}
                    <div className="bg-foreground text-background p-12 md:p-16 flex flex-col justify-center">
                        <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                            {t('partner.readyToPartner')}
                        </h2>
                        <p className="text-background/80 text-lg mb-8 font-light">
                            {t('partner.readyToPartnerDesc')}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button size="lg" variant="secondary" asChild className="font-semibold">
                                <Link to="/contact">{t('partner.startConversation')}</Link>
                            </Button>
                        </div>
                    </div>

                    {/* Right Side - Light with gradient */}
                    <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-background p-12 md:p-16 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                        <div className="relative">
                            <p className="text-muted-foreground mb-6 text-lg">
                                {t('partner.exploreMore')}
                            </p>
                            <Button size="lg" variant="outline" asChild className="font-semibold">
                                <Link to="/#partnerships">{t('partner.viewAllPartners')}</Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </section>
        </main>

        <Footer />
    </div>;
};
export default PartnerDetail;
