import { Type } from '@angular/core';
import { ComponentInputs } from './types/component-inputs';

function component<TComponent, TComponentInputSource>(
  type: Type<TComponent>,
  inputs: (source: TComponentInputSource) => ComponentInputs<TComponent>
) {
  return {
    type,
    inputs,
  };
}
