const spinEffect = document.querySelector(".spin-effect");

if (spinEffect) {
    const frames = ["0% 0%", "50% 0%", "100% 0%", "0% 100%", "50% 100%"];
    let frame = 0;

    window.setInterval(() => {
        frame = (frame + 1) % frames.length;
        spinEffect.style.backgroundPosition = frames[frame];
    }, 50);
}
