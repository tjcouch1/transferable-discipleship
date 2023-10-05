import { ROOT_PATH, pathJoin } from '../src/util/PathUtil';

describe('pathJoin', () => {
  it('ignores empty strings', () => {
    expect(pathJoin('', 'things/stuff')).toBe('things/stuff');
  });
  it('ignores redundant delimiters', () => {
    expect(pathJoin('////', 'things//stuff/')).toBe('things/stuff');
  });
  it('joins paths from root correctly', () => {
    expect(pathJoin(ROOT_PATH, 'stuff')).toBe(`${ROOT_PATH}/stuff`);
    expect(pathJoin(ROOT_PATH, '/stuff')).toBe(`${ROOT_PATH}/stuff`);
  });
  it('joins two paths correctly', () => {
    expect(pathJoin('things/', '/stuff')).toBe('things/stuff');
  });
  it('joins many paths correctly', () => {
    expect(pathJoin('things/', '/stuff', 'things/stuff/things')).toBe('things/stuff/things/stuff/things');
  });
  it('goes back correctly', () => {
    expect(pathJoin('things', 'stuff/wot', '..')).toBe('things/stuff');
  });
});
