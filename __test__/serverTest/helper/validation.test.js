import {isEmailId} from '../../../server/helper/validation';

test("Correct mail : louies89@gmail.com", () => {
    expect(isEmailId('louies89@gmail.com')).toBe(true);
});

test("Correct mail : louies.89@gmail.com", () => {
    expect(isEmailId('louies8.9@gmail.com')).toBe(true);
});

test("Correct mail : lou.ies.89@gmail.com", () => {
    expect(isEmailId('lo.uies.89@gmail.com')).toBe(true);
});

test("Correct mail : lou.ies.89@gma.il.com", () => {
    expect(isEmailId('lo.uies.89@gma.il.com')).toBe(true);
});

test("Incorrect mail : louies89gmail.com", () => {
    expect(isEmailId('louies89gmail.com')).toBeFalsy();
});