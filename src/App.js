import { useEffect, useState } from "react";
import { Frontpage } from "./komponentit/Frontpage";

function App() {
  const [playlist, setPlaylist] = useState([]);
  const [currentVideo, setCurrentVideo] = useState();

  const savePlaylist = () => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
  };

  const openPlaylist = () => {
    if (localStorage.getItem("playlist")) {
      setPlaylist(JSON.parse(localStorage.getItem("playlist")));
    } else {
      setPlaylist([]);
    }
  };

  useEffect(() => {
    openPlaylist();
  }, []);

  useEffect(() => {
    savePlaylist();
    if (!currentVideo) {
      setCurrentVideo(playlist[playlist.length - 1]);
    }
  }, [playlist]);

  const shiftPlaylist = () => {
    const lastVideo = playlist[0];
    const updatedPlaylist = playlist.filter((video) => {
      return video.id.videoId !== lastVideo.id.videoId;
    });
    updatedPlaylist.push(lastVideo);
    setPlaylist([...updatedPlaylist]);
    setCurrentVideo(playlist[0]);
  };

  return (
    <Frontpage
      playlist={playlist}
      setPlaylist={setPlaylist}
      shiftPlaylist={shiftPlaylist}
      currentVideo={currentVideo}
      setCurrentVideo={setCurrentVideo}
    />
  );
}

export default App;
