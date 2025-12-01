import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/contexts/TranslationContext";
import { usePrivacyPolicy } from "@/hooks/usePrivacyPolicy";

const PrivacyPolicy = () => {
  const { t, language } = useTranslation();
  const { data: privacyData } = usePrivacyPolicy();

  type TranslatableField = { fr?: string; ar?: string; en?: string; } | undefined | {};
  type Language = 'en' | 'fr' | 'ar';

  const getTranslated = (field: TranslatableField, fallback: string = ''): string => {
    if (!field || typeof field !== 'object') return fallback;
    const translated = field[language as Language] || field['en'] || field['fr'] || field['ar'];
    return translated || fallback;
  };

  const getTitleFromData = (titleData: any, fallback: string = ''): string => {
    if (!titleData) return fallback;
    // Handle array format: [{ lang: "en", value: "..." }]
    if (Array.isArray(titleData)) {
      const titleObj = titleData.find(t => t.lang === language) || titleData.find(t => t.lang === 'en') || titleData[0];
      return titleObj?.value || fallback;
    }
    // Handle object format: { en: "...", fr: "...", ar: "..." }
    if (typeof titleData === 'object') {
      return getTranslated(titleData, fallback);
    }
    return fallback;
  };

  const getContentSections = () => {
    if (!privacyData?.contenu) return [];
    // Handle array format with sections
    if (Array.isArray(privacyData.contenu)) {
      return privacyData.contenu.filter(section => section.type === 'section');
    }
    return [];
  };

  const getIntroText = () => {
    if (!privacyData?.contenu) return '';
    // Handle array format with intro
    if (Array.isArray(privacyData.contenu)) {
      const intro = privacyData.contenu.find(section => section.type === 'intro');
      return intro?.text ? getTranslated(intro.text) : '';
    }
    // Handle simple object format
    if (typeof privacyData.contenu === 'object' && !Array.isArray(privacyData.contenu)) {
      return getTranslated(privacyData.contenu);
    }
    return '';
  };

  const hasApiContent = privacyData && (getIntroText() || getContentSections().length > 0);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              {t('privacyPage.backToHome')}
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {getTitleFromData(privacyData?.titre, t('privacyPage.title'))}
            </h1>
            <p className="text-muted-foreground mb-8">
              {privacyData?.date_creation 
                ? `${t('privacyPage.lastUpdated')} ${new Date(privacyData.date_creation).toLocaleDateString('en-GB')}`
                : `${t('privacyPage.lastUpdated')} ${new Date().toLocaleDateString('en-GB')}`
              }
              {privacyData?.version && ` - Version ${privacyData.version}`}
            </p>
            {hasApiContent && getIntroText() && (
              <div className="text-muted-foreground mb-12 whitespace-pre-line leading-relaxed">
                {getIntroText()}
              </div>
            )}

            {hasApiContent && getContentSections().length > 0 && (
              <div className="space-y-12">
                {getContentSections().map((section, index) => (
                  <section key={index}>
                    <h2 className="text-2xl font-semibold mb-4">{getTranslated(section.titre)}</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {getTranslated(section.paragraphe)}
                    </p>
                  </section>
                ))}
              </div>
            )}

            {!hasApiContent && (
              <>
                <p className="text-muted-foreground mb-12">
                  {t('privacyPage.intro')}
                </p>

                <div className="space-y-12">
              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section1Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section1Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section2Title')}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacyPage.section2Intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ltr:ml-4 rtl:mr-4">
                  <li>{t('privacyPage.section2Item1')}</li>
                  <li>{t('privacyPage.section2Item2')}</li>
                  <li>{t('privacyPage.section2Item3')}</li>
                  <li>{t('privacyPage.section2Item4')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section3Title')}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacyPage.section3Intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ltr:ml-4 rtl:mr-4">
                  <li>{t('privacyPage.section3Item1')}</li>
                  <li>{t('privacyPage.section3Item2')}</li>
                  <li>{t('privacyPage.section3Item3')}</li>
                  <li>{t('privacyPage.section3Item4')}</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {t('privacyPage.section3Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section4Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section4Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section5Title')}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacyPage.section5Intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ltr:ml-4 rtl:mr-4">
                  <li>{t('privacyPage.section5Item1')}</li>
                  <li>{t('privacyPage.section5Item2')}</li>
                  <li>{t('privacyPage.section5Item3')}</li>
                  <li>{t('privacyPage.section5Item4')}</li>
                  <li>{t('privacyPage.section5Item5')}</li>
                  <li>{t('privacyPage.section5Item6')}</li>
                  <li>{t('privacyPage.section5Item7')}</li>
                  <li>{t('privacyPage.section5Item8')}</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section6Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section6Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section7Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section7Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section8Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section8Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section9Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section9Text')}
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.section10Title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {t('privacyPage.section10Text')}
                </p>
              </section>

              <section className="pt-8 border-t border-border">
                <h2 className="text-2xl font-semibold mb-4">{t('privacyPage.contactTitle')}</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {t('privacyPage.contactIntro')}
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>{t('privacyPage.contactEmail')}</p>
                  <p>{t('privacyPage.contactPhone')}</p>
                  <p>{t('privacyPage.contactAddress')}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  {t('privacyPage.contactOutro')}
                </p>
              </section>
            </div>
              </>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
