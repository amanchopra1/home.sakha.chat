// Responsive layout handling for Sakha website

document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a desktop device
  const isDesktop = window.innerWidth >= 1024;

  // Apply desktop-specific layout changes
  function applyDesktopLayout() {
    const container = document.getElementById('appContainer');
    const chatContainer = document.getElementById('chatContainer');
    const sideContent = document.getElementById('sideContent');

    if (window.innerWidth >= 1024) {
      container.classList.add('desktop-layout');

      // Only reorganize if not in fullscreen chat mode
      if (!chatContainer.classList.contains('fullscreen')) {
        // Move activity and info sections to side content if they're not already there
        if (document.querySelector('.activity-section') &&
            !sideContent.querySelector('.activity-section')) {
          sideContent.appendChild(document.querySelector('.activity-section'));
          sideContent.appendChild(document.querySelector('.info-section'));
        }
      }
    } else {
      container.classList.remove('desktop-layout');

      // Move activity and info sections back to main container if in mobile view
      if (sideContent.querySelector('.activity-section')) {
        container.appendChild(sideContent.querySelector('.activity-section'));
        container.appendChild(sideContent.querySelector('.info-section'));
      }
    }
  }

  // Handle window resize events
  window.addEventListener('resize', function() {
    applyDesktopLayout();
  });

  // Initial layout setup
  applyDesktopLayout();

  // Override the existing enterFullscreenMode function to handle desktop layout
  const originalEnterFullscreen = window.enterFullscreenMode;
  window.enterFullscreenMode = function() {
    originalEnterFullscreen();

    // Additional desktop-specific fullscreen handling
    if (window.innerWidth >= 1024) {
      const sideContent = document.getElementById('sideContent');
      const chatContainer = document.getElementById('chatContainer');
      const container = document.getElementById('appContainer');

      // Hide side content
      sideContent.style.display = 'none';

      // Ensure chat container takes full width and height
      chatContainer.style.width = '100%';
      chatContainer.style.maxWidth = '100%';
      chatContainer.style.height = 'calc(100vh - 80px)';

      // Remove desktop layout to allow full width
      container.classList.remove('desktop-layout');

      // Ensure the navbar is visible
      document.querySelector('.navigation').style.display = 'flex';

      // Adjust chat messages container for better scrolling
      const chatMessages = document.querySelector('.chat-messages');
      chatMessages.style.maxHeight = 'calc(100% - 180px)';
    }
  };

  // Override the existing goBack function to handle desktop layout
  const originalGoBack = window.goBack;
  window.goBack = function() {
    originalGoBack();

    // Additional desktop-specific handling when exiting fullscreen
    if (window.innerWidth >= 1024) {
      const sideContent = document.getElementById('sideContent');
      const chatContainer = document.getElementById('chatContainer');
      const container = document.getElementById('appContainer');

      // Show side content
      sideContent.style.display = 'flex';

      // Reset chat container styles
      chatContainer.style.width = '';
      chatContainer.style.maxWidth = '';
      chatContainer.style.height = '';

      // Restore desktop layout
      container.classList.add('desktop-layout');

      // Reset chat messages container
      const chatMessages = document.querySelector('.chat-messages');
      chatMessages.style.maxHeight = '';

      // Apply desktop layout again
      applyDesktopLayout();
    }
  };
});
