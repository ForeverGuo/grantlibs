const store: Map<any, any> = new Map();

export function storeSet(name: any, val: any) {
  store.set(name, val)
}

export function storeGet(name: any): any {
  return store.get(name)
}

export function storeHas(name: any): boolean {
  return store.has(name)
}

export function storeDel(name: any): boolean {
  return store.delete(name)
}

export function storeSize(): number {
  return store.size
}

