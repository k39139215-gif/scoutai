import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

// 1. Competency Dimension Calculation Logic (Mirrors CompetencyRadarChart)
const getCandidateCompetencies = (candidate, weights) => {
  const hasBackend = candidate.skills.some((s) => /distributed|cloud|backend|architect|microservices|golang|rust|node/i.test(s));
  const hasFrontend = candidate.skills.some((s) => /test|clean|react|typescript|next|vue/i.test(s));
  
  const wArch = weights ? weights.arch / 20 : 1;
  const wCode = weights ? weights.code / 20 : 1;
  const wScale = weights ? weights.scale / 20 : 1;
  const wLead = weights ? weights.lead / 20 : 1;
  const wDomain = weights ? weights.domain / 20 : 1;

  const arch = Math.min(99, Math.max(50, Math.round((candidate.matchScore * 0.96 + (hasBackend ? 7 : 1)) * wArch)));
  const code = Math.min(99, Math.max(50, Math.round((candidate.matchScore * 0.94 + (hasFrontend ? 6 : 2)) * wCode)));
  const scale = Math.min(99, Math.max(50, Math.round((candidate.experienceYears * 4.5 + candidate.matchScore * 0.48) * wScale)));
  const lead = Math.min(98, Math.max(50, Math.round((candidate.matchScore * 0.88 + (candidate.experienceYears > 6 ? 9 : 3)) * wLead)));
  const domain = Math.min(99, Math.max(50, Math.round((candidate.matchScore * 0.95 + Math.min(candidate.skills.length * 2, 7)) * wDomain)));

  return [
    { label: 'Systems Architecture', shortLabel: 'Architecture', score: arch },
    { label: 'Code Craftsmanship', shortLabel: 'Code Craft', score: code },
    { label: 'Scalability & Performance', shortLabel: 'Scalability', score: scale },
    { label: 'Leadership & Collaboration', shortLabel: 'Leadership', score: lead },
    { label: 'Domain Velocity', shortLabel: 'Domain Fit', score: domain },
  ];
};

// 2. Filter Conjunction/Disjunction Logic (Mirrors TalentStudioView)
const evaluateCandidate = (c, filterRules, filterLogic) => {
  if (filterRules.length === 0) return true;

  const matchesRule = (rule) => {
    if (rule.field === 'matchScore') {
      const val = Number(rule.value) || 0;
      if (rule.operator === 'gte') return c.matchScore >= val;
      if (rule.operator === 'lte') return c.matchScore <= val;
      if (rule.operator === 'equals') return c.matchScore === val;
    } else if (rule.field === 'experienceYears') {
      const val = Number(rule.value) || 0;
      if (rule.operator === 'gte') return c.experienceYears >= val;
      if (rule.operator === 'lte') return c.experienceYears <= val;
      if (rule.operator === 'equals') return c.experienceYears === val;
    } else if (rule.field === 'location') {
      const val = rule.value.toLowerCase().trim();
      if (rule.operator === 'equals') return c.location.toLowerCase() === val;
      return c.location.toLowerCase().includes(val);
    } else if (rule.field === 'status') {
      const val = rule.value.toLowerCase().trim();
      if (rule.operator === 'equals') return c.status.toLowerCase() === val;
      return c.status.toLowerCase().includes(val);
    }
    return true;
  };

  if (filterLogic === 'AND') {
    return filterRules.every(matchesRule);
  } else {
    return filterRules.some(matchesRule);
  }
};

describe('Talent Studio Competency Radar Logic', () => {
  const mockCandidate = {
    id: 'cand-1',
    name: 'Aarav Sharma',
    title: 'Staff Distributed Systems Engineer',
    matchScore: 94,
    experienceYears: 8,
    location: 'Bangalore, India',
    status: 'Shortlisted',
    skills: ['Distributed Systems', 'Go', 'Kubernetes', 'Clean Architecture'],
  };

  it('computes 5 distinct competency dimensions within [50, 99] bounds', () => {
    const competencies = getCandidateCompetencies(mockCandidate);
    assert.equal(competencies.length, 5);
    competencies.forEach((dim) => {
      assert.ok(dim.score >= 50, `Score ${dim.score} should be >= 50`);
      assert.ok(dim.score <= 99, `Score ${dim.score} should be <= 99`);
    });
  });

  it('dynamically responds to rubric calibration weights (Ref 02)', () => {
    const baseline = getCandidateCompetencies(mockCandidate);
    const boostedWeights = { arch: 28, code: 20, scale: 20, lead: 20, domain: 20 };
    const boosted = getCandidateCompetencies(mockCandidate, boostedWeights);

    const baseArch = baseline.find((d) => d.shortLabel === 'Architecture').score;
    const boostedArch = boosted.find((d) => d.shortLabel === 'Architecture').score;

    assert.ok(boostedArch >= baseArch, `Boosted arch (${boostedArch}) should be >= baseline (${baseArch})`);
  });
});

describe('Talent Studio Filter Conjunction / Disjunction Logic (Ref 01)', () => {
  const candidate1 = {
    name: 'Aarav Sharma',
    matchScore: 94,
    experienceYears: 8,
    location: 'Bangalore, India',
    status: 'Shortlisted',
  };

  const candidate2 = {
    name: 'Meera Patel',
    matchScore: 82,
    experienceYears: 4,
    location: 'Mumbai, India',
    status: 'Applied',
  };

  const rules = [
    { field: 'matchScore', operator: 'gte', value: '90' },
    { field: 'experienceYears', operator: 'gte', value: '7' },
  ];

  it('evaluates AND logic strictly requiring all rules to pass', () => {
    assert.equal(evaluateCandidate(candidate1, rules, 'AND'), true);
    assert.equal(evaluateCandidate(candidate2, rules, 'AND'), false);
  });

  it('evaluates OR logic permitting any matching rule to pass', () => {
    const mixedRules = [
      { field: 'matchScore', operator: 'gte', value: '95' }, // Aarav has 94 (fails)
      { field: 'experienceYears', operator: 'gte', value: '6' }, // Aarav has 8 (passes)
    ];

    assert.equal(evaluateCandidate(candidate1, mixedRules, 'AND'), false);
    assert.equal(evaluateCandidate(candidate1, mixedRules, 'OR'), true);
  });

  it('handles empty rules gracefully as open pass', () => {
    assert.equal(evaluateCandidate(candidate2, [], 'AND'), true);
    assert.equal(evaluateCandidate(candidate2, [], 'OR'), true);
  });
});
