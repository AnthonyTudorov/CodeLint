import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import './home.css'
import GitHubIcon from '@material-ui/icons/GitHub';
import LinkedInIcon from '@material-ui/icons/LinkedIn';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  control: {
    padding: theme.spacing(2)
  }
}));

export default function GridSystem({info}) {
  const [spacing, setSpacing] = React.useState(2);
  const classes = useStyles();

  return (
    <>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={spacing}>
            {[...Array(info.length/2).keys()].map((value) => (
              <Grid key={value} item>
                <div style={{'marginTop': '2em'}} className="dev-images">
                  <div className={"one-dev"}>
                    <img className={info[value].github ? "dev-imgs" : "tech-imgs"} src={info[value].imgsrc} />
                    <p style={info[value].github ? {color: 'black'} : {color: 'white'}}>{info[value].name}</p>
                    { info[value].github &&
                        <div className='icon-bottom'>
                       <div className='icon-button'>
                          <a href={info[value].github}><GitHubIcon fontSize='large' /></a>
                       </div>
                        <div className='icon-button'>
                          <a href={info[value].linkedin}><LinkedInIcon fontSize='large' /></a>
                        </div>
                     </div>
                    }
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={spacing}>
            {Array.from({length: info.length/2}, (_, i) => i + info.length/2).map((value) => (
               <Grid key={value} item>
                <div style={{'marginTop': '2em', 'marginBottom': '2em'}} className="dev-images">
                  <div className="one-dev">
                     <img className={info[value].github ? "dev-imgs" : "tech-imgs"} src={info[value].imgsrc} />
                    <p style={info[value].github ? {color: 'black'} : {color: 'white'}}>{info[value].name}</p>
                    {info[value].github &&
                    <div className='icon-bottom'>
                      <div className='icon-button'>
                        <a href={info[value].github}><GitHubIcon fontSize='large'/></a>
                      </div>
                      <div className='icon-button'>
                        <a href={info[value].linkedin}><LinkedInIcon fontSize='large'/></a>
                      </div>
                    </div>
                    }
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
    );
}
