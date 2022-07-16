export const registeredServices = [];

export function Service() {
    return function(target: Function) {
        registeredServices.push(target.name);
    };
}
