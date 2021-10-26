export class ValidationService {
    static monthDate(control) {
        if (
            (control.value >= 1 && control.value <= 31) ||
            control.value == ""
        ) {
            return null;
        } else {
            return { invalidMonthDate: true };
        }
    }

    static isRequired(control) {
        if (!control.value.match(/^[\s]*$/)) {
            return null;
        } else {
            return { required: true };
        }
    }

    static noBlankSpace(control) {
        if (!control.value.match(/^$|\s+/)) {
            return null;
        } else {
            return { required: true };
        }
    }

    static isNumber(control) {
        if (control.value == null) {
            return null;
        }
        if (
            control.value
                .toString()
                .match(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/)
        ) {
            return null;
        } else {
            return { invalidNumber: true };
        }
    }

    static isEmail(control) {
        if (control.value == null) {
            return null;
        }
        if (
            control.value.match(
                /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/
            )
        ) {
            return null;
        } else {
            return { invalidEmailAddress: true };
        }
    }

    static isPassword(control) {
        if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
            return null;
        } else {
            return { invalidPassword: true };
        }
    }
}
