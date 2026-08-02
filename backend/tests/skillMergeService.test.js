const test = require('node:test');
const assert = require('node:assert/strict');

const { buildMergedSkillList } = require('../services/skillMergeService');

test('buildMergedSkillList preserves manual skills and merges resume skills without duplicates', () => {
  const result = buildMergedSkillList(
    [' React ', 'Node.js', 'Python', '  JavaScript '],
    ['react', 'MongoDB', 'Node.js', '   Java   ']
  );

  assert.deepEqual(result, ['React', 'Node.js', 'Python', 'JavaScript', 'MongoDB', 'Java']);
});
