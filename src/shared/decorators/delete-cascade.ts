export function DeleteCascade(cascade: boolean = true) {
  return function (target: Object, key: string | symbol) {
    Reflect.defineMetadata('design:deletecascade', cascade, target, key);
  };
}
