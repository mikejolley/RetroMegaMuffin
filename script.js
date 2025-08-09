function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function switchToTab(targetTab) {
    // Update button states
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });
    
    const targetButton = document.querySelector(`[data-tab="${targetTab}"]`);
    if (targetButton) {
      targetButton.classList.add('active');
      targetButton.setAttribute('aria-selected', 'true');
    }
    
    // Update panel visibility
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      panel.hidden = true;
    });
    
    const targetPanel = document.getElementById(`${targetTab}-tab`);
    if (targetPanel) {
      targetPanel.classList.add('active');
      targetPanel.hidden = false;
    }
  }

  // Handle tab button clicks
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = button.dataset.tab;
      
      // Update URL hash
      window.location.hash = targetTab;
      switchToTab(targetTab);
    });
  });

  // Handle hash changes (back/forward buttons)
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.querySelector(`[data-tab="${hash}"]`)) {
      switchToTab(hash);
    }
  });

  // Initialize from URL hash on load
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.querySelector(`[data-tab="${initialHash}"]`)) {
    switchToTab(initialHash);
  } else {
    // Default to first tab
    const firstTab = tabButtons[0]?.dataset.tab;
    if (firstTab) {
      switchToTab(firstTab);
    }
  }
}

function initTileVideos() {
  // Handle all video tiles
  const videoTiles = document.querySelectorAll('.video-tile');
  
  videoTiles.forEach(tile => {
    const video = tile.querySelector('.tile-video');
    
    if (video) {
      // Ensure video starts paused at first frame
      video.pause();
      video.currentTime = 0;
      
      tile.addEventListener('mouseenter', () => {
        video.play().catch(e => console.log('Video play failed:', e));
      });
      
      tile.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0; // Reset to first frame (freeze frame)
      });
    }
  });
}

function init() {
  initTabs();
  initTileVideos();
  renderLocalRatings();
}

// Rating calculation weights (from original React app)
const ratingWeights = {
  gameplay: 0.2,
  graphics: 0.2,
  music: 0.2,
  replay: 0.1,
  challenge: 0.1,
  slant: 0.2,
};

function calculateScore(ratings) {
  return Object.entries(ratings)
    .reduce((score, [key, value]) => score + value * ratingWeights[key], 0)
    .toFixed(2);
}

function roundHalf(num) {
  return Math.round(num * 2) / 2;
}

