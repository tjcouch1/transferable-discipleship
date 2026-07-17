import { getSiblingScreenPath } from '../src/services/NavigationService';

const PRAYER = 'app:/Home/Basics/Prayer';

it('finds next and previous siblings', () => {
  expect(getSiblingScreenPath(`${PRAYER}/WhyShouldWePray`, 1)).toBe(
    `${PRAYER}/DoesGodAnswerPrayer`,
  );
  expect(getSiblingScreenPath(`${PRAYER}/DoesGodAnswerPrayer`, -1)).toBe(
    `${PRAYER}/WhyShouldWePray`,
  );
});

it('returns undefined at the ends', () => {
  expect(getSiblingScreenPath(`${PRAYER}/OpeningReflection`, -1)).toBeUndefined();
  expect(getSiblingScreenPath(`${PRAYER}/GrowingDependencePrayer`, 1)).toBeUndefined();
});

it('returns undefined for roots and unknown paths', () => {
  expect(getSiblingScreenPath('app:/Home', 1)).toBeUndefined();
  expect(getSiblingScreenPath('app:/Home/Nope', 1)).toBeUndefined();
});
