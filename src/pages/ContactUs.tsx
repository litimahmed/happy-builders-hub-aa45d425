import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowLeft, Send, Printer } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/contexts/TranslationContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useContactInfo } from "@/hooks/useContactInfo";
import { contactService } from "@/services/contactService";

const ContactUsPage = () => {
    const { t, language } = useTranslation();
    const { data: apiData, isLoading } = useContactInfo();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    type TranslatableField = { fr: string; ar: string; en: string; } | undefined;
    type Language = 'en' | 'fr' | 'ar';

    const getTranslated = (field: TranslatableField) => {
        if (!field) return '';
        return field[language as Language] || field['en'] || '';
    };

    const contactInfo = [
        {
            icon: Mail,
            title: t("contact.email"),
            value: apiData?.email || "contact@toorrii.com",
            color: "text-primary",
        },
        {
            icon: Phone,
            title: t("contact.phone"),
            value: (
                <div className="flex flex-col items-center">
                    {apiData?.telephone_1 && <span>{apiData.telephone_1}</span>}
                    {apiData?.telephone_2 && <span>{apiData.telephone_2}</span>}
                </div>
            ),
            color: "text-secondary",
        },
        {
            icon: Printer,
            title: "Fax",
            value: apiData?.telephone_fixe,
            color: "text-primary",
        },
        {
            icon: MapPin,
            title: t("contact.location"),
            value: apiData?.adresse ? `${getTranslated(apiData.adresse)}, ${getTranslated(apiData.ville)}` : "Algiers, Algeria",
            color: "text-primary",
        },
        {
            icon: Clock,
            title: t("contact.hours"),
            value: apiData?.horaires || t("contact.hoursValue"),
            color: "text-secondary",
        },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await contactService.sendContactMessage(formData);
            toast.success(t("contactPage.successMessage"));
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            toast.error(t("contactPage.errorMessage") || "Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-background" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Header />

            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Link to="/">
                            <Button variant="ghost" className="gap-2">
                                <ArrowLeft className="w-4 h-4" />
                                {t("aboutPage.backToHome")}
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Page Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-16"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {t("contact.title")}
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            {t("contact.subtitle")}
                        </p>
                    </motion.div>

                    {/* Contact Info Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {contactInfo.map((info, index) => (
                            <motion.div
                                key={info.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-full hover:shadow-card transition-shadow">
                                    <CardContent className="pt-6 text-center">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <info.icon className={`w-6 h-6 ${info.color}`} />
                                        </div>
                                        <h3 className="font-semibold mb-2">{info.title}</h3>
                                        <p className="text-sm text-muted-foreground">{info.value}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto"
                    >
                        <Card>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium">
                                                {t("contactPage.name")}
                                            </label>
                                            <Input
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("contactPage.namePlaceholder")}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium">
                                                {t("contactPage.email")}
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                placeholder={t("contactPage.emailPlaceholder")}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium">
                                            {t("contactPage.subject")}
                                        </label>
                                        <Input
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            placeholder={t("contactPage.subjectPlaceholder")}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">
                                            {t("contactPage.message")}
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={6}
                                            placeholder={t("contactPage.messagePlaceholder")}
                                        />
                                    </div>

                                    <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                                        <Send className="w-4 h-4" />
                                        {isSubmitting ? t("contactPage.sending") || "Sending..." : t("contactPage.submit")}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ContactUsPage;
