/**
 * @file PrivacyPolicy.tsx
 * @description This component renders a section on the homepage that provides a brief overview of the company's privacy policy.
 * It highlights key privacy features and includes a call-to-action to read the full policy.
 * The component is animated with Framer Motion for a dynamic and engaging user experience.
 */

// Import necessary libraries and components.
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "@/contexts/TranslationContext";
import { usePrivacyPolicy } from "@/hooks/usePrivacyPolicy";

/**
 * @component PrivacyPolicy
 * @description The main component for the privacy policy section.
 */
const PrivacyPolicy = () => {
  const { t, language } = useTranslation();
  const { data: privacyData } = usePrivacyPolicy();

  type Language = 'en' | 'fr' | 'ar';
  type TranslatableField = { fr?: string; ar?: string; en?: string; } | undefined | {};

  const getTranslated = (field: TranslatableField, fallback: string = ''): string => {
    if (!field || typeof field !== 'object') return fallback;
    const translated = field[language as Language] || field['en'] || field['fr'] || field['ar'];
    return translated || fallback;
  };

  const getContentSections = () => {
    if (!privacyData?.contenu) return [];
    if (Array.isArray(privacyData.contenu)) {
      return privacyData.contenu.filter(section => section.type === 'section').slice(0, 4);
    }
    return [];
  };

  const apiSections = getContentSections();
  
  // Fallback sections when no API data
  const fallbackSections = [
    {
      title: t("privacy.dataProtection"),
      description: t("privacy.dataProtectionDesc")
    },
    {
      title: t("privacy.encryption"),
      description: t("privacy.encryptionDesc")
    },
    {
      title: t("privacy.transparency"),
      description: t("privacy.transparencyDesc")
    },
    {
      title: t("privacy.compliance"),
      description: t("privacy.complianceDesc")
    }
  ];

  // Use API sections if available, otherwise use fallback
  const privacyFeatures = apiSections.length > 0 
    ? apiSections.map((section) => ({
        title: getTranslated(section.titre),
        description: getTranslated(section.paragraphe)
      }))
    : fallbackSections;
  
  return (
    <section id="privacy" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-muted/30">
      {/* A subtle gradient background to enhance the visual appeal. */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background/50 to-muted/30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Animated section header. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Animated shield icon. */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6 shadow-lg"
          >
            <Shield className="w-10 h-10 text-primary" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("privacy.title")}
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t("privacy.subtitle")}
          </p>
        </motion.div>

        {/* Grid of privacy feature cards. */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {privacyFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              {/* Animated card with hover effects. */}
              <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl h-full">
                {/* A subtle gradient overlay that appears on hover. */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated call-to-action section to read the full privacy policy. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-card border border-border rounded-2xl p-8 max-w-3xl mx-auto"
        >
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            {t("privacy.description")}
          </p>
          <Link to="/privacy-policy">
            <Button variant="cta" size="lg" className="group">
              {t("privacy.readMore")}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
