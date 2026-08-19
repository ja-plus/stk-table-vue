import type { CommonScrollToOptions, ScrollTo, ScrollToOptions } from '../src/StkTable';

const commonOptions: CommonScrollToOptions = { behavior: 'smooth', debounce: false };

const coordinates: ScrollToOptions = { left: 20 };
const coordinatesWithTop: ScrollToOptions = { left: 20, top: 40, behavior: 'instant' };
const indexTarget: ScrollToOptions = { index: 10, ...commonOptions };
const keyTarget: ScrollToOptions = { key: 0, behavior: 'auto' };
const positionTarget: ScrollToOptions = { position: 'bottom' };

declare const scrollTo: ScrollTo;
scrollTo(20, 40);
scrollTo(coordinates);
scrollTo(coordinatesWithTop);
scrollTo(indexTarget);
scrollTo(keyTarget);
scrollTo(positionTarget);

// @ts-expect-error a target is required
const emptyTarget: ScrollToOptions = {};
// @ts-expect-error coordinate and index targets are mutually exclusive
const coordinateAndIndex: ScrollToOptions = { top: 500, index: 1 };
// @ts-expect-error index and key targets are mutually exclusive
const indexAndKey: ScrollToOptions = { index: 1, key: 'row-1' };
// @ts-expect-error position cannot be combined with coordinates
scrollTo({ position: 'top', left: 10 });

void emptyTarget;
void coordinateAndIndex;
void indexAndKey;
