// Plain href="#id" breaks under HashRouter — it changes location.hash,
// which HashRouter reads as a route change, not a scroll target. Use
// this instead of an anchor href wherever you want to jump to a
// same-page section id.
export function scrollToSection(id) {
  return (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
