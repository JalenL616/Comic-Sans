import express from 'express'
import cors from 'cors'

// To be added:
// UPC format checker (for type, num digits, format)


const app = express()

app.use(cors())
app.use(express.json())

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Comic search route
app.get('/api/comics', (req, res) => {
  const query = req.query.search;
  if (!query || query === "")
  {
    console.log('No search query provided');
    res.json([])
    return
  }
  console.log(`Searching for: ${query}`);
  res.json([{ id: 1, title: 'Spider-Man #1', upc: query, price: 100 }])
  
})

export default app