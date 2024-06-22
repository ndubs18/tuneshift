declare global {
  interface Window {
    MusicKit?: any;
  }
}

const key = process.env.APPLE_AUTH_KEY

const MusicKit = window.MusicKit
document.addEventListener('musickitloaded', async function () {
    // Call configure() to configure an instance of MusicKit on the Web.
    try {
      await MusicKit.configure({
        developerToken: key,
        app: {
          name: 'tuneshift',
          build: '1978.4.1',
        },
      });
    } catch (err) {
      // Handle configuration error
    }
  
    // MusicKit instance is available
    const music = MusicKit.getInstance();
  });

export {}