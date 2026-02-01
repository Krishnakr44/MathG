/**
 * MathG — Expression Parser Tests
 * Valid and invalid input examples
 */

import { parseMathExpression } from '../index';

describe('parseMathExpression', () => {
  describe('valid input', () => {
    it('parses simple linear: y = x + 2', () => {
      const result = parseMathExpression('y = x + 2');
      expect(result.errors).toBeUndefined();
      expect(result.normalizedExpression).toContain('x');
      expect(result.evaluate(0)).toBe(2);
      expect(result.evaluate(1)).toBe(3);
      expect(result.domainInfo.isDefined).toBe(true);
    });

    it('parses sin(x)', () => {
      const result = parseMathExpression('y = sin(x)');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0)).toBe(0);
      expect(result.evaluate(Math.PI / 2)).toBeCloseTo(1);
      expect(result.domainInfo.isDefined).toBe(true);
    });

    it('parses teacher-style sinx', () => {
      const result = parseMathExpression('sinx');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0)).toBe(0);
    });

    it('parses teacher-style sin x + 1', () => {
      const result = parseMathExpression('sin x + 1');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0)).toBe(1);
    });

    it('parses implicit multiplication: 2x', () => {
      const result = parseMathExpression('y = 2x');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(3)).toBe(6);
    });

    it('parses power: x^2 + 2x + 1', () => {
      const result = parseMathExpression('x^2 + 2*x + 1');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0)).toBe(1);
      expect(result.evaluate(1)).toBe(4);
    });

    it('parses tan(x) with domain info', () => {
      const result = parseMathExpression('y = tan(x)');
      expect(result.errors).toBeUndefined();
      expect(result.domainInfo.isDefined).toBe(false);
      expect(result.domainInfo.undefinedPoints).toBeDefined();
      expect(result.domainInfo.reason).toContain('asymptote');
    });

    it('parses cosec(x) with undefined points', () => {
      const result = parseMathExpression('y = cosec(x)');
      expect(result.errors).toBeUndefined();
      expect(result.domainInfo.undefinedPoints).toContain(0);
      expect(result.evaluate(0)).toBeUndefined();
    });

    it('parses sqrt(x)', () => {
      const result = parseMathExpression('y = sqrt(x)');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(4)).toBe(2);
      expect(result.evaluate(-1)).toBeUndefined();
    });

    it('parses pi constant', () => {
      const result = parseMathExpression('y = pi');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0)).toBeCloseTo(Math.PI);
    });

    it('parses e constant', () => {
      const result = parseMathExpression('y = e');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0)).toBeCloseTo(Math.E);
    });

    it('parses teacher-style sin2x', () => {
      const result = parseMathExpression('sin2x');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(Math.PI / 4)).toBeCloseTo(Math.sin(Math.PI / 2));
    });

    it('parses with parameters: a*sin(x) + b', () => {
      const result = parseMathExpression('y = a*sin(x) + b');
      expect(result.errors).toBeUndefined();
      expect(result.evaluate(0, { a: 2, b: 1 })).toBe(1);
    });
  });

  describe('invalid input', () => {
    it('rejects empty input', () => {
      const result = parseMathExpression('');
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
      expect(result.evaluate(0)).toBeUndefined();
    });

    it('rejects multiple variables', () => {
      const result = parseMathExpression('y = x + z');
      expect(result.errors).toBeDefined();
    });

    it('rejects calculus operations', () => {
      const result = parseMathExpression('y = diff(x^2)');
      expect(result.errors).toBeDefined();
    });

    it('rejects eval', () => {
      const result = parseMathExpression('eval("1+1")');
      expect(result.errors).toBeDefined();
    });

    it('rejects unbalanced parentheses', () => {
      const result = parseMathExpression('sin(x');
      expect(result.errors).toBeDefined();
    });

    it('rejects unsupported function', () => {
      const result = parseMathExpression('y = unknown(x)');
      expect(result.errors).toBeDefined();
    });
  });

  describe('safe evaluation', () => {
    it('returns undefined for division by zero', () => {
      const result = parseMathExpression('y = 1/x');
      expect(result.evaluate(0)).toBeUndefined();
    });

    it('returns undefined for sqrt of negative', () => {
      const result = parseMathExpression('y = sqrt(x)');
      expect(result.evaluate(-1)).toBeUndefined();
    });

    it('never throws', () => {
      const result = parseMathExpression('y = sin(x)');
      expect(() => result.evaluate(NaN)).not.toThrow();
      expect(() => result.evaluate(Infinity)).not.toThrow();
    });
  });
});
