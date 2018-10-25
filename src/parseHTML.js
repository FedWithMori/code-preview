import parseDom from './parseDom';

function text(element) {
  return element.textContent || element.innerText;
}

export default function parseHTML(source) {
  if (!source) {
    return null;
  }

  const findCode = source.match(/<!-+ ?start-code ?-+>([\s\S]+?)<!-+ ?end-code ?-+>/gi);
  let code = {};

  if (!findCode) {
    return {
      beforeHTML: source
    };
  }

  findCode.forEach((item, index) => {
    code[`example-${index}`] = text(parseDom(item));
  });
  const beforeHTML = source.match(/([\s\S]+?)<!-+ ?start-code ?-+>/gi)[0];
  const afterHTML = source.match(/<!-+ ?parameter-description ?-+>([\s\S]+)/gi);

  return {
    code,
    beforeHTML,
    afterHTML
  };
}
