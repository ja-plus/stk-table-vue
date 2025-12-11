import { useData } from 'vitepress';
import { computed } from 'vue';
import { en } from './en';
import { zh } from './zh';

interface LanguagePack {
    [key: string]: string;
}

interface I18nConfig {
    [locale: string]: LanguagePack;
}

export function useI18n(localeConfig: I18nConfig = { en, zh }) {
    const { lang } = useData();

    const t = (key: string, defaultValue: string = key): string => {
        const currentLang = lang.value;
        return localeConfig[currentLang]?.[key] || localeConfig['en']?.[key] || defaultValue;
    };

    const getCurrentLang = (): string => {
        return lang.value;
    };

    const isZH = computed(() => {
        return lang.value === 'zh';
    });

    const isEN = computed(() => {
        return lang.value === 'en';
    });

    return {
        t,
        getCurrentLang,
        isZH,
        isEN,
    };
}
