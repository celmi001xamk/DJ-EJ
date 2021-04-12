import {
  Button,
  Container,
  makeStyles,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  Paper,
} from "@material-ui/core";
import { useRef, useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import YouTube from "react-youtube";


const useStyles = makeStyles({
  background: {
    background:
      "linear-gradient(180deg, rgb(245,245,245) 0%, rgb(185,185,185) 9%)",
    maxWidth: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  searchContainer: {
    padding: 10,
    height: 80,
  },
  searchBtn: {
    height: 55,
    width: "15%",
    fontSize: "1rem",
  },
  searchField: {
    width: "75%",
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "rgb(245,245,245)",
  },

  paper: {
    display: "flex",
    width: "100%",
    minHeight: 200,
    padding: 0,
  },
  thumbnail: {
    width: "30%",
    maxWidth: 300,
    boxShadow: "black 0 0 3px 3px",
    margin: 10,
  },
  listItem: {
    marginBottom: 5,
    backgroundColor: "rgb(245,245,245)",
  },
  player: {
    position: "relative",
    paddingBottom: "56.25%",
    paddinTop: 35,
    height: 0,
    overflow: "hidden",
  },
  iframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  playlist: {
    width: "100%",
    overflow: "auto",
    maxHeight: "60vh",
  },
  playlistContainer: {
    display: "flex",
    flexDirection: "column",
    maxWidth: 450,
    width: "100%",
    maxHeight: "100vh",
  },
  playlistIconsContainer: {
    width: 20,
    display: "flex",
    flexWrap: "wrap",
  },
});

export function Frontpage({
  playlist,
  setPlaylist,
  shiftPlaylist,
  currentVideo,
  setCurrentVideo,
}) {
  const styles = useStyles();
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  const [searchItems, setSearchItems] = useState([]);
  const [searchActive, setSearchActive] = useState(false);
  const q = useRef("");

  const inputHandler = (e) => {
    q.current = e.target.value;
  };

  const searchVideos = async (e) => {
    e.preventDefault();
    setSearchActive(true);
    try {
      const parameters = `part=snippet&maxResults=10&q=${q.current}&type=video&key=${apiKey}`;
      const connection = await fetch(
        `https://www.googleapis.com/youtube/v3/search?${parameters}`
      );
      if (connection.status === 200) {
        const results = await connection.json();
        setSearchItems(results.items);
      } else {
        alert("Out of quotas. Better luck tomorrow.");
        setSearchActive(false);
      }
      
    } catch (error) {
      alert(`Error in search: ${error}`);
    }
  };
  const addToPlaylist = (video) => {
    const videosWithSameId = playlist.filter((playlistVideo) => {
      return playlistVideo.id.videoId === video.id.videoId;
    });
    if (videosWithSameId.length === 0) {
      const updatedPlaylist = [video, ...playlist];
      setPlaylist([...updatedPlaylist]);
    }
    setSearchActive(false);
  };

  const moveUpOnPlaylist = (video) => {
    const updatedPlaylist = playlist;

    for (let i = 1; i < playlist.length; i++) {
      if (video.id.videoId === playlist[i].id.videoId) {
        updatedPlaylist[i] = playlist[i - 1];
        updatedPlaylist[i - 1] = video;
        i += playlist.length;
      }
    }
    setPlaylist([...updatedPlaylist]);

    console.log(updatedPlaylist);
  };
  const moveDownOnPlaylist = (video) => {
    const updatedPlaylist = playlist;

    for (let i = 0; i < playlist.length - 1; i++) {
      if (video.id.videoId === playlist[i].id.videoId) {
        updatedPlaylist[i] = playlist[i + 1];
        updatedPlaylist[i + 1] = video;
        i += playlist.length;
      }
    }
    setPlaylist([...updatedPlaylist]);
  };
  const removeVideo = (video) => {
    const updatedPlaylist = playlist.filter((playlistVideo) => {
      return playlistVideo.id.videoId !== video.id.videoId;
    });
    setPlaylist([...updatedPlaylist]);
  };

  const playVideo = (video) => {
    const updatedPlaylist = playlist.filter((playlistVideo) => {
      return playlistVideo.id.videoId !== video.id.videoId;
    });

    setPlaylist([...updatedPlaylist, video]);
    setCurrentVideo(video);
  };

  return (
    <Container className={styles.background} maxWidth={false}>
      <Container
        maxWidth="lg"
        align="center"
        className={styles.searchContainer}
      >
        <form onSubmit={searchVideos}>
          <TextField
            fullWidth
            variant="outlined"
            classes={{ root: styles.searchField }}
            label="Search"
            onChange={inputHandler}
            color="secondary"
          />
          <Button
            type="submit"
            className={styles.searchBtn}
            variant="contained"
            color="secondary"
            align="right"
          >
            Search
          </Button>
          {playlist.length === 0 ? (
            <Container>
              <Typography variant="h4" style={{ paddingTop: 50 }}>
                Search and add videos on to your playlist!
              </Typography>
            </Container>
          ) : null}
        </form>
      </Container>

      <Container maxWidth="md" className={styles.searchResultsContainer}>
        <Dialog open={searchActive} onClose={() => setSearchActive(false)}>
          <List>
            {searchItems.map((video, idx) => {
              return (
                <ListItem className={styles.listItem} key={idx}>
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    className={styles.thumbnail}
                    alt="thumbnail"
                  />
                  <ListItemText>
                    <Typography variant="h6">{video.snippet.title}</Typography>
                  </ListItemText>
                  <ListItemIcon>
                    <IconButton onClick={() => addToPlaylist(video)}>
                      <AddIcon fontSize="large" color="secondary" />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              );
            })}
          </List>
        </Dialog>
      </Container>

      <Container>
        <div className={styles.player}>
          {currentVideo ? (
            <YouTube
              className={styles.iframe}
              videoId={currentVideo.id.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              onEnd={() => shiftPlaylist()}
            />
          ) : null}
        </div>
      </Container>
      {currentVideo ? (
        <Container className={styles.playlistContainer}>
          <Typography variant="h5">Currently playing:</Typography>
          <Paper style={{ padding: 10, marginBottom: 10 }}>
            <Typography variant="body1">{currentVideo.snippet.title}</Typography>
          </Paper>

          <Typography variant="h5">Up next:</Typography>
          <List className={styles.playlist}>
            {playlist.map((video) => {
              return (
                <ListItem className={styles.listItem} key={video.id.videoId}>
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    className={styles.thumbnail}
                    alt="thumbnail"
                  />
                  <ListItemText>
                    <Typography>{video.snippet.title}</Typography>
                  </ListItemText>
                  <ListItemIcon className={styles.playlistIconsContainer}>
                    <IconButton onClick={() => moveUpOnPlaylist(video)}>
                      <ArrowUpwardIcon fontSize="small" color="secondary" />
                    </IconButton>
                    <IconButton onClick={() => moveDownOnPlaylist(video)}>
                      <ArrowDownwardIcon fontSize="small" color="secondary" />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemIcon className={styles.playlistIconsContainer}>
                    <IconButton onClick={() => playVideo(video)}>
                      <PlayArrowIcon fontSize="small" color="secondary" />
                    </IconButton>
                    <IconButton onClick={() => removeVideo(video)}>
                      <DeleteForeverIcon fontSize="small" color="secondary" />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              );
            })}
          </List>
        </Container>
      ) : null}
    </Container>
  );
}