function createStarRating(rating) {
  const rounded = roundHalf(rating);
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return '★'.repeat(fullStars) + 
         (hasHalf ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

function getPlatformIcon(platform) {
  const iconMap = {
    'NES': 'assets/platforms/nes.png',
    'SNES': 'assets/platforms/snes.png',
    'Mega Drive': 'assets/platforms/md.png',
    'GameCube': 'assets/platforms/gamecube.png',
    'Sega Saturn': 'assets/platforms/saturn.png',
    'PLAYSTATION': 'assets/platforms/playstation.png',
    'Game Boy Advance': 'assets/platforms/advance.png'
  };
  
  return iconMap[platform] || null;
}

function createRatingRow(rating, index) {
  const fragment = document.createDocumentFragment();
  
  const calculatedScore = parseFloat(calculateScore(rating.ratings));
  const iconSrc = getPlatformIcon(rating.platform);
  
  // Create main review row
  const reviewRow = document.createElement('tr');
  reviewRow.className = 'review-row';
  reviewRow.id = `rating-${index}`;
  reviewRow.innerHTML = `
    <td class="game-platform">
      ${iconSrc ? `<img src="${iconSrc}" alt="${rating.platform}" class="platform-icon">` : ''}
    </td>
    <td class="game-name">
      ${rating.shortName ? `<abbr title="${rating.name || rating.game}">${rating.shortName}</abbr>` : (rating.name || rating.game)}
    </td>
    <td class="game-rating" onclick="toggleBreakdown(${index})" style="cursor: pointer;">
      <div class="star-rating">${createStarRating(calculatedScore)}</div>
      <div class="rating-score">${calculatedScore}</div>
    </td>
  `;
  
  // Create breakdown row
  const breakdownRow = document.createElement('tr');
  breakdownRow.className = 'breakdown-row';
  breakdownRow.id = `breakdown-${index}`;
  breakdownRow.innerHTML = `
    <td colspan="3">
      <table class="breakdown">
        <tbody>
          <tr>
            <th>Gameplay</th>
            <td><div class="star-rating">${createStarRating(rating.ratings.gameplay)}</div></td>
          </tr>
          <tr>
            <th>Graphics / Animations</th>
            <td><div class="star-rating">${createStarRating(rating.ratings.graphics)}</div></td>
          </tr>
          <tr>
            <th>Music / Sounds</th>
            <td><div class="star-rating">${createStarRating(rating.ratings.music)}</div></td>
          </tr>
          <tr>
            <th>Replayability / Length</th>
            <td><div class="star-rating">${createStarRating(rating.ratings.replay)}</div></td>
          </tr>
          <tr>
            <th>Challenge / Fairness</th>
            <td><div class="star-rating">${createStarRating(rating.ratings.challenge)}</div></td>
          </tr>
          <tr>
            <th>Personal Slant</th>
            <td><div class="star-rating">${createStarRating(rating.ratings.slant)}</div></td>
          </tr>
          <tr>
            <th><strong>Total</strong></th>
            <td><div class="star-rating">${createStarRating(calculatedScore)}</div></td>
          </tr>
        </tbody>
      </table>
    </td>
  `;
  
  fragment.appendChild(reviewRow);
  fragment.appendChild(breakdownRow);
  
  return fragment;
}

// Make toggleBreakdown global
window.toggleBreakdown = function(index) {
  const breakdownRow = document.getElementById(`breakdown-${index}`);
  
  if (breakdownRow) {
    breakdownRow.classList.toggle('show-breakdown');
  }
}

async function renderLocalRatings() {
  const tbody = document.getElementById('ratings-tbody');
  const empty = document.getElementById('ratings-empty');
  
  if (!tbody) {
    console.error('ratings-tbody element not found');
    return;
  }
  
  try {
    const res = await fetch('data/ratings.json', { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error('ratings not found');
    const data = await res.json();
    const ratings = data.ratingsList || data.ratings || [];
    
    console.log('Loaded ratings:', ratings.length, 'entries');
    
    // Sort by calculated score (highest first)
    const scoredRatings = ratings.map(rating => ({
      ...rating,
      calculatedScore: parseFloat(calculateScore(rating.ratings))
    })).sort((a, b) => b.calculatedScore - a.calculatedScore);
    
    tbody.innerHTML = '';
    const frag = document.createDocumentFragment();
    
    scoredRatings.forEach((rating, index) => {
      // Main rating row
      frag.appendChild(createRatingRow(rating, index));
      
      // Breakdown row (hidden by default)
      const breakdownRow = document.createElement('tr');
      breakdownRow.id = `breakdown-${index}`;
      breakdownRow.className = 'breakdown-row';
      breakdownRow.hidden = true;
      breakdownRow.innerHTML = `
        <td colspan="2" class="breakdown">
          <table class="breakdown-table">
            <tr><th>Gameplay</th><td>${createStarRating(rating.ratings.gameplay)}</td></tr>
            <tr><th>Graphics / Animations</th><td>${createStarRating(rating.ratings.graphics)}</td></tr>
            <tr><th>Music / Sounds</th><td>${createStarRating(rating.ratings.music)}</td></tr>
            <tr><th>Replayability / Length</th><td>${createStarRating(rating.ratings.replay)}</td></tr>
            <tr><th>Challenge / Fairness</th><td>${createStarRating(rating.ratings.challenge)}</td></tr>
            <tr><th>Personal Slant</th><td>${createStarRating(rating.ratings.slant)}</td></tr>
          </table>
        </td>
      `;
      frag.appendChild(breakdownRow);
    });
    
    tbody.appendChild(frag);
    if (empty) empty.hidden = ratings.length > 0;
  } catch (e) {
    console.error('Failed to load ratings:', e);
    if (empty) {
      empty.hidden = false;
      empty.innerHTML = '<p>Failed to load ratings. Please check the data file.</p>';
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}