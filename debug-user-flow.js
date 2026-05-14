const Calculator = require('./src/calculator.js');

// 创建简化的测试环境
global.document = {
    getElementById: () => ({ 
        textContent: '', 
        addEventListener: () => {}, 
        classList: { toggle: () => {} } 
    }),
    querySelectorAll: () => [],
    addEventListener: () => {},
    createElement: () => ({ textContent: '', innerHTML: '' })
};
global.window = { addEventListener: () => {} };
global.localStorage = { getItem: () => null, setItem: () => {} };

// 创建计算器实例
const calc = new Calculator();

console.log("测试流程：π ^ π = ?");
console.log("==================");

// 模拟用户点击 π 按钮
console.log("\n步骤1: 点击 π");
calc.appendToDisplay('pi');
console.log("  expression:", calc.expression);
console.log("  currentValue:", calc.currentValue);

// 模拟用户点击 ^ (x^y) 按钮
console.log("\n步骤2: 点击 x^y");
calc.appendToDisplay('pow');
console.log("  expression:", calc.expression);
console.log("  currentValue:", calc.currentValue);

// 模拟用户再次点击 π 按钮
console.log("\n步骤3: 再次点击 π");
calc.appendToDisplay('pi');
console.log("  expression:", calc.expression);
console.log("  currentValue:", calc.currentValue);

// 模拟用户点击 = 按钮
console.log("\n步骤4: 点击 =");
calc.calculateResult();
console.log("  expression:", calc.expression);
console.log("  currentValue:", calc.currentValue);
console.log("  display:", calc.display.textContent);
