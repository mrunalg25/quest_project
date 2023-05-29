import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { img_500, unavailable, unavailableLandscape } from '../../config/config';
import './ContentModal.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '80%',
  borderRadius: 10,
  border: '1px solid #282c34',
  boxShadow: 24,
  p: 4,
  backgroundColor: '#39445a'
};

export default function ContentModal({children, media_type, id}) {
  const [open, setOpen] = React.useState(false);
  const[content, setContent]= useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData= async()=>{
    const {data} = await axios.get(`https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}`);
    setContent(data);
    console.log(data);

  }

  useEffect(()=>{
    fetchData()
  }, [])

  return (
    <div>
      <div className= "media" onClick={handleOpen}>{children}</div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
                <div className= "ContentModal">
                    <img className= "ContentModal__portrait" 
                        src={content.poster_path ? `${img_500}/${content.poster_path}` : unavailable} 
                        alt={content.name || content.title}>

                    </img>
                    <img className= "ContentModal__landscape" 
                        src={content.backdrop_path ? `${img_500}/${content.backdrop_path}` : unavailableLandscape} 
                        alt={content.name || content.title}>

                    </img>
                    <div className='ContentModal__about'>
                        <span className='ContentModal__title'>
                            {content.name || content.title}(
                                {(
                                    content.first_air_date || content.release_date || '-----'
                                ).substring(0,4)}
                            )

                        </span>
                        <span className='ContentModal__description'>
                            {content.overview}
                        </span>
                        <div>

                        </div>

                    </div>
                </div>

           
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}