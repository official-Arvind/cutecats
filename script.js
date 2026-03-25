document.getElementById('start-btn').addEventListener('click', function() {
    // Hide start screen
    document.getElementById('start-screen').classList.add('hidden');
    
    // Show main content
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('hidden');

    // Play music
    const bgMusic = document.getElementById('bg-music');
    // We attempt to play, some browsers might block if volume isn't handled but click fixes it
    bgMusic.volume = 0.5;
    bgMusic.play().catch(e => console.log('Audio playback failed:', e));

    startLyrics();
    startCats();
});

const lyricsData = [
    { time: 1000, text: "🎵 Welcome to the Podcast from Bali! 🎵" },
    { time: 3500, text: "🌴 Sun is shining, cats are dancing 🌴" },
    { time: 6000, text: "😺 Meow meow meow~ 😺" },
    { time: 8500, text: "🌊 Catching waves and eating fish 🌊" },
    { time: 11000, text: "🎧 This is the Bali vibe! 🎧" },
    { time: 13500, text: "😻 Let's groove together! 😻" },
    { time: 16000, text: "🎶 Podcast from Bali... 🎶" },
    { time: 18500, text: "✨ Purrfection! ✨" }
];

function startLyrics() {
    const lyricsEl = document.getElementById('lyrics');
    let index = 0;
    
    // Total loop time based on last lyric + delay
    const loopDuration = lyricsData[lyricsData.length - 1].time + 3000;

    function playLoop() {
        lyricsData.forEach((lyric) => {
            setTimeout(() => {
                // Remove animation class to reset it
                lyricsEl.classList.remove('lyric-animate');
                
                // Trigger reflow to restart animation
                void lyricsEl.offsetWidth; 
                
                // Update text and animate
                lyricsEl.innerText = lyric.text;
                lyricsEl.classList.add('lyric-animate');

                // Color switch for fun
                const colors = ['#fffb00', '#00ffcc', '#ff00ff', '#ffffff', '#ff9900'];
                lyricsEl.style.color = colors[Math.floor(Math.random() * colors.length)];
                
            }, lyric.time);
        });
    }

    playLoop();
    setInterval(playLoop, loopDuration);
}

function startCats() {
    // Randomize cat speeds slightly on load for chaotic energy
    const cats = document.querySelectorAll('.cat');
    cats.forEach(cat => {
        const randomDuration = (Math.random() * 3 + 2).toFixed(1); // 2s to 5s
        cat.style.animationDuration = `${randomDuration}s`;
    });
}
