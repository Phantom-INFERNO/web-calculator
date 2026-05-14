const Calculator = require('../src/calculator');

describe('Calculator', () => {
    let calculator;

    beforeEach(() => {
        const mockElement = { 
            textContent: '', 
            addEventListener: () => {},
            classList: { toggle: () => {} }
        };
        global.document = {
            getElementById: () => mockElement,
            querySelectorAll: () => [],
            addEventListener: () => {},
            createElement: () => ({ textContent: '', innerHTML: '' })
        };
        global.window = { addEventListener: () => {} };
        global.localStorage = { getItem: () => null, setItem: () => {} };
        
        calculator = new Calculator();
    });

    describe('Basic Arithmetic Operations', () => {
        test('TC001: 1 + 1 should equal 2', () => {
            expect(calculator.calculate('1+1')).toBe(2);
        });

        test('TC002: 10 - 3 should equal 7', () => {
            expect(calculator.calculate('10-3')).toBe(7);
        });

        test('TC003: 5 * 4 should equal 20', () => {
            expect(calculator.calculate('5*4')).toBe(20);
        });

        test('TC004: 10 / 2 should equal 5', () => {
            expect(calculator.calculate('10/2')).toBe(5);
        });

        test('TC005: 8.2 + 1.8 should equal 10', () => {
            expect(calculator.calculate('8.2+1.8')).toBe(10);
        });

        test('TC006: High precision addition', () => {
            const result = calculator.calculate('1.234567890123456789+9.876543210987654321');
            expect(result).toBeCloseTo(11.111111101111111, 10);
        });

        test('TC007: Expression with parentheses', () => {
            expect(calculator.calculate('1*(3-1)')).toBe(2);
        });

        test('TC008: Power operation', () => {
            expect(calculator.calculate('2^3')).toBe(8);
        });

        test('TC009: Square root', () => {
            expect(calculator.calculate('sqrt(144)')).toBe(12);
        });

        test('TC010: Percentage', () => {
            expect(calculator.calculate('45%')).toBe(0.45);
        });
    });

    describe('Trigonometric Functions (DEG mode)', () => {
        beforeEach(() => {
            calculator.mode = 'deg';
        });

        test('TC011: sin(90) should equal 1', () => {
            expect(calculator.calculate('sin(90)')).toBeCloseTo(1, 10);
        });

        test('TC012: cos(90) should equal 0', () => {
            expect(Math.abs(calculator.calculate('cos(90)'))).toBeLessThan(0.0000001);
        });

        test('TC013: tan(45) should equal 1', () => {
            expect(calculator.calculate('tan(45)')).toBeCloseTo(1, 10);
        });

        test('TC014: sin(30) should equal 0.5', () => {
            expect(calculator.calculate('sin(30)')).toBeCloseTo(0.5, 10);
        });

        test('TC015: cos(60) should equal 0.5', () => {
            expect(calculator.calculate('cos(60)')).toBeCloseTo(0.5, 10);
        });
    });

    describe('Trigonometric Functions (RAD mode)', () => {
        beforeEach(() => {
            calculator.mode = 'rad';
        });

        test('TC016: sin(π/2) should equal 1', () => {
            expect(calculator.calculate('sin(' + Math.PI/2 + ')')).toBeCloseTo(1, 10);
        });

        test('TC017: cos(π) should equal -1', () => {
            expect(calculator.calculate('cos(' + Math.PI + ')')).toBeCloseTo(-1, 10);
        });

        test('TC018: tan(π/4) should equal 1', () => {
            expect(calculator.calculate('tan(' + Math.PI/4 + ')')).toBeCloseTo(1, 10);
        });
    });

    describe('Inverse Trigonometric Functions', () => {
        beforeEach(() => {
            calculator.mode = 'deg';
        });

        test('TC019: arcsin(0) should equal 0', () => {
            expect(calculator.calculate('asin(0)')).toBeCloseTo(0, 10);
        });

        test('TC020: arccos(0) should equal 90 in DEG mode', () => {
            expect(calculator.calculate('acos(0)')).toBeCloseTo(90, 10);
        });

        test('TC021: arctan(0) should equal 0', () => {
            expect(calculator.calculate('atan(0)')).toBeCloseTo(0, 10);
        });
    });

    describe('Scientific Constants', () => {
        test('TC022: π should equal Math.PI', () => {
            expect(calculator.calculate('π')).toBe(Math.PI);
        });

        test('TC023: e should equal Math.E', () => {
            expect(calculator.calculate('e')).toBe(Math.E);
        });
    });

    describe('Logarithmic and Exponential Functions', () => {
        test('TC024: log(100) should equal 2', () => {
            expect(calculator.calculate('log(100)')).toBeCloseTo(2, 10);
        });

        test('TC025: ln(e) should equal 1', () => {
            expect(calculator.calculate('ln(' + Math.E + ')')).toBeCloseTo(1, 10);
        });

        test('TC026: e^0 should equal 1', () => {
            expect(calculator.calculate(Math.E + '^0')).toBe(1);
        });
    });

    describe('Factorial', () => {
        test('TC027: 3! should equal 6', () => {
            expect(calculator.calculate('3!')).toBe(6);
        });

        test('TC028: 5! should equal 120', () => {
            expect(calculator.calculate('5!')).toBe(120);
        });

        test('TC029: 0! should equal 1', () => {
            expect(calculator.calculate('0!')).toBe(1);
        });
    });

    describe('Boundary Conditions', () => {
        test('TC030: 0 / 0 should return NaN', () => {
            expect(isNaN(calculator.calculate('0/0'))).toBe(true);
        });

        test('TC031: 1 / 0 should return Infinity', () => {
            expect(calculator.calculate('1/0')).toBe(Infinity);
        });

        test('TC032: sqrt(-1) should return NaN', () => {
            expect(isNaN(calculator.calculate('sqrt(-1)'))).toBe(true);
        });

        test('TC033: log(0) should return -Infinity', () => {
            expect(calculator.calculate('log(0)')).toBe(-Infinity);
        });
    });

    describe('High Precision Calculations', () => {
        test('TC035: 0.1 + 0.2 should equal 0.3', () => {
            const result = calculator.calculate('0.1+0.2');
            expect(result).toBeCloseTo(0.3, 15);
        });

        test('TC036: π * 2 should have high precision', () => {
            const result = calculator.calculate('π*2');
            expect(result).toBeCloseTo(Math.PI * 2, 15);
            expect(result.toString().split('.')[1].length).toBeGreaterThanOrEqual(15);
        });

        test('TC037: e^10 should have high precision', () => {
            const result = calculator.calculate('e^10');
            expect(result).toBeCloseTo(Math.pow(Math.E, 10), 10);
        });

        test('π^π should calculate correctly', () => {
            const result = calculator.calculate('π^π');
            expect(result).toBeCloseTo(Math.pow(Math.PI, Math.PI), 10);
            expect(result).not.toBeNaN();
        });
    });

    describe('Reciprocal Trigonometric Functions', () => {
        beforeEach(() => {
            calculator.mode = 'deg';
        });

        test('csc(60) should equal 1/sin(60)', () => {
            const cscResult = calculator.calculate('csc(60)');
            const sinResult = calculator.calculate('sin(60)');
            expect(cscResult).toBeCloseTo(1 / sinResult, 10);
        });

        test('sec(45) should equal 1/cos(45)', () => {
            const secResult = calculator.calculate('sec(45)');
            const cosResult = calculator.calculate('cos(45)');
            expect(secResult).toBeCloseTo(1 / cosResult, 10);
        });

        test('cot(60) should equal 1/tan(60)', () => {
            const cotResult = calculator.calculate('cot(60)');
            const tanResult = calculator.calculate('tan(60)');
            expect(cotResult).toBeCloseTo(1 / tanResult, 10);
        });
    });

    describe('Cube Root', () => {
        test('cbrt(8) should equal 2', () => {
            expect(calculator.calculate('cbrt(8)')).toBe(2);
        });

        test('cbrt(-8) should equal -2', () => {
            expect(calculator.calculate('cbrt(-8)')).toBe(-2);
        });
    });

    describe('Conversion Methods', () => {
        test('degToRad should convert degrees to radians', () => {
            expect(calculator.degToRad(180)).toBe(Math.PI);
            expect(calculator.degToRad(90)).toBe(Math.PI / 2);
        });

        test('radToDeg should convert radians to degrees', () => {
            expect(calculator.radToDeg(Math.PI)).toBe(180);
            expect(calculator.radToDeg(Math.PI / 2)).toBe(90);
        });
    });

    describe('Factorial Method', () => {
        test('factorial of negative number should return NaN', () => {
            expect(isNaN(calculator.factorial(-1))).toBe(true);
        });

        test('factorial of large number', () => {
            expect(calculator.factorial(10)).toBe(3628800);
        });
    });

    describe('Format Number', () => {
        test('formatNumber should handle NaN', () => {
            expect(calculator.formatNumber(NaN)).toBe('NaN');
        });

        test('formatNumber should handle Infinity', () => {
            expect(calculator.formatNumber(Infinity)).toBe('Infinity');
            expect(calculator.formatNumber(-Infinity)).toBe('-Infinity');
        });

        test('formatNumber should handle high precision numbers', () => {
            const pi = Math.PI;
            const formatted = calculator.formatNumber(pi);
            expect(formatted.split('.')[1].length).toBeGreaterThanOrEqual(15);
        });

        test('formatNumber should handle integers', () => {
            expect(calculator.formatNumber(42)).toBe('42');
        });
    });
});
