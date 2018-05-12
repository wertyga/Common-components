import isEmpty from 'lodash/isEmpty';

export default function(data, blankField = 'Field can not be blank') {
    const errors = {};

    Object.keys(data).forEach(item => {
        if(data[item].require && !data[item].field) {
            errors[item] = blankField;
        }
    });

    return {
        isValid: isEmpty(errors),
        errors
    }
};

// Validate user's inputs, fields that require.
// Data for validation must be an object type of:
// { [fieldName]: { field: 'Some fieldName', require: true/false } }

// BlankField is an argument for error notification