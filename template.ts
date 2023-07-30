const endpoints = `
<h2>Available endpoints</h2>
<p>[color] is a hexadecimal CSS color without the #</p>
<ul>
  <li>/tonal/[color]</li>
  <li>/neutral</li>
  <li>/neutral/[color]</li>
</ul>
`;

export const template = (title: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta charset="UTF-8">
    <title>${title}</title>
  </head>
</html>
<body>
  <h1>${title}</h1>
  ${endpoints}
</body>
</html>
`;

export default template;
