import { describe, it, expect } from 'vitest';
import { buildItineraryPrompt } from '@/lib/promptBuilder';
import type { TravelPreferences } from '@/types/preferences';

const basePrefs: TravelPreferences = {
  destination: 'Tokyo, Japan',
  startDate: '2026-06-01',
  endDate: '2026-06-08',
  travelers: 2,
  tripType: 'cultural',
  budget: 'mid-range',
  pace: 'moderate',
  interests: ['🍜 Food & Cuisine', '🏛️ History & Culture'],
};

describe('buildItineraryPrompt', () => {
  it('includes the destination', () => {
    expect(buildItineraryPrompt(basePrefs)).toContain('Tokyo, Japan');
  });

  it('calculates the correct number of days and nights', () => {
    const prompt = buildItineraryPrompt(basePrefs);
    expect(prompt).toContain('8 days');
    expect(prompt).toContain('7 nights');
  });

  it('includes the traveller count', () => {
    expect(buildItineraryPrompt(basePrefs)).toContain('2 people');
  });

  it('uses singular "person" for 1 traveller', () => {
    expect(buildItineraryPrompt({ ...basePrefs, travelers: 1 })).toContain('1 person');
  });

  it('strips emoji from interests', () => {
    const prompt = buildItineraryPrompt(basePrefs);
    expect(prompt).toContain('Food & Cuisine');
    expect(prompt).not.toContain('🍜');
  });

  it('includes all selected interests', () => {
    const prompt = buildItineraryPrompt(basePrefs);
    expect(prompt).toContain('Food & Cuisine');
    expect(prompt).toContain('History & Culture');
  });

  it('includes optional notes when provided', () => {
    const prompt = buildItineraryPrompt({ ...basePrefs, notes: 'We have a toddler' });
    expect(prompt).toContain('We have a toddler');
  });

  it('omits notes line when not provided', () => {
    expect(buildItineraryPrompt(basePrefs)).not.toContain('Special notes');
  });

  it('reflects the correct budget description', () => {
    expect(buildItineraryPrompt({ ...basePrefs, budget: 'luxury' })).toContain('luxury');
    expect(buildItineraryPrompt({ ...basePrefs, budget: 'budget' })).toContain('budget-conscious');
  });

  it('reflects the correct pace description', () => {
    expect(buildItineraryPrompt({ ...basePrefs, pace: 'packed' })).toContain('packed');
    expect(buildItineraryPrompt({ ...basePrefs, pace: 'slow' })).toContain('leisurely');
  });
});
