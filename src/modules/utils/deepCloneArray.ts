export function deepCloneObject(originalObject: any) {
  let clonedObject = <any>{};

  for (let key in originalObject) {
    let originalValue = originalObject[key];
    let clonedValue;

    if (typeof originalValue === 'object' && originalValue !== null) {
      if (Array.isArray(originalValue)) {
        clonedValue = deepCloneArray(originalValue);
      } else {
        clonedValue = deepCloneObject(originalValue);
      }
    } else {
      clonedValue = originalValue;
    }

    clonedObject[key] = clonedValue;
  }

  return clonedObject;
}

export function deepCloneArray(originalArray: any) {
  let clonedArray = <any>[];

  for (let i = 0; i < originalArray.length; i++) {
    let originalValue = originalArray[i];
    let clonedValue;

    if (typeof originalValue === 'object' && originalValue !== null) {
      if (Array.isArray(originalValue)) {
        clonedValue = deepCloneArray(originalValue);
      } else {
        clonedValue = deepCloneObject(originalValue);
      }
    } else {
      clonedValue = originalValue;
    }

    clonedArray.push(clonedValue);
  }

  return clonedArray;
}
