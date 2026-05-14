const Calculator = require('./src/calculator.js');

// 创建一个简化的测试环境
global.document = {
    getElementById: () => ({ textContent: '', addEventListener: () => {}, classList: { toggle: () => {} } }),
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => ({ textContent: '', innerHTML: '' })
};
global.window = { addEventListener: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {} };

const calc = new Calculator();

// 测试 π^π
console.log("Testing: π^π");

// 模拟 calculate 函数的执行
const expr = "π^π";
console.log("Original expression:", expr);

// 测试替换
let processedExpr = expr.replace(/π/g, Math.PI.toString());
processedExpr = processedExpr.replace(/\be\b/g, Math.E.toString());
console.log("Processed expression:", processedExpr);

// 测试 tokenize
const tokens = calc.tokenize(processedExpr);
console.log("Tokens:", tokens);

// 测试 shuntingYard
const postfix = calc.shuntingYard(tokens);
console.log("Postfix:", postfix);

// 测试 evaluatePostfix
try {
    const result = calc.evaluatePostfix(postfix);
    console.log("Result:", result);
    console.log("Formatted:", calc.formatNumber(result));
} catch (e) {
    console.error("Error:", e);
}
