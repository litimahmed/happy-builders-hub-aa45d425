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
    const cleanBase = BASE_URL.replace('/api', '').replace(/\/$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  const getExternalLinksTitle = (): string => {
    const titles = {
      en: 'External Links',
      fr: 'Liens Externes',
      ar: 'روابط خارجية'
    };
    return titles[language as keyof typeof titles] || titles.en;
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
                                        <Calendar className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{t('partner.partnershipPeriod')}</p>
                                        <p className="font-semibold text-lg">
                                            {new Date(partner.date_deb).getFullYear()}
                                            {partner.date_fin && ` - ${new Date(partner.date_fin).getFullYear()}`}
                                        </p>
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

                            {/* Social Media Links */}
                            {(partner.facebook || partner.instagram || partner.tiktok) && (
                                <div className="flex flex-wrap gap-3 pt-2">
                                    {partner.facebook && <a href={partner.facebook} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="ghost" className="gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                            Facebook
                                        </Button>
                                    </a>}
                                    {partner.instagram && <a href={partner.instagram} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="ghost" className="gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                            Instagram
                                        </Button>
                                    </a>}
                                    {partner.tiktok && <a href={partner.tiktok} target="_blank" rel="noopener noreferrer">
                                        <Button size="sm" variant="ghost" className="gap-2">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                                            TikTok
                                        </Button>
                                    </a>}
                                </div>
                            )}
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
                                    {partner.liens_externes && partner.liens_externes.length > 0 && <div className="space-y-4 pt-8">
                                        <h4 className="font-semibold text-lg">{getExternalLinksTitle()}</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {partner.liens_externes.map((link, index) => (
                                                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        <Globe className="w-4 h-4" />
                                                        <div className="text-left">
                                                            <div className="font-medium">{link.titre}</div>
                                                            <div className="text-xs text-muted-foreground">{link.url.replace(/^https?:\/\//, '').substring(0, 30)}</div>
                                                        </div>
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

            {/* Banner Image */}
            {partner.image_banniere && (
                <section className="container mx-auto px-6 mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
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
