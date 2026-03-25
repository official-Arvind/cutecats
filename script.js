let ytPlayer;

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '10', // hide it
        width: '10',
        videoId: 'UalZ-cPzxk4', // Podcast from Bali
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'autoplay': 0
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    document.getElementById('start-btn').innerText = 'Let\'s Go! 😺';
    document.getElementById('start-btn').disabled = false;
}

// Disable button until player is ready
document.getElementById('start-btn').disabled = true;
document.getElementById('start-btn').innerText = 'Loading vibes...';

document.getElementById('start-btn').addEventListener('click', function() {
    // Hide start screen
    document.getElementById('start-screen').classList.add('hidden');
    
    // Show main content
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('hidden');

    // Play YouTube video
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
    }

    startLyrics();
    startCats();
});

const lyricsData = [
    { time: 1000, text: "🎵 Podcast From Bali! 🎵" },
    { time: 4000, text: "🌴 Sun & pixel waves 🌴" },
    { time: 7000, text: "😺 V I B I N G 😺" },
    { time: 10000, text: "🌊 Dance across the screen! 🌊" },
    { time: 13000, text: "🎧 Feel the funky rhythm 🎧" },
    { time: 16000, text: "😻 3D Cats in town! 😻" },
    { time: 19000, text: "🎶 Podcast from Bali... 🎶" },
    { time: 22000, text: "✨ Purrfection! ✨" }
];

function startLyrics() {
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsEl = document.getElementById('lyrics');
    let isLeft = true;
    
    const loopDuration = lyricsData[lyricsData.length - 1].time + 3000;

    function playLoop() {
        lyricsData.forEach((lyric) => {
            setTimeout(() => {
                // Reset animation
                lyricsEl.classList.remove('lyric-animate');
                void lyricsEl.offsetWidth; // trigger reflow
                
                // Update text
                lyricsEl.innerText = lyric.text;
                
                // Toggle position left/right
                if (isLeft) {
                    lyricsContainer.className = 'lyric-pos-left';
                } else {
                    lyricsContainer.className = 'lyric-pos-right';
                }
                isLeft = !isLeft;

                // Color switch
                const colors = ['#fffb00', '#00ffff', '#ff00ff', '#ffffff', '#ff9900', '#00ffcc'];
                lyricsEl.style.color = colors[Math.floor(Math.random() * colors.length)];
                
                // Trigger pop animation
                lyricsEl.classList.add('lyric-animate');
            }, lyric.time);
        });
    }

    playLoop();
    setInterval(playLoop, loopDuration);
}

function startCats() {
    // Randomize cat speeds slightly on load
    const cats = document.querySelectorAll('.cat');
    cats.forEach(cat => {
        const randomDuration = (Math.random() * 3 + 1.5).toFixed(1);
        cat.style.animationDuration = `${randomDuration}s`;
    });
}
