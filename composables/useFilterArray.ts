export function useFilterArray<T>() {
  const getByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, key) => {
      if (acc && typeof acc === 'object') return acc[key];
      return undefined;
    }, obj);
  };

  const filterArrayOrdered = (
    srcArray: Ref<T[]>,
    destArray: Ref<T[]>,
    params: string[], // np. ['employee.firstName', 'employee.lastName']
    searchQuery: Ref<string>
  ) => {
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) {
      destArray.value = srcArray.value;
      return;
    }

    const matchedItems = new Set<T>();
    const orderedMatches: T[] = [];

    for (const path of params) {
      const filtered = srcArray.value.filter((item) => {
        const value = getByPath(item, path);
        if (
          typeof value === 'string' &&
          value.toLowerCase().startsWith(query) &&
          !matchedItems.has(item)
        ) {
          return true;
        }

        return false;
      });

      for (const item of filtered) {
        matchedItems.add(item);
        orderedMatches.push(item);
      }
    }

    destArray.value = orderedMatches;
  };

  return { filterArrayOrdered };
}
