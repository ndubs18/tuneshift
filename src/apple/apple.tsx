
declare global {
  interface Window {
    MusicKit?: any;
  }
}

//TODO we need to find an alternative to passing signed jwt as a query param
let queryParams = window.location.search.split('=');
let key = queryParams[1]

const MusicKit = window.MusicKit;

document.addEventListener('musickitloaded', async function () {
    // Call configure() to configure an instance of MusicKit on the Web.
    try {
      console.log("configuring musickit")
      await MusicKit.configure({
        developerToken: key,
        app: {
          name: 'tuneshift',
          build: '1.0.0',
        },
      });
    } catch (err) {
      // Handle configuration error
      console.log(err)
    } 
  });


let getApplePlaylists = async () => {
  const music = MusicKit.getInstance(); 
  await music.authorize();
  const result = await music.api.music('v1/me/library/playlists');
  let playlists = await result
  return playlists;


}

let formatImgUrl = (url : string) => {

  url = url.replace('{w}', '1200');
  url = url.replace('{h}', '1200');
  return url;
}


export {getApplePlaylists, formatImgUrl};