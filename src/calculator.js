class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.expressionDisplay = document.getElementById('expression');
        this.currentValue = '0';
        this.expression = '';
        this.isResult = false;
        this.mode = 'deg';
        this.f2Mode = false;
        this.history = this.loadHistory();
        this.setupEventListeners();
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    addToHistory(expression, result) {
        this.history.unshift({ expression, result, timestamp: Date.now() });
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="text-gray-500 text-center">暂无历史记录</p>';
            return;
        }
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" data-expression="${encodeURIComponent(item.expression)}">
                <span class="history-expression">${this.escapeHtml(item.expression)}</span>
                <span class="history-result">${this.formatNumber(item.result)}</span>
            </div>
        `).join('');

        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const expr = decodeURIComponent(item.dataset.expression);
                this.expression = expr;
                this.expressionDisplay.textContent = expr;
                this.currentValue = this.calculate(expr);
                this.display.textContent = this.formatNumber(this.currentValue);
                this.isResult = true;
            });
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupEventListeners() {
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleButtonClick(btn.dataset.key));
        });

        document.getElementById('degBtn').addEventListener('click', () => this.setMode('deg'));
        document.getElementById('radBtn').addEventListener('click', () => this.setMode('rad'));
        document.getElementById('historyBtn').addEventListener('click', () => this.toggleHistory());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        document.getElementById('darkModeBtn').addEventListener('click', () => this.toggleDarkMode());

        window.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    setMode(mode) {
        this.mode = mode;
        document.getElementById('degBtn').classList.toggle('bg-cyan-600', mode === 'deg');
        document.getElementById('degBtn').classList.toggle('bg-gray-700', mode !== 'deg');
        document.getElementById('radBtn').classList.toggle('bg-cyan-600', mode === 'rad');
        document.getElementById('radBtn').classList.toggle('bg-gray-700', mode !== 'rad');
    }

    toggleHistory() {
        const panel = document.getElementById('historyPanel');
        panel.classList.toggle('hidden');
    }

    toggleDarkMode() {
        document.body.classList.toggle('light-mode');
    }

    handleButtonClick(key) {
        if (key === 'ac') {
            this.clear();
        } else if (key === 'backspace') {
            this.backspace();
        } else if (key === '=') {
            this.calculateResult();
        } else if (key === 'f2') {
            this.toggleF2Mode();
        } else {
            this.appendToDisplay(key);
        }
    }

    handleKeyPress(e) {
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
            '(': '(', ')': ')', 'Enter': '=', 'Backspace': 'backspace',
            'Escape': 'ac', 'F2': 'f2'
        };

        const mappedKey = keyMap[e.key];
        if (mappedKey) {
            e.preventDefault();
            this.handleButtonClick(mappedKey);
        }
    }

    toggleF2Mode() {
        this.f2Mode = !this.f2Mode;
        document.getElementById('f2Panel').classList.toggle('hidden', !this.f2Mode);
    }

    clear() {
        this.currentValue = '0';
        this.expression = '';
        this.isResult = false;
        this.display.textContent = '0';
        this.expressionDisplay.textContent = '';
    }

    backspace() {
        if (this.isResult) return;
        this.currentValue = this.currentValue.slice(0, -1) || '0';
        this.display.textContent = this.currentValue;
    }

    appendToDisplay(key) {
        if (this.isResult) {
            this.currentValue = '0';
            this.expression = '';
            this.isResult = false;
            this.expressionDisplay.textContent = '';
        }

        const funcMap = {
            'sin': 'sin(', 'cos': 'cos(', 'tan': 'tan(',
            'asin': 'asin(', 'acos': 'acos(', 'atan': 'atan(',
            'csc': 'csc(', 'sec': 'sec(', 'cot': 'cot(',
            'sqrt': 'sqrt(', 'cbrt': 'cbrt(',
            'log': 'log(', 'ln': 'ln(',
            'pi': 'π', 'e': 'e',
            'pow': '^', 'fact': '!'
        };

        const displayKey = funcMap[key] || key;

        if (key === 'sqrt') {
            this.expression += 'sqrt(';
            this.currentValue = '';
        } else if (key === 'cbrt') {
            this.expression += 'cbrt(';
            this.currentValue = '';
        } else if (key === 'pow') {
            this.expression += this.currentValue + '^';
            this.currentValue = '';
        } else if (key === 'fact') {
            this.currentValue += '!';
            this.expression += this.currentValue;
            this.calculateResult();
            return;
        } else if (key === 'pi') {
            if (this.currentValue !== '0') {
                this.expression += this.currentValue + '*π';
            } else {
                this.expression += 'π';
            }
            this.currentValue = '';
        } else if (key === 'e') {
            if (this.currentValue !== '0') {
                this.expression += this.currentValue + '*e';
            } else {
                this.expression += 'e';
            }
            this.currentValue = '';
        } else if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'csc', 'sec', 'cot', 'log', 'ln'].includes(key)) {
            this.expression += displayKey;
            this.currentValue = '';
        } else if (key === '%') {
            this.currentValue = (parseFloat(this.currentValue) / 100).toString();
        } else if (['+', '-', '*', '/', '^'].includes(key)) {
            this.expression += this.currentValue + key;
            this.currentValue = '';
        } else if (key === '(') {
            if (this.currentValue !== '0') {
                this.expression += this.currentValue + '*(';
            } else {
                this.expression += '(';
            }
            this.currentValue = '';
        } else if (key === ')') {
            this.expression += this.currentValue + ')';
            this.currentValue = '';
        } else {
            if (this.currentValue === '0' && key !== '.') {
                this.currentValue = key;
            } else if (key === '.' && this.currentValue.includes('.')) {
                return;
            } else {
                this.currentValue += key;
            }
        }

        this.display.textContent = this.currentValue || '0';
        this.expressionDisplay.textContent = this.expression;
    }

    calculateResult() {
        if (!this.expression && !this.currentValue) return;

        let fullExpression = this.expression + this.currentValue;
        
        try {
            const result = this.calculate(fullExpression);
            
            if (result === null || result === undefined || isNaN(result) || !isFinite(result)) {
                this.display.textContent = '错误';
            } else {
                const formattedResult = this.formatNumber(result);
                this.display.textContent = formattedResult;
                this.addToHistory(fullExpression, result);
            }
            
            this.expression = '';
            this.currentValue = result.toString();
            this.isResult = true;
        } catch (error) {
            this.display.textContent = '错误';
            this.expression = '';
            this.currentValue = '0';
            this.isResult = true;
        }
    }

    calculate(expr) {
        expr = expr.replace(/π/g, Math.PI.toString());
        expr = expr.replace(/\be\b/g, Math.E.toString());
        expr = expr.replace(/×/g, '*');
        expr = expr.replace(/÷/g, '/');

        const tokens = this.tokenize(expr);
        const postfix = this.shuntingYard(tokens);
        return this.evaluatePostfix(postfix);
    }

    tokenize(expr) {
        const tokens = [];
        let i = 0;
        const regex = /(\d+\.?\d*|[a-zA-Z]+|[+\-*/^()!%])/g;
        let match;
        
        while ((match = regex.exec(expr)) !== null) {
            tokens.push(match[1]);
        }
        
        return tokens;
    }

    shuntingYard(tokens) {
        const output = [];
        const operators = [];
        const precedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3, '_': 4 };
        
        const isFunction = (token) => ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'csc', 'sec', 'cot', 'sqrt', 'cbrt', 'log', 'ln'].includes(token);
        let prevToken = null;
        
        for (const token of tokens) {
            if (/^\d+\.?\d*$/.test(token)) {
                output.push(parseFloat(token));
            } else if (isFunction(token)) {
                operators.push(token);
            } else if (token === '(') {
                operators.push(token);
            } else if (token === ')') {
                while (operators.length && operators[operators.length - 1] !== '(') {
                    output.push(operators.pop());
                }
                operators.pop();
                if (operators.length && isFunction(operators[operators.length - 1])) {
                    output.push(operators.pop());
                }
            } else if (token === '!' || token === '%') {
                output.push(token);
            } else if (token === '-' && (prevToken === null || prevToken === '(' || prevToken in precedence || isFunction(prevToken))) {
                operators.push('_');
            } else if (token === '+' && (prevToken === null || prevToken === '(' || prevToken in precedence || isFunction(prevToken))) {
                operators.push('+');
            } else if (token in precedence) {
                while (operators.length && operators[operators.length - 1] !== '(' &&
                       ((precedence[operators[operators.length - 1]] > precedence[token]) ||
                        (precedence[operators[operators.length - 1]] === precedence[token] && token !== '^'))) {
                    output.push(operators.pop());
                }
                operators.push(token);
            }
            prevToken = token;
        }
        
        while (operators.length) {
            output.push(operators.pop());
        }
        
        return output;
    }

    evaluatePostfix(postfix) {
        const stack = [];
        
        for (const token of postfix) {
            if (typeof token === 'number') {
                stack.push(token);
            } else if (token === '_') {
                const a = stack.pop();
                stack.push(-a);
            } else if (token === '+') {
                const b = stack.pop();
                const a = stack.pop();
                stack.push(a + b);
            } else if (token === '-') {
                const b = stack.pop();
                const a = stack.pop();
                stack.push(a - b);
            } else if (token === '*') {
                const b = stack.pop();
                const a = stack.pop();
                stack.push(a * b);
            } else if (token === '/') {
                const b = stack.pop();
                const a = stack.pop();
                stack.push(a / b);
            } else if (token === '^') {
                const b = stack.pop();
                const a = stack.pop();
                stack.push(Math.pow(a, b));
            } else if (token === '!') {
                const a = stack.pop();
                stack.push(this.factorial(a));
            } else if (token === '%') {
                const a = stack.pop();
                stack.push(a / 100);
            } else if (token === 'sin') {
                const a = stack.pop();
                stack.push(this.mode === 'deg' ? Math.sin(this.degToRad(a)) : Math.sin(a));
            } else if (token === 'cos') {
                const a = stack.pop();
                stack.push(this.mode === 'deg' ? Math.cos(this.degToRad(a)) : Math.cos(a));
            } else if (token === 'tan') {
                const a = stack.pop();
                stack.push(this.mode === 'deg' ? Math.tan(this.degToRad(a)) : Math.tan(a));
            } else if (token === 'asin') {
                const a = stack.pop();
                const result = Math.asin(a);
                stack.push(this.mode === 'deg' ? this.radToDeg(result) : result);
            } else if (token === 'acos') {
                const a = stack.pop();
                const result = Math.acos(a);
                stack.push(this.mode === 'deg' ? this.radToDeg(result) : result);
            } else if (token === 'atan') {
                const a = stack.pop();
                const result = Math.atan(a);
                stack.push(this.mode === 'deg' ? this.radToDeg(result) : result);
            } else if (token === 'csc') {
                const a = stack.pop();
                const sinVal = this.mode === 'deg' ? Math.sin(this.degToRad(a)) : Math.sin(a);
                stack.push(1 / sinVal);
            } else if (token === 'sec') {
                const a = stack.pop();
                const cosVal = this.mode === 'deg' ? Math.cos(this.degToRad(a)) : Math.cos(a);
                stack.push(1 / cosVal);
            } else if (token === 'cot') {
                const a = stack.pop();
                const tanVal = this.mode === 'deg' ? Math.tan(this.degToRad(a)) : Math.tan(a);
                stack.push(1 / tanVal);
            } else if (token === 'sqrt') {
                const a = stack.pop();
                stack.push(Math.sqrt(a));
            } else if (token === 'cbrt') {
                const a = stack.pop();
                stack.push(Math.cbrt(a));
            } else if (token === 'log') {
                const a = stack.pop();
                stack.push(Math.log10(a));
            } else if (token === 'ln') {
                const a = stack.pop();
                stack.push(Math.log(a));
            }
        }
        
        return stack[0];
    }

    degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    formatNumber(num) {
        if (num === null || num === undefined || isNaN(num)) return 'NaN';
        if (!isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';
        
        const str = num.toString();
        
        if (str.includes('e')) {
            return num.toExponential(10);
        }
        
        if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
            return num.toExponential(10);
        }
        
        if (Number.isInteger(num)) {
            return num.toString();
        }
        
        const parts = str.split('.');
        if (parts[1] && parts[1].length > 15) {
            return parseFloat(num.toPrecision(17)).toString();
        }
        
        return str;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
} else {
    document.addEventListener('DOMContentLoaded', () => {
        new Calculator();
    });
}
