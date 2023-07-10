export function isEqual(set1, set2) {
  return set1.size === set2.size && [...set1].every((item) => set2.has(item));
}

export function isSuperset(set, subset) {
  for (const elem of subset) {
    if (!set.has(elem)) {
      return false;
    }
  }
  return true;
}
