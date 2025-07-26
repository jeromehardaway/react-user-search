// Polyfill for Map
if (typeof Map === 'undefined') {
  class Map {
    constructor() {
      this._keys = [];
      this._values = [];
    }

    set(key, value) {
      const index = this._keys.indexOf(key);
      if (index >= 0) {
        this._values[index] = value;
      } else {
        this._keys.push(key);
        this._values.push(value);
      }
      return this;
    }

    get(key) {
      const index = this._keys.indexOf(key);
      return index >= 0 ? this._values[index] : undefined;
    }

    has(key) {
      return this._keys.indexOf(key) >= 0;
    }

    delete(key) {
      const index = this._keys.indexOf(key);
      if (index >= 0) {
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        return true;
      }
      return false;
    }

    clear() {
      this._keys = [];
      this._values = [];
    }

    get size() {
      return this._keys.length;
    }
  }

  window.Map = Map;
}

// Polyfill for Set
if (typeof Set === 'undefined') {
  class Set {
    constructor(iterable) {
      this._values = [];
      if (iterable) {
        for (const item of iterable) {
          this.add(item);
        }
      }
    }

    add(value) {
      if (!this.has(value)) {
        this._values.push(value);
      }
      return this;
    }

    has(value) {
      return this._values.indexOf(value) >= 0;
    }

    delete(value) {
      const index = this._values.indexOf(value);
      if (index >= 0) {
        this._values.splice(index, 1);
        return true;
      }
      return false;
    }

    clear() {
      this._values = [];
    }

    get size() {
      return this._values.length;
    }
  }

  window.Set = Set;
}

// Polyfill for Promise
if (typeof Promise === 'undefined') {
  // Using a lightweight Promise polyfill that meets basic needs
  window.Promise = function(executor) {
    const state = {
      status: 'pending',
      value: undefined,
      onFulfilled: [],
      onRejected: []
    };

    function resolve(value) {
      if (state.status === 'pending') {
        state.status = 'fulfilled';
        state.value = value;
        state.onFulfilled.forEach(fn => fn(value));
      }
    }

    function reject(reason) {
      if (state.status === 'pending') {
        state.status = 'rejected';
        state.value = reason;
        state.onRejected.forEach(fn => fn(reason));
      }
    }

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }

    return {
      then: function(onFulfilled, onRejected) {
        return new Promise((resolve, reject) => {
          if (typeof onFulfilled === 'function') {
            if (state.status === 'fulfilled') {
              try {
                resolve(onFulfilled(state.value));
              } catch (e) {
                reject(e);
              }
            } else if (state.status === 'pending') {
              state.onFulfilled.push(value => {
                try {
                  resolve(onFulfilled(value));
                } catch (e) {
                  reject(e);
                }
              });
            }
          } else if (state.status === 'fulfilled') {
            resolve(state.value);
          } else if (state.status === 'pending') {
            state.onFulfilled.push(resolve);
          }

          if (typeof onRejected === 'function') {
            if (state.status === 'rejected') {
              try {
                resolve(onRejected(state.value));
              } catch (e) {
                reject(e);
              }
            } else if (state.status === 'pending') {
              state.onRejected.push(reason => {
                try {
                  resolve(onRejected(reason));
                } catch (e) {
                  reject(e);
                }
              });
            }
          } else if (state.status === 'rejected') {
            reject(state.value);
          } else if (state.status === 'pending') {
            state.onRejected.push(reject);
          }
        });
      },
      catch: function(onRejected) {
        return this.then(null, onRejected);
      }
    };
  };
}
