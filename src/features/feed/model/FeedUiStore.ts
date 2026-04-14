import { makeAutoObservable } from 'mobx';
import { type PostTier } from '@/entities/post/model/types';

export type FeedFilter = 'all' | PostTier;

export class FeedUiStore {
  filter: FeedFilter = 'all';

  constructor() {
    makeAutoObservable(this);
  }

  setFilter(nextFilter: FeedFilter) {
    this.filter = nextFilter;
  }

  get tierFilter(): PostTier | undefined {
    return this.filter === 'all' ? undefined : this.filter;
  }
}
