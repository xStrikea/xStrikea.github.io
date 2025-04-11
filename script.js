// When the DOM content is fully loaded, proceed with the script
document.addEventListener("DOMContentLoaded", () => {
    // Select the loading screen and the main content elements
    const loadingScreen = document.getElementById("loading-screen");
    const content = document.getElementById("content");

    // Wait for all resources on the page (images, fonts, etc.) to fully load
    window.addEventListener("load", () => {
        // Hide the loading screen by setting its display property to "none"
        loadingScreen.style.display = "none";

        // Show the main content by changing its display property to "block"
        content.style.display = "block";

        // Initialize GSAP animations with a timeline
        const tl = gsap.timeline({
            defaults: {
                duration: 1.2,       // Default duration for animations
                ease: "power3.out"   // Default easing for smooth transitions
            }
        });

        // Step 1: Animate the avatar (profile picture)
        tl.from("#avatar", {
            opacity: 0,            // Start fully transparent
            scale: 0.8,            // Start slightly smaller
            duration: 1.5,         // Longer duration for a smooth zoom-in
            ease: "power4.out"     // Gradual easing for a natural motion
        });

        // Step 2: Animate the title (h1 element)
        tl.from("#title", {
            opacity: 0,            // Start fully transparent
            y: -60,                // Slide down from 60px above its final position
            duration: 1,           // Medium duration for the title appearance
            ease: "power3.out"     // Smooth easing
        }, "-=1"); // Overlap this animation with the previous by 1 second

        // Step 3: Animate the description (p element)
        tl.from("#description", {
            opacity: 0,            // Start fully transparent
            y: -40,                // Slide down from 40px above its final position
            duration: 1,           // Same duration as the title
            ease: "power3.out"     // Smooth easing
        }, "-=0.8"); // Overlap with the previous animation by 0.8 seconds

        // Step 4: Animate the buttons
        tl.from(".buttons a", {
            opacity: 0,            // Start fully transparent
            scale: 0.8,            // Start slightly smaller for a zoom-in effect
            stagger: 0.3,          // Delay each button's animation by 0.3 seconds
            ease: "elastic.out(1, 0.6)" // Elastic easing for a bouncy effect
        }, "-=0.5"); // Overlap with the previous animation by 0.5 seconds
    });
});