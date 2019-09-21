document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.modal');
  const instances = M.Modal.init(elems, {
    onOpenEnd() {},
    endingTop: '10%',
    opacity: 0.8,
    preventScrolling: true,
    dismissible: true,
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.collapsible');
  const instances = M.Collapsible.init(elems, {
    onOpenEnd() {},
    endingTop: '10%',
    opacity: 0.8,
    preventScrolling: true,
    dismissible: true,
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.materialboxed');
  const instances = M.Materialbox.init(elems, {
    onOpenEnd() {},
    doneAnimating: true,
  });
});
