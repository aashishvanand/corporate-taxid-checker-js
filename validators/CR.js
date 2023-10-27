function validate_cr_cpj(cpj, debug=false) {

    // Define the class types
    var classTypes = {
        '2': ['100', '200', '300', '400'],
        '3': [
            '002', '003', '004', '005', '006', '007', '008', '009',
            '010', '011', '012', '013', '014', '101', '102', '103',
            '104', '105', '106', '107', '108', '109', '110'
        ],
        '4': ['000'],
        '5': ['001']
    };

    // Check if the length of the input is correct
    if (cpj.length !== 10) {
        if (debug) { 
            console.log("Invalid length");
        }
        return false;
    }

    // Check if all characters are digits
    if (!/^\d+$/.test(cpj)) {
        if (debug) { 
            console.log("Invalid format");
        }
        return false;
    }

    // Extract the key and the class code
    var key = cpj.charAt(0);
    var classCode = cpj.substr(1, 3);

    // Check if the key is valid
    if (!classTypes.hasOwnProperty(key)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    // Check if the class code is valid
    if (!classTypes[key].includes(classCode)) {
        if (debug) { 
            console.log("Invalid component");
        }
        return false;
    }

    return true;
}

module.exports = { validate_cr_cpj };