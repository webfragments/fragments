import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { fragmentTemplateBuilder } from '../builders/fragment-template-builder';
import { build } from '../builder/build';
import {
  FragmentFactory,
  FragmentFn,
  FragmentFunctionContext,
  FragmentOptions,
  FragmentTemplate,
} from '../fragment/types';
import { props } from '../builder-props/props';
import { fragmentFactory } from '../fragment/factory';
import { toPromise } from '../utils/rxjs';
import { methods } from '../builder-props/methods';

export type ApiError = {
  message: string;
};

export type ApiResult<T> = {
  data: T;
  error: ApiError;
};

export interface ApiContext<TFragmentIn>
  extends FragmentFunctionContext<TFragmentIn> {
  _client: HttpClient;
  _send: <T>(request: Observable<T>) => Promise<ApiResult<T>>;
}

const templateId = Symbol('api');

export function apiFragmentTemplate<
  TFragmentIn,
  TFragmentOut
>(): FragmentTemplate<TFragmentIn, TFragmentOut> {
  return build(
    fragmentTemplateBuilder<TFragmentIn, TFragmentOut>({
      static: 'context',
      templateId,
      name: 'api',
    }),
    props(({ _inject }) => ({
      _client: _inject(HttpClient),
    })),
    methods(() => ({ _send: <T>(request: Observable<T>) => api(request) }))
  );
}

export function apiFragment<TFragmentIn, TFragmentOut>(
  fragmentFn: FragmentFn<TFragmentIn, TFragmentOut, ApiContext<TFragmentIn>>,
  options?: FragmentOptions
): FragmentFactory<TFragmentIn, TFragmentOut> {
  return fragmentFactory(
    apiFragmentTemplate<TFragmentIn, TFragmentOut>(),
    fragmentFn,
    options
  );
}

async function api<T>(action: Observable<T>): Promise<ApiResult<T>> {
  try {
    const result = await toPromise(action);
    return { data: result, error: null };
  } catch (error) {
    return Promise.resolve({ data: null, error });
  }
}
