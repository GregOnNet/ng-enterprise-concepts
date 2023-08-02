import { Component, EventEmitter, Input, Output, signal, Type } from "@angular/core";
import { Data } from "@angular/router";

type MarkFunctionProperties<TComponent> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in keyof TComponent]: TComponent[Key] extends Function ? never : Key;
};
type ExcludeFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

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
 * type onlyProperties = ExcludeFunctions<HelloComponent> // Result: { greeting: string; }
 * ```
 */
export type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;


type ComponentInputs<TComponent> = ExcludeFunctions<TComponent>;

type DataTableCellComponent<TModel, TComponent = unknown> = TComponent extends infer ComponentType ?
  {
    type: ComponentType,
    inputs: (model: TModel) => ComponentInputs<ComponentType>
  } : never;

interface DataTableColumn<TModel> {
  header: {
    key: keyof TModel;
    label?: string;
  },
  cellComponent?: DataTableCellComponent<TModel>
}


@Component({template: '', standalone: true})
export class CellAComponent {
  @Input() text = '';
}

@Component({template: '', standalone: true})
export class CellBComponent {
  @Input() data = new Date();
}

interface Model {
  text: string;
  date: string;
}

function component<TComponent, TComponentInputSource>(type: Type<TComponent>, inputs: (source: TComponentInputSource) => ComponentInputs<TComponent> ) {
  return {
    type,
    inputs
  }
}

const dataTableColumns: DataTableColumn<Model>[] = [
  { header: {key: 'text'}, cellComponent: { type: CellAComponent, inputs: (model) => ({ s: model.text })} },
  { header: {key: 'date'}, cellComponent: { type: CellBComponent, inputs: (model) => ({  })} },
  { header: {key: 'date'}, cellComponent: component(CellBComponent, (model: Model) => ({data: new Date(model.date)})) }
]


interface SortingChangedArguments<T> {
  key: keyof T;
  direction: 'ascending' | 'descending';
}

interface PageChangedArguments {
  offset: number;
  limit: number;
}

type LoadingState = 'initial' | 'busy' | 'complete' | 'error';

interface DataSource<TModel> {
  models: TModel[];

  /*
   * Represents count of all models that could be retrieved.
   */
  totalModelsCount: number;

  /*
   * Tells rendering engine how to identify a
   * model for performance optimizations
   */
  trackBy: (model: TModel) => string|number;

  /*
   * Tells whether a row can be selected or not
   */
  disableSelection?: (model: TModel) => boolean;

  /*
   * Represents the state of the models in the table.
   * e.g if they are loaded or not.
   */
  state: LoadingState;
}

const emptyDataSource: DataSource<any> ={state: 'initial', models: [], totalModelsCount: 0, trackBy: () => 0 }

@Component({
  selector: 'ui-data-table',
  standalone: true,
  template: ``,
})
export class DataTable<TModel> {
  protected columnsSignal = signal<DataTableColumn<TModel>[]>([]);
  protected dataSourceSignal= signal<DataSource<TModel>>(emptyDataSource);

  @Input() set columns(value: DataTableColumn<TModel>[]) {
    this.columnsSignal.set(value);
  }

  @Input() set dataSource(value: DataSource<TModel>) {
    this.dataSourceSignal.set(value);
  }

  @Output() pageChanged = new EventEmitter<PageChangedArguments>();
  @Output() selectionChanged = new EventEmitter<TModel[]>();
  @Output() sortingChanged = new EventEmitter<SortingChangedArguments<TModel>>();
}
