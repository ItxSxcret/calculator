function isValidExpression(expr) {

  if (/[^0-9+\-*/().]/.test(expr)) {
    return { valid: false, message: "มีตัวอักษรหรือสัญลักษณ์ที่ไม่อนุญาต" };
  }


  if (/(--|\+\+|\*\*|\/\/)/.test(expr)) {
    return { valid: false, message: "ไม่อนุญาตให้ใช้ ++, --, **, //" };
  }


  const numberRegex = /\d*\.\d*|\d+/g;
  const matches = expr.match(numberRegex);
  if (matches) {
    for (let num of matches) {
      if ((num.match(/\./g) || []).length > 1) {
        return { valid: false, message: `เลข '${num}' มีจุดทศนิยมมากกว่า 1 จุด` };
      }
    }
  }

  return { valid: true, message: "" };
}

function tokenize(expr) {
  return expr.match(/\d*\.\d+|\d+|[+\-*/()]/g);
}

function toRPN(tokens) {
  const precedence = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const output = [];
  const stack = [];

  for (let token of tokens) {
    if (!isNaN(token)) {
      output.push(parseFloat(token));
    } else if ("+-*/".includes(token)) {
      while (
        stack.length &&
        stack[stack.length - 1] !== '(' &&
        precedence[token] <= precedence[stack[stack.length - 1]]
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      stack.pop();
    }
  }

  while (stack.length) {
    output.push(stack.pop());
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (let token of rpn) {
    if (typeof token === "number") {
      stack.push(token);
    } else {
      const b = stack.pop();
      const a = stack.pop();
      switch (token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(a / b); break;
      }
    }
  }

  return stack[0];
}

function main() {
  const expr = prompt("กรอกสมการเลข:").replace(/\s+/g, '');
  const { valid, message } = isValidExpression(expr);
  if (!valid) {
    alert("❌ อินพุตไม่ถูกต้อง: " + message);
    return;
  }

  try {
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    const result = evaluateRPN(rpn);
    alert("ผลลัพธ์: " + (Number.isInteger(result) ? result : result.toFixed(5)));
  } catch (e) {
    alert("❌ เกิดข้อผิดพลาดในการคำนวณ: " + e.message);
  }
}

main();
