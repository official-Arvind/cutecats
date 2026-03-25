let ytPlayer;
let playerHasStarted = false;
let lyricsInterval = null;

// 1. Load the YouTube IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
if (firstScriptTag) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
} else {
    document.head.appendChild(tag);
}

// 2. This function creates an <iframe> (and YouTube player) after the API code downloads.
window.onYouTubeIframeAPIReady = function() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '10', 
        width: '10',
        videoId: 'UalZ-cPzxk4', 
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'showinfo': 0,
            'rel': 0,
            'autoplay': 0
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
};

function onPlayerReady(event) {
    document.getElementById('start-btn').innerText = 'Let\'s Go! 😺';
    document.getElementById('start-btn').disabled = false;
}

function onPlayerStateChange(event) {
    // If state is PLAYING (1) and we haven't started lyrics yet
    if (event.data === 1 && !playerHasStarted) {
        playerHasStarted = true;
        startLyrics();
    }
}

// Disable button until player is ready
const startBtn = document.getElementById('start-btn');
startBtn.disabled = true;
startBtn.innerText = 'Loading vibes...';

// Fallback just in case YouTube takes too long or fails
setTimeout(() => {
    if (startBtn.disabled) {
        startBtn.innerText = 'Let\'s Go! (Fallback) 😺';
        startBtn.disabled = false;
    }
}, 4000);

startBtn.addEventListener('click', function() {
    // Hide start screen
    document.getElementById('start-screen').classList.add('hidden');
    
    // Show main content
    const mainContent = document.getElementById('main-content');
    mainContent.classList.remove('hidden');

    startCats();

    // Play YouTube video
    if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
        ytPlayer.playVideo();
        // Fallback for starting lyrics in case YouTube plays but API doesn't notify
        setTimeout(() => {
            if (!playerHasStarted) {
                playerHasStarted = true;
                startLyrics();
            }
        }, 2000);
    } else {
        // Offline or YT failed
        playerHasStarted = true;
        startLyrics();
    }
});

const lyricsData = [
    { time: 1000, text: "😎 Hello Good Morning Kaise Hai Aap Sab" },
    { time: 4000, text: "🎙️ Aaj Humare Saath Maujood Hai..." },
    { time: 7000, text: "🔥 Humare Podcast Pe Mr Bali Ji!" },
    { time: 10000, text: "🤔 Apne Baare Mei Kuch Bataiye Zara" },
    { time: 13000, text: "🗣️ Mera Poora Naam Sachin Surname Bali Hai" },
    { time: 16000, text: "🥛 Doodh Nahi Pe Sakta Mai..." },
    { time: 18500, text: "💩 Potty Lag Jaati Hai" },
    { time: 21500, text: "👨‍🦲 Maathe Pe V Bana Ganja Hun" },
    { time: 25000, text: "⁉️ Sawal Ek, Theek Hai Chaar Jawab" },
    { time: 28000, text: "🚀 Next Level Chalti Hai Vartalaap!" },
    { time: 31000, text: "🎤 Welcome To My Podcast." },
    { time: 34000, text: "👂 Abe Bol Rahe Ho Na Kya Tera Kaan Kharab!" }
];

function startLyrics() {
    if (lyricsInterval !== null) {
        return; // already started
    }

    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsEl = document.getElementById('lyrics');
    let isLeft = true;
    
    const loopDuration = lyricsData[lyricsData.length - 1].time + 3000;

    function playLoop() {
        lyricsData.forEach((lyric) => {
            setTimeout(() => {
                // Foolproof CSS animation restart
                lyricsEl.style.animation = 'none';
                lyricsEl.offsetHeight; // trigger reflow
                lyricsEl.style.animation = null;
                
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
    lyricsInterval = setInterval(playLoop, loopDuration);
}

function startCats() {
    // Randomize cat speeds slightly on load
    const cats = document.querySelectorAll('.cat');
    cats.forEach(cat => {
        const randomDuration = (Math.random() * 3 + 1.5).toFixed(1);
        cat.style.animationDuration = `${randomDuration}s`;
    });
}
