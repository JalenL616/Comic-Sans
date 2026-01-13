import { Header } from './components/Header'
import { Counter } from './components/Counter'
import { Footer } from './components/Footer'
import { SearchBar } from './components/SearchBar'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <h1>Vite + React</h1>
      <SearchBar />
      <Counter />
      <Footer />
    </>
  )
}

export default App
