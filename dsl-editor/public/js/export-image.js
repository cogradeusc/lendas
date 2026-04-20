async function embedExternalImagesAndUses(svgElement) {
  const images = svgElement.querySelectorAll('image');
  for (const img of images) {
    let href = img.getAttribute('href') || img.getAttribute('xlink:href');
    if (href && !href.startsWith('data:')) {
      try {
        const response = await fetch(href);
        const blob = await response.blob();
        const reader = new FileReader();
        await new Promise(resolve => {
          reader.onloadend = () => {
            img.setAttribute('href', reader.result);
            img.setAttribute('xlink:href', reader.result);
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      } catch (e) {
        console.warn('No se pudo embebir la imagen para exportación:', href);
      }
    }
  }
  const uses = svgElement.querySelectorAll('use');
  for (const use of uses) {
    let href = use.getAttribute('href') || use.getAttribute('xlink:href');
    if (href && !href.startsWith('#') && !href.startsWith('data:')) {
      const [url, fragment] = href.split('#');
      try {
        const response = await fetch(url);
        const text = await response.text();
        let symbolContent = text;
        if (fragment) {
          const parser = new DOMParser();
          const extSvg = parser.parseFromString(text, 'image/svg+xml');
          const symbol = extSvg.getElementById(fragment);
          if (symbol) {
            symbolContent = symbol.outerHTML;
          }
        }
        const temp = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        temp.innerHTML = symbolContent;
        use.parentNode.replaceChild(temp, use);
      } catch (e) {
        console.warn('No se pudo embebir el símbolo SVG externo para exportación:', href);
      }
    }
  }
}

async function exportDiagramImage(format, fileName) {
  const svg = document.querySelector('.joint-paper svg');
  if (!svg) {
    showNotification('No diagram SVG found');
    return;
  }
  const clonedSvg = svg.cloneNode(true);
  await embedExternalImagesAndUses(clonedSvg);
  const serializer = new XMLSerializer();
  const svgStr = serializer.serializeToString(clonedSvg);

  if (format === 'svg') {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    saveAs(blob, fileName + '.svg');
    return;
  }

  const svg64 = btoa(unescape(encodeURIComponent(svgStr)));
  const imageSrc = 'data:image/svg+xml;base64,' + svg64;
  const img = new window.Image();

  let width = svg.viewBox && svg.viewBox.baseVal.width ? svg.viewBox.baseVal.width : svg.width.baseVal.value;
  let height = svg.viewBox && svg.viewBox.baseVal.height ? svg.viewBox.baseVal.height : svg.height.baseVal.value;
  if (!width || !height) {
    width = svg.getAttribute('width');
    height = svg.getAttribute('height');
  }
  width = parseInt(width) || 1200;
  height = parseInt(height) || 900;

  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(function (blob) {
      if (!blob) {
        showNotification('Error: No se pudo generar la imagen. Puede que haya un error de renderizado SVG.');
        return;
      }
      saveAs(blob, fileName + '.' + format);
    },
    format === 'jpg' ? 'image/jpeg' : 'image/png');
  };
  img.onerror = function () {
    showNotification('Error exporting image');
  };
  img.src = imageSrc;
}

window.exportDiagramImage = exportDiagramImage;
