/**
 * Content sugar (ScriptureQuestionList, NextSteps) must be expanded to regular
 * contents by ScreenService at load — the component registry never sees it.
 */

import { getAppScreens, getScreenData } from '../src/services/ScreenService';

it('leaves no sugar types anywhere in the loaded screen map', () => {
  const sugarTypes: string[] = [];
  for (const [path, screen] of getAppScreens().screens) {
    (function walk(value: any) {
      if (Array.isArray(value)) return value.forEach(walk);
      if (value && typeof value === 'object') {
        if (
          value.type === 'ScriptureQuestionList' ||
          value.type === 'NextSteps'
        )
          sugarTypes.push(`${path}: ${value.type}`);
        Object.entries(value).forEach(
          ([key, v]) => key !== 'subscreens' && walk(v),
        );
      }
    })((screen as any).contents);
  }
  expect(sugarTypes).toEqual([]);
});

it('expands ScriptureQuestionList into ScriptureSlides with the shared question', () => {
  const screen: any = getScreenData('app:/Home/Basics/Prayer/WhyShouldWePray');
  const slides = screen.contents.filter(
    (c: any) => c.type === 'ScriptureSlide',
  );
  expect(slides.length).toBeGreaterThanOrEqual(6);
  slides.forEach((slide: any) => {
    expect(slide.scripture.hiddenButton.text).toBe('Why should we pray?');
  });
});

it('expands NextSteps into the standard next-steps toggle', () => {
  const screen: any = getScreenData(
    'app:/Home/Resources/Intentionality/IntentionalityBeginning',
  );
  const toggles: any[] = [];
  (function walk(value: any) {
    if (Array.isArray(value)) return value.forEach(walk);
    if (value && typeof value === 'object') {
      if (value.type === 'ToggleButton') toggles.push(value);
      Object.values(value).forEach(walk);
    }
  })(screen.contents);
  expect(toggles.length).toBeGreaterThanOrEqual(3);
  toggles.forEach(toggle => {
    expect(toggle.text).toBe('next steps');
    expect(toggle.design).toBe('answer');
    expect(toggle.altButtons[0].text).toContain('\n');
  });
});
