window.onload = () => {
    const tl = gsap.timeline({ defaults: { duration: 1.2, ease: "power3.out" } });

    tl.from("#avatar", {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power4.out"
    });

    tl.from("#title", {
        opacity: 0,
        y: -60,
        duration: 1,
        ease: "power3.out"
    }, "-=1");

    tl.from("#description", {
        opacity: 0,
        y: -40,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");

    tl.from(".buttons a", {
        opacity: 0,
        scale: 0.8,
        stagger: 0.3,
        ease: "elastic.out(1, 0.6)",
    }, "-=0.5");
};