class Store {
  store: Map<any, any>;
  constructor() {
    this.store = new Map()
  }
  set(name: any, val: any) {
    this.store.set(name, val)
    return this;
  }
  get(name: any) {
    return this.store.get(name)
  }
  has(name: any) {
    return this.store.has(name)
  }
  delete(name: any) {
    return this.store.delete(name)
  }
  size() {
    return this.store.size
  }
}

export const store = new Store()
