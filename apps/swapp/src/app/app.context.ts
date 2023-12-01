import { build, contextBuilder, methods } from '@web-fragments/ng-fragments';

export const ApplicationContext = build(
  contextBuilder({ providedIn: 'root' }),
  methods(() => ({
    init: () => console.log('app initialized'),
  }))
);
