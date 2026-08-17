import { useTranslation } from '@/i18n';
import type { FeedSubtype } from '@/types/record';

export function useFeedSubtypeLabels(): Record<FeedSubtype, string> {
  const { t } = useTranslation();

  return {
    breastfeeding: t('feedSubtypes.breastfeeding'),
    extra_breast_milk: t('feedSubtypes.extraBreastMilk'),
    extra_formula: t('feedSubtypes.extraFormula'),
  };
}
