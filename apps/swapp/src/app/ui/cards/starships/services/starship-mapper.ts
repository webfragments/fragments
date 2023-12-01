import { camelToSnake } from '../../../../common';
import { Card, CardProperty } from '../../base/models/card';
import { StarshipProps } from '../models/starship-props';
import { StarshipDetailResult } from '../../../../api/starships';

const cardPropertyKeys: StarshipProps[] = ['length', 'starshipClass', 'crew'];

export const mapStarship = (model: StarshipDetailResult): Card => {
  if (!model) {
    return null;
  }

  return {
    title: model.name,
    subtitle: model.model,
    properties: cardPropertyKeys.reduce(
      (prev, key: StarshipProps) => ({
        ...prev,
        [key]: mapToCardProperty(key, model[key]),
      }),
      {}
    ),
  };
};

const mapToCardProperty = (
  key: StarshipProps,
  value: unknown
): CardProperty => {
  return {
    translationKey: getTranslationKey(key),
    value: getValue(value),
    rawValue: value,
  };
};

const getTranslationKey = (key: StarshipProps): string => {
  const translationKey = camelToSnake(key).toUpperCase();

  return `CARDS.STARSHIPS.${translationKey}`;
};

const getValue = <T>(value: T): string => {
  return value?.toString();
};
