import React from "react";

class TabsConverter extends React.Component {
  static applyProps(props) {
    const newProps = {};
    let typeCompo;
    let sourceCompo;

    props.forEach((prop) => {
      if (prop.type === "function") {
        const func = eval("(" + prop.value + ")");
        newProps[prop.name] = func;
      } else {
        newProps[prop.name] = prop.value;
      }

      //   sourceCompo = prop.componentSource;
      //   console.log(prop.componentSource);
      console.log(prop.componentType);
      typeCompo = eval("(" + prop.componentType + ")");
      console.log(typeCompo);
    });

    return React.createElement(typeCompo, newProps);
    //     const elementWithSource = Object.assign({}, element, {
    //       _source: sourceCompo,
    //     });
    // console.log(elementWithSource);
    //   return elementWithSource;
  }

  static extractProps(component) {
    const propNames = Object.keys(component.props);
    const defaultProps = component.type.defaultProps || {};
    const props = [];

    const componentType = component.type;
    const componentSource = component._source;
    propNames.forEach((propName) => {
      const propValue = component.props[propName];
      const propType = typeof propValue;

      let processedPropValue = null;
      if (typeof propValue === "string") {
        processedPropValue = defaultProps[propName] || "";
      } else if (typeof propValue === "number") {
        processedPropValue = defaultProps[propName] || 0;
      } else if (typeof propValue === "boolean") {
        processedPropValue = defaultProps[propName] || false;
      } else if (typeof propValue === "function") {
        processedPropValue = propValue.toString();
      } else if (Array.isArray(propValue)) {
        processedPropValue = propValue.slice();
      } else if (typeof propValue === "object" && propValue !== null) {
        processedPropValue = { ...propValue };
      } else {
        processedPropValue = defaultProps[propName];
      }

      props.push({
        name: propName,
        value: processedPropValue,
        type: propType,
        componentType,
        componentSource,
      });
    });

    return props;
  }
}

export default TabsConverter;
