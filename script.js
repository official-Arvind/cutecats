let ytPlayer;
let playerHasStarted = false;
let lyricsInterval = null;
let currentLyricIndex = -1;

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

let lyricsData = [];

// Advanced Sync Engine: Polls the YouTube API internal clock directly
function checkLyricsSync() {
    if (ytPlayer && typeof ytPlayer.getCurrentTime === 'function' && lyricsData.length > 0) {
        const timeMs = ytPlayer.getCurrentTime() * 1000;
        
        let foundIndex = -1;
        for (let i = 0; i < lyricsData.length; i++) {
            if (timeMs >= lyricsData[i].time) {
                foundIndex = i;
            } else {
                break;
            }
        }
        
        // Loop functionality: If time passes the end, we don't do anything because the song keeps playing.
        if (foundIndex !== -1 && foundIndex !== currentLyricIndex) {
            currentLyricIndex = foundIndex;
            
            const lyricsContainer = document.getElementById('lyrics-container');
            const lyricsEl = document.getElementById('lyrics');
            
            // Foolproof CSS animation restart
            lyricsEl.style.animation = 'none';
            lyricsEl.offsetHeight; // trigger reflow
            lyricsEl.style.animation = null;
            
            // Update text
            lyricsEl.innerText = lyricsData[foundIndex].text;
            
            // Toggle position left/right
            if (lyricsContainer.className.includes('lyric-pos-left')) {
                lyricsContainer.className = 'lyric-pos-right';
            } else {
                lyricsContainer.className = 'lyric-pos-left';
            }

            // Funky Color switch
            const colors = ['#fffb00', '#00ffff', '#ff00ff', '#ffffff', '#ff9900', '#00ffcc'];
            lyricsEl.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Trigger pop animation
            lyricsEl.classList.add('lyric-animate');
        }
    }
    lyricsInterval = requestAnimationFrame(checkLyricsSync);
}

// Function to fetch and parse external lyrics from API
async function fetchLyricsAPI() {
    try {
        const response = await fetch('https://lrclib.net/api/search?q=Podcast+Bali', {
            headers: { 'User-Agent': 'BaliCats WebPlayer' }
        });
        const data = await response.json();
        let foundSynced = false;
        
        if (data && data.length > 0) {
            for (let track of data) {
                if (track.syncedLyrics) {
                    parseLRC(track.syncedLyrics);
                    foundSynced = true;
                    console.log("Successfully fetched synced lyrics from API!");
                    break;
                }
            }
        }
        
        if (!foundSynced) {
            console.log("No synced lyrics on API, using local fallback.");
            useFallbackLyrics();
        }
    } catch (e) {
        console.error("API Lyrics fetch failed:", e);
        useFallbackLyrics();
    }
}

function parseLRC(lrcText) {
    const lines = lrcText.split('\n');
    lyricsData = [];
    lines.forEach(line => {
        // match [mm:ss.xx] text
        const match = line.match(/\[(\d+):(\d+\.\d+)\](.*)/);
        if (match) {
            const minutes = parseInt(match[1]);
            const seconds = parseFloat(match[2]);
            const text = match[3].trim();
            if (text) {
                lyricsData.push({
                    time: (minutes * 60 + seconds) * 1000,
                    text: text
                });
            }
        }
    });
}

function useFallbackLyrics() {
    lyricsData = [
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
}

function startLyrics() {
    if (lyricsInterval !== null) {
        return; // already started
    }

    // Attempt to fetch full lyrics dynamically before starting the sync engine!
    fetchLyricsAPI().then(() => {
        // Start the sync engine on the lyrics datastore
        checkLyricsSync();
    });
}

function startCats() {
    // Randomize cat speeds slightly on load
    const cats = document.querySelectorAll('.cat');
    cats.forEach(cat => {
        const randomDuration = (Math.random() * 3 + 1.5).toFixed(1);
        cat.style.animationDuration = `${randomDuration}s`;
    });
}
