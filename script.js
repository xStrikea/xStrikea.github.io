document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById("content");

    // 移除加載屏幕，直接顯示主要內容
    content.style.display = "block";

    const tl = gsap.timeline({
        defaults: {
            duration: 0.8,
            ease: "power2.out" 
        }
    });

    tl.from("#avatar", {
        opacity: 0,
        scale: 0.9,
        duration: 1, 
        ease: "power3.out"
    });

    tl.from("#title", {
        opacity: 0,
        y: -40,
        ease: "power2.out"
    }, "-=0.5");

    tl.from("#description", {
        opacity: 0,
        y: 30,
        ease: "power2.out"
    }, "-=0.4");

    tl.from(".buttons a", {
        opacity: 0,
        scale: 0.95,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.3");
});