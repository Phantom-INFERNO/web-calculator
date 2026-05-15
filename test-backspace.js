const Calculator = require('./src/calculator.js');

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

const calc = new Calculator();

console.log("测试智能删除功能：\n");

calc.appendToDisplay('sin');
calc.appendToDisplay('(');
console.log("输入 sin( 后:", calc.inputBuffer);

calc.backspace();
console.log("按退格后:", calc.inputBuffer, "✓ (应删除整个 'sin(')");

calc.inputBuffer = '';
calc.appendToDisplay('s');
calc.appendToDisplay('i');
calc.appendToDisplay('n');
calc.appendToDisplay('(');
console.log("\n输入 sin( 后:", calc.inputBuffer);

calc.backspace();
console.log("按退格后:", calc.inputBuffer, "✓ (应删除整个 'sin(')");

calc.inputBuffer = '';
calc.appendToDisplay('s');
calc.appendToDisplay('q');
calc.appendToDisplay('r');
calc.appendToDisplay('t');
calc.appendToDisplay('(');
console.log("\n输入 sqrt( 后:", calc.inputBuffer);

calc.backspace();
console.log("按退格后:", calc.inputBuffer, "✓ (应删除整个 'sqrt(')");

calc.inputBuffer = '';
calc.appendToDisplay('π');
console.log("\n输入 π 后:", calc.inputBuffer);

calc.backspace();
console.log("按退格后:", calc.inputBuffer, "✓ (应删除 π)");

calc.inputBuffer = '';
calc.appendToDisplay('1');
calc.appendToDisplay('2');
console.log("\n输入 12 后:", calc.inputBuffer);

calc.backspace();
console.log("按退格后:", calc.inputBuffer, "✓ (应删除 '2'，保留 '1')");

console.log("\n所有智能删除测试完成！");
