/*
 * Omits all function/method declarations from a class.
 * Only public properties are left.
 * This filter type comes in handy if you want to get all public properties
 * of a component that can be set.
 *
 * Example:
 * ```
 * @Component({ ... })
 * class HelloComponent {
 *   greeting: string;
 *
 *   greet(): void {}
 * }
 *
 * type onlyProperties = ComponentInputs<HelloComponent> // Result: { greeting: string; }
 * ```
 */
export type ComponentInputs<TComponent> = Pick<
  TComponent,
  ExcludeFunctionPropertyNames<TComponent>
>;

type MarkFunctionProperties<TComponent> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof TComponent]: TComponent[Key] extends Function ? never : Key;
};
type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];
