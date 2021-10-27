export class FnCallsCounter {
  count = 0;

  provideCounterFor(target: Function) {
    const counter = function (this: FnCallsCounter, ...args: any[]) {
      this.count++;
      return target.apply(null, [this.count, ...arguments]);
    };

    return counter.bind(this);
  }
}
