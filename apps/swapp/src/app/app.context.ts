import { build, contextBuilder, methods } from '@fragments/ng-fragments';

export const ApplicationContext = build(
  contextBuilder({ providedIn: 'root' }),
  methods(() => ({
    init: () => console.log('app initialized'),
  }))
);
