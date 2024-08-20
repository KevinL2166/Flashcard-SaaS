'use client'
import Image from "next/image";
import styles from "./page.module.css";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import getStripe from "./util/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import { Container } from "@mui/material";

import { useUser } from '@clerk/nextjs'
//import { useRouter } from 'next/navigation'

export default function Home() {
  /*const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  //const [setName, setSetName] = useState('')
  const [open, setOpen] = useState(false)*/
  
  //const router = useRouter()

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="lg">
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from input text" />
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Sign In</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Flashcard Board
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Make it easy to create flashcards from your text.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} href="generate">
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid justifyContent="center" container spacing={4}>
          <Grid item xs={12} md={4} >
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Topics at your chioces</Typography>
              <Typography>Create topics based on your input</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} >
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Easy Text Input</Typography>
              <Typography>Input texts in the box</Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4} >
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography variant="h6">Generate your flashcards</Typography>
              <Typography>Generate flashcards according to your topics</Typography>
            </Box>
          </Grid>


        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 5,
                textAlign: 'center',
              }}
            >
              
              <Typography variant="h5" gutterBottom>Basic subscription</Typography>
              <Typography variant="h6" gutterBottom>All basic features included</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, mr: 2 }} 
                href="result">
                  Free
              </Button>
            </Box>

          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 5,
                textAlign: 'center',
              }}
            >
              <Typography variant="h5" gutterBottom>Basic subscription</Typography>
              <Typography variant="h6" gutterBottom>All basic features included</Typography>
              <Button 
                variant="contained" 
                color="primary" 
                sx={{ mt: 2, mr: 2 }} 
                onClick={handleSubmit}
              >
                Pro $3/month
              </Button>
            </Box>

          </Grid>

        </Grid>
      </Box>
    </Container>
  );
}
