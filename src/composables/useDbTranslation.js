import { useI18n } from 'vue-i18n';

export function useDbTranslation() {
  const { locale } = useI18n();

  const tDb = (model, field) => {
    if (!model) return '';

    if (locale.value === 'en') {
      const englishField = `${field}_en`;
      if (model[englishField]) {
        return model[englishField];
      }
    }

    return model[field] || '';
  };

  return { tDb };
}
