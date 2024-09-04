const colorRegex = /((rgb|hsl|lch|oklch)a?\(\s*[\d]*\.?[\d]+%?\s*(?<commaOrSpace>\s|,)\s*[\d]*\.?[\d]+%?\s*\k<commaOrSpace>\s*[\d]*\.?[\d]+%?(\s*(\k<commaOrSpace>|\/)\s*[\d]*\.?[\d]+%?)?\s*\))|Color\.fromARGB\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)/gi;
const cssVarRegex = /(--[\w-]+-(rgb|hsl|lch|oklch)):\s*([\d]*\.?[\d]+\s+[\d]*\.?[\d]+\s+[\d]*\.?[\d]+);/gi;
const allowedColorFunctions = ['rgb', 'hsl', 'lch', 'oklch'];

export async function findColorFunctionsInText(text) {
  const colorMatches = [...text.matchAll(colorRegex)];
  const cssVarMatches = [...text.matchAll(cssVarRegex)];

  return [...colorMatches, ...cssVarMatches].map(createColorFunctionObject);
}

function createColorFunctionObject(match) {
  const start = match.index;
  const end = start + match[0].length;
  let color = match[0];

  if (color.startsWith('Color.fromARGB')) {
    // Extract ARGB values
    const [ , a, r, g, b ] = color.match(/Color\.fromARGB\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)/);
    // Convert to rgba format for simplicity in highlighting
    color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
  }

  const cssVarMatchArray = Array.from(color.matchAll(cssVarRegex));

  if (cssVarMatchArray.length > 0) {
    const cssVarMatch = cssVarMatchArray[0];
    const colorFunction = cssVarMatch[2];
    const colorValues = cssVarMatch[3];

    if (allowedColorFunctions.includes(colorFunction)) {
      color = `${colorFunction}(${colorValues})`;
    }
  }

  return { start, end, color };
}

export function sortStringsInDescendingOrder(strings) {
  return strings.sort((a, b) => b.localeCompare(a));
}
