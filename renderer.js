let editor = new SimpleMDE({
  element: document.getElementById('editor'),
});

window.electronAPI.onEditorEvent((value) => {
  if (value == 'toggle-bold') {
    editor.toggleBold();
  }
  if (value == 'toggle-italic') {
    editor.toggleItalic();
  }
  if (value == 'save') {
    window.electronAPI.saveFile(editor.value());
  }
});

window.electronAPI.onOpenFile((content) => {
  editor.value(content);
});
