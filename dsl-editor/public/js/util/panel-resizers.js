function initResizers() {
  leftResizer.addEventListener("mousedown", (event) => {
    event.preventDefault();
    leftResizer.classList.add('active');
    document.addEventListener("mousemove", resizeLeftPanel);
    document.addEventListener("mouseup", stopResizingLeft);
  });

  rightResizer.addEventListener("mousedown", (event) => {
    event.preventDefault();
    rightResizer.classList.add('active');
    document.addEventListener("mousemove", resizeRightPanel);
    document.addEventListener("mouseup", stopResizingRight);
  });
  
  // Soporte táctil para dispositivos móviles
  leftResizer.addEventListener("touchstart", (event) => {
    event.preventDefault();
    leftResizer.classList.add('active');
    document.addEventListener("touchmove", resizeLeftPanelTouch);
    document.addEventListener("touchend", stopResizingLeft);
  });

  rightResizer.addEventListener("touchstart", (event) => {
    event.preventDefault();
    rightResizer.classList.add('active');
    document.addEventListener("touchmove", resizeRightPanelTouch);
    document.addEventListener("touchend", stopResizingRight);
  });
}

function resizeLeftPanel(event) {
  const minWidth = 100;
  const maxWidth = 600;
  const newWidth = Math.max(minWidth, Math.min(event.clientX, maxWidth));
  leftPanel.style.width = newWidth + "px";
  
  // Actualizar en tiempo real para feedback inmediato
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(updatePaperDimensions);
  }
}

function resizeLeftPanelTouch(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    const minWidth = 200;
    const maxWidth = 600;
    const newWidth = Math.max(minWidth, Math.min(touch.clientX, maxWidth));
    leftPanel.style.width = newWidth + "px";
    
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(updatePaperDimensions);
    }
  }
}

function stopResizingLeft() {
  leftResizer.classList.remove('active');
  document.removeEventListener("mousemove", resizeLeftPanel);
  document.removeEventListener("mouseup", stopResizingLeft);
  document.removeEventListener("touchmove", resizeLeftPanelTouch);
  document.removeEventListener("touchend", stopResizingLeft);
  updatePaperDimensions();
}

function resizeRightPanel(event) {
  const containerRect = document
    .getElementById("editorContent")
    .getBoundingClientRect();
  const totalWidth = containerRect.width;
  const minWidth = 100;
  const maxWidth = 600;
  const x = event.clientX;
  
  // Si el panel está oculto, no permitimos redimensionar
  if (rightPanel.classList.contains('hidden')) {
    return;
  }
  
  let newWidth = totalWidth - x;
  if (newWidth < minWidth) newWidth = minWidth;
  if (newWidth > maxWidth) newWidth = maxWidth;
  rightPanel.style.width = newWidth + "px";
  
  // Actualizar en tiempo real
  if (window.requestAnimationFrame) {
    window.requestAnimationFrame(updatePaperDimensions);
  }
}

function resizeRightPanelTouch(event) {
  if (event.touches.length > 0) {
    const touch = event.touches[0];
    const containerRect = document
      .getElementById("editorContent")
      .getBoundingClientRect();
    const totalWidth = containerRect.width;
    const minWidth = 100;
    const maxWidth = 600;
    const x = touch.clientX;
    
    // Si el panel está oculto, no permitimos redimensionar
    if (rightPanel.classList.contains('hidden')) {
      return;
    }
    
    let newWidth = totalWidth - x;
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;
    rightPanel.style.width = newWidth + "px";
    
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(updatePaperDimensions);
    }
  }
}

function stopResizingRight() {
  rightResizer.classList.remove('active');
  document.removeEventListener("mousemove", resizeRightPanel);
  document.removeEventListener("mouseup", stopResizingRight);
  document.removeEventListener("touchmove", resizeRightPanelTouch);
  document.removeEventListener("touchend", stopResizingRight);
  updatePaperDimensions();
}

function updatePaperDimensions() {
  const wrapper = document.getElementById("diagramWrapper");
  if (paper && wrapper) {
    // Esperar un momento para que las transiciones CSS terminen
    setTimeout(() => {
      const rect = wrapper.getBoundingClientRect();
      paper.setDimensions(rect.width, rect.height);
    }, 10);
  }
}

// Añadir método para ajustar el diagrama cuando cambia la visibilidad de los paneles
function adjustDiagramOnPanelToggle() {
  const rightPanel = document.getElementById("rightPanel");
  const leftPanel = document.getElementById("leftPanel");
  const diagramWrapper = document.getElementById("diagramWrapper");
  
  // Asegurar que el diagrama ocupe todo el espacio disponible
  if (rightPanel.classList.contains('hidden')) {
    diagramWrapper.style.flex = "1 1 auto";
  }
  
  // Actualizar las dimensiones del diagrama
  updatePaperDimensions();
}
