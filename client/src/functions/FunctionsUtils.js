const isNameExists = function (name, data) {
  if (data.name === name) {
    return true;
  }

  if (data.children) {
    for (const child of data.children) {
      if (isNameExists(name, child)) {
        return true;
      }
    }
  }

  return false;
};

const generateUniqueName = function (name, data) {
  let uniqueName = name;
  let counter = 1;

  while (isNameExists(uniqueName, data)) {
    uniqueName = `${name}_${counter}`;
    counter++;
  }

  return uniqueName;
};

const findParent = function (obj, childName) {
  if (obj.name === childName) {
    return null;
  }

  if (obj.children && obj.children.length > 0) {
    for (let i = 0; i < obj.children.length; i++) {
      const child = obj.children[i];
      if (child.name === childName) {
        return obj;
      }

      if (child.children && child.children.length > 0) {
        const parent = findParent(child, childName);
        if (parent) {
          return parent;
        }
      }
    }
  }

  return null;
}

export { isNameExists, generateUniqueName, findParent };
