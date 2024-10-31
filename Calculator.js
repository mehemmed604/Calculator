const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        if (value === "clear") {
            input = "";
            display_input.innerHTML = "";
            display_output.innerHTML = "";
        } else if (value === "backspace") {
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);
        } else if (value === "=") {
            try {
                let result = eval(PrepareInput(input));
                display_output.innerHTML = CleanOutput(result);
            } catch (error) {
                display_output.innerHTML = "Error";
            }
        } else if (value === "+/-") {
            toggleNegative();
            display_input.innerHTML = CleanInput(input);
        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    });
}

function toggleNegative() {
    let match = input.match(/([\d.]+)$/); // Matches the last number in the input
    if (match) {
        let number = match[0];
        let start = input.lastIndexOf(number);
        
        if (number.startsWith("-")) {
            input = input.slice(0, start) + number.slice(1);
        } else {
            input = input.slice(0, start) + "(-" + number + ")";
        }
    }
}

function CleanInput(input) {
    let input_array = input.split("");
    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] === "*") {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] === "/") {
            input_array[i] = ` <span class="operator">/</span> `;
        } else if (input_array[i] === "+") {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] === "-") {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] === "%") {
            input_array[i] = ` <span class="percent">%</span> `;
        }
    }
    return input_array.join("");
}

function CleanOutput(output) {
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];
    let output_array = output_string.split("");
    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }
    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }
    return output_array.join("");
}

function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ["+", "-", "*", "/"];

    if (value === "." && last_input === ".") {
        return false;
    }

    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

function PrepareInput(input) {
    let input_array = input.split(/(%|\+|\-|\*|\/)/);
    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] === "%") {
            input_array[i] = "* 0.01 *";
        }
    }
    return input_array.join("");
}