'use client'

import { useEffect, useState } from 'react'

import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

//import { doc, collection, getDoc, writeBatch, setDoc } from 'firebase/firestore';
import {
  collection,
  doc,
  writeBatch,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from '/firebase'; // Make sure to adjust the import path according to your project structure



export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  
  const router = useRouter()

  //const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.')
      return
    }
    try {
      const response = await fetch('api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }), // Make sure to send JSON data
      })
  
      if (!response.ok) {
        throw new Error('Failed to generate flashcards')
      }
      console.log('Firebase DB:', db);
      const data = await response.json()
      setFlashcards(data)
    } catch (error) {
      console.error('Error generating flashcards:', error)
      alert('An error occurred while generating flashcards.')
    }
  }


  //const [setName, setSetName] = useState('')
  const [description, setDescription] = useState('');
  const [open, setOpen] = useState(false)
  const handleOpenDialog = () => setDialogOpen(true)
  const handleCloseDialog = () => setDialogOpen(false)

  const saveFlashcards = async () => {
    if (!isLoaded) {
      alert('User data is still loading. Please wait.');
      return;
    }
  
    if (!isSignedIn || !user) {
      alert('You must be signed in to save flashcards.');
      return;
    }

  if (!description.trim()) {
    alert('Please enter a name for your flashcard set.')
    return
  }

  /*try {
    const userDocRef = doc(collection(db, 'users'), user.id)
    const userDocSnap = await getDoc(userDocRef)

    const batch = writeBatch(db)

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data()
      const updatedSets = [...(userData.flashcardSets || []), { name: description }]
      batch.update(userDocRef, { flashcardSets: updatedSets })
    } else {
      batch.set(userDocRef, { flashcardSets: [{ name: description }] })
    }

    const setDocRef = doc(collection(userDocRef, 'flashcardSets'), description)
    batch.set(setDocRef, { flashcards })

    await batch.commit()

    alert('Flashcards saved successfully!')
    handleCloseDialog()
    //setSetName('')
    setDescription('')
  } catch (error) {
    console.error('Error saving flashcards:', error)
    alert('Error occured ${error.message}')
  }*/
  try {
    const userDocRef = doc(collection(db, 'users'), user.id);
    const userDocSnap = await getDoc(userDocRef);
  
    const batch = writeBatch(db);
  
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const updatedSets = [...(userData.flashcardSets || []), { name: description }];
      batch.update(userDocRef, { flashcardSets: updatedSets });
    } else {
      batch.set(userDocRef, { flashcardSets: [{ name: description }] });
    }
  
    const setDocRef = doc(collection(userDocRef, 'flashcardSets'), description);
    batch.set(setDocRef, { flashcards });
  
    await batch.commit();
  
    alert('Flashcards saved successfully!');
    handleCloseDialog();
    setDescription('');
  } catch (error) {
    console.error('Error saving flashcards:', error.message, error.code);
    alert(`Error occurred: ${error.message}`);
  }
  
}
const handleCardClick = (id) => {
  setFlipped((prev) => ({
    ...prev,
    [id]: !prev[id],
  }))
}


  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards, Enter Text Below
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate
        </Button>
      </Box>
      
      {/* We'll add flashcard display here */}
      {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                Created Flashcards
                </Typography>
                <Grid container spacing={2}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                        
                        <CardActionArea onClick = {() => {handleCardClick(index)}}>
                          
                          <CardContent>
                          <Box
                            sx={{perspective: '1000px',
                                 '& > div':{
                                    transition: 'transform 0.6s',
                                    transformStyle: 'preserve-3d',
                                    position: 'relative',
                                    width: '100%',
                                    height: '200px',
                                    //boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                    transform: flipped[index]? 'rotateY(180deg)':'rotateY(0deg)'
                                 },
                                 '& > div > div': {
                                  position: 'absolute',
                                  width: '100%',
                                  height: '100%',
                                  backfaceVisibility: 'hidden',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  fontSize: '18px',
                                },
                                '& > div > div.back': {
                                  transform: 'rotateY(180deg)',
                                },
                              }
                            }
                          >
                            <div>
                              <div className='front'>
                                {/*<Typography variant="h6">Front:</Typography>*/}
                                <Typography>{flashcard.front}</Typography>
                              </div>
                              <div className='back'>
                                {/*<Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>*/}
                                <Typography>{flashcard.back}</Typography>
                              </div>
                            </div>
                            
                          </Box>
                        </CardContent>


                          
                        </CardActionArea>


                    </Card>
                    </Grid>
                ))}

                </Grid>
            </Box>
        )}

        {flashcards.length > 0 && (
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Save Flashcards
            </Button>
          </Box>
        )}


      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            //value={setName}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
        
    </Container>
  )
}