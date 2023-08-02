import { ComponentInputs } from './component-inputs';

export type DataTableCellComponent<
  TModel,
  TComponent = unknown
> = TComponent extends infer ComponentType
  ? {
      type: ComponentType;
      inputs: (model: TModel) => ComponentInputs<ComponentType>;
    }
  : never;
