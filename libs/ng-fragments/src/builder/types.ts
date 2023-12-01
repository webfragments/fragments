import { Type } from '@angular/core';
import { Factory } from '../types';

export type BuilderInitialContext = Record<string, unknown>;

export type BuilderPartialContext = Record<string, unknown>;

export type BuilderStepConfig<
  Input extends BuilderPartialContext,
  Output extends BuilderPartialContext
> = Output | Factory<Input, Output>;

export type Builder<InitialContext extends BuilderInitialContext, Result> = <
  FactoryResult extends InitialContext & BuilderPartialContext
>(
  factory: Factory<InitialContext, FactoryResult>
) => Result;

export type BuildResult<
  TBuilderResult,
  TBuilderStepsResult = BuilderPartialContext
> = TBuilderResult extends Type<unknown>
  ? Type<TBuilderStepsResult>
  : TBuilderStepsResult extends TBuilderResult
  ? TBuilderStepsResult
  : TBuilderResult;
