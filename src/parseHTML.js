import parseDom from './parseDom';

function text(element) {
  return element.textContent || element.innerText;
}

export default function parseHTML(source) {
  if (!source) {
    return null;
  }

  const findCode = source.match(/<!-+ ?start-code ?-+>([\s\S]+?)<!-+ ?end-code ?-+>/gi);
  const code = {};

  if (!findCode) {
    return {
      beforeHTML: source
    };
  }

  findCode.forEach((item, index) => {
    const explainRes = item.match(/<h[1-6]+ id="[\s\S]+">([\s\S]+)<\/h[1-6]>/gi)[0];
    const explain = explainRes ? explainRes[0] : '';
    const newItem = item.replace(explain, '');
    code[`example-${index}`] = new Array(text(parseDom(newItem)));
    code[`example-${index}`].push(text(parseDom(explain)));
  });
  const beforeHTML = source.match(/([\s\S]+?)<!-+ ?start-code ?-+>/gi)[0];
  const afterHTML = source.match(/<!-+ ?parameter-description ?-+>([\s\S]+)/gi);

  return {
    code,
    beforeHTML,
    afterHTML
  };
}
