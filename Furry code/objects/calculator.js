
function calculate(num1, num2) {
    class Calculator {
        constructor(num1, num2) {
            this.num1 = num1;
            this.num2 = num2;
        }
        add() {
            return this.num1 + this.num2;
        }
        subtract() {
            return this.num1 - this.num2;
        }
        multilpy() {
            return this.num1 * this.num2;
        }
        divide() {
            return this.num1 / this.num2;
        }
    }
    let cal = new Calculator(6, 7);
    console.log(cal.add());
}
calculate(6, 7);
