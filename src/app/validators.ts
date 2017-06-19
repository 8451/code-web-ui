import { FormGroup, Validators } from '@angular/forms';
/* custom validators that we can use */

export function controlsMustHaveEqualValue(control1Key: string, control2Key: string) {
    return (group: FormGroup): {[key: string]: any} => {
        const control1 = group.controls[control1Key];
        const control2 = group.controls[control2Key];

        if (control1.value !== control2.value) {
            return {
                'mismatch': true
            };
        }
    };
}
