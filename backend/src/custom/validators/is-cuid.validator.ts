import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import validator from 'validator';

export function IsCuid(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isCuid',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    return typeof value === 'string' && validator.isLength(value, { min: 25, max: 25 }) && /^c[a-z0-9]+$/.test(value);
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid CUID`;
                }
            }
        });
    };
}