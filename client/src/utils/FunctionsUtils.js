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
  
  export { isNameExists, generateUniqueName };
  