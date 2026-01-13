import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from './app.js'

// To be added:
// UPC format checker (for type, num digits, format)


describe('API Routes', () => {
  
  it('GET / returns Hello World', async () => {
    const response = await request(app).get('/')
    
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello World!')
  })

  it('GET /api/comics without search param returns all comics', async () => {
    const response = await request(app).get('/api/comics')
    
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  it('GET /api/comics with empty search returns empty array', async () => {
    const response = await request(app).get('/api/comics?search=')
    
    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('GET /api/comics?search=upc returns matching comics', async () => {
    const response = await request(app).get('/api/comics?search=upc')
    
    expect(response.status).toBe(200)
    expect(response.body[0].upc).toBe('upc')
  })

})