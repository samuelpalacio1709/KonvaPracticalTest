import { gsap } from "gsap";

export function showToast(message) {
  gsap.killTweensOf(".toast");
  const tl = gsap.timeline();
  tl.set(".toast", { y: 80, opacity: 0, bottom: 55, position: "fixed" });
  tl.to(".toast", { duration: 0.4, y: 0, opacity: 1, ease: "power2.inOut" });
  tl.to({}, { duration: 4 });
  tl.to(".toast", { duration: 0.4, y: 50, opacity: 0, ease: "power2.inOut" });
  document.querySelector(".toast").innerHTML = `<p>${message}</p>`;
  return tl;
}
