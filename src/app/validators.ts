import { FormGroup, Validators, FormControl } from '@angular/forms';
/* custom validators that we can use */

export function sameValue(control1Key: string, control2Key: string) {
    return (group: FormGroup): {[key: string]: any} => {
        const control1 = group.controls[control1Key];
        const control2 = group.controls[control2Key];

        if (control1.value !== control2.value) {
            const mergedErrors = control1.errors || {};
            mergedErrors['sameValue'] = true;
            control1.setErrors(mergedErrors);
            return {
                'sameValue': true
            };
        }
    };
}

export function passwordValid(control: FormControl): {[key: string]: any} {
    const passwordControl = control;
    const passwordValue: string = passwordControl.value;
    const validChecks = {
        uppercase: passwordValue.match(/.*[A-Z].*/) || false,
        lowercase: passwordValue.match(/.*[a-z].*/) || false,
        numbers: passwordValue.match(/.*[1-9].*/) || false,
        punctuation: passwordValue.match(/.*([^\w\s]).*/) || false
    };

    const valid: boolean = Object.keys(validChecks).map((key) => {
        return validChecks[key];
    }).reduce((accum, value) => {
        return value ? accum + 1 : accum;
    }, 0) > 2;

    if (!valid) {
        return {
            'passwordValid': true
        };
    }
}
