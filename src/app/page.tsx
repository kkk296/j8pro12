'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Search, Star, TrendingUp, TrendingDown, ExternalLink, Lock, Unlock, 
  MessageCircle, Send, Calendar, Clock, AlertTriangle, RefreshCw,
  Target, BarChart3, Newspaper, X, Sparkles, Bell, Palette, Crown, User, Clock4
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'

// Types
interface Stock {
  symbol: string
  name: string
  sector: string
  price: number
  change: number
  pChange: number
  o: number
  h: number
  l: number
  c: number
  todayOpen?: number
  todayHigh?: number
  todayLow?: number
  todayClose?: number
  prevMonthHigh?: number
  prevMonthLow?: number
  prevMonthClose?: number
  week52High?: number
  week52Low?: number
  lifetimeHigh?: number
  lifetimeLow?: number
}

interface NewsItem {
  name: string
  url: string
  snippet: string
  host_name: string
  date: string
}

interface Favorite {
  symbol: string
  name: string
}

interface UserSession {
  token: string
  userType: 'admin' | 'client' | 'demo'
  activatedAt: string
  expiresAt: string | null
}

type CalculationMode = 'yClose' | 'yHigh' | 'yLow' | 'tOpen' | 'tHigh' | 'tLow' | 'pmHigh' | 'pmLow' | 'live' | 'custom'

// Extended FNO Stocks List
const FNO_STOCKS = [
  // Indices
  { symbol: 'NIFTY', name: 'NIFTY 50', sector: 'Index' },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY', sector: 'Index' },
  { symbol: 'FINNIFTY', name: 'FIN NIFTY', sector: 'Index' },
  { symbol: 'MIDCPNIFTY', name: 'MIDCAP NIFTY', sector: 'Index' },
  
  // NIFTY 50 Stocks
  { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy' },
  { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking' },
  { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom' },
  { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking' },
  { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Capital Goods' },
  { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer Durables' },
  { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Automobile' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharma' },
  { symbol: 'TITAN', name: 'Titan Company Ltd', sector: 'Consumer Durables' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Financial Services' },
  { symbol: 'DMART', name: 'Avenue Supermarts Ltd', sector: 'Retail' },
  { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT' },
  { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT' },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', sector: 'Cement' },
  { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Power' },
  { symbol: 'POWERGRID', name: 'Power Grid Corporation of India Ltd', sector: 'Power' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile' },
  { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', sector: 'Metals' },
  { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd', sector: 'Energy' },
  { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', sector: 'Metals' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Automobile' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate' },
  { symbol: 'ADANIPORTS', name: 'Adani Ports and SEZ Ltd', sector: 'Infrastructure' },
  { symbol: 'TMCV', name: 'Tata Motors CV', sector: 'Automobile' },
  { symbol: 'TMPV', name: 'Tata Motors PV', sector: 'Automobile' },
  { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking' },
  { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd', sector: 'Banking' },
  { symbol: 'RBLBANK', name: 'RBL Bank Ltd', sector: 'Banking' },
  { symbol: 'IDFCFIRSTB', name: 'IDFC FIRST Bank Ltd', sector: 'Banking' },
  { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking' },
  { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking' },
  { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Banking' },
  { symbol: 'AUBANK', name: 'AU Small Finance Bank Ltd', sector: 'Banking' },
  { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', sector: 'Financial Services' },
  { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd', sector: 'Insurance' },
  { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd', sector: 'Insurance' },
  { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT' },
  { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT' },
  { symbol: 'DRREDDY', name: "Dr Reddy's Laboratories Ltd", sector: 'Pharma' },
  { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma' },
  { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', sector: 'Healthcare' },
  { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd', sector: 'Pharma' },
  { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', sector: 'Automobile' },
  { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', sector: 'Automobile' },
  { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', sector: 'Automobile' },
  { symbol: 'MRF', name: 'MRF Ltd', sector: 'Automobile' },
  { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', sector: 'Metals' },
  { symbol: 'COALINDIA', name: 'Coal India Ltd', sector: 'Mining' },
  { symbol: 'VEDL', name: 'Vedanta Ltd', sector: 'Metals' },
  { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd', sector: 'Metals' },
  { symbol: 'SAIL', name: 'Steel Authority of India Ltd', sector: 'Metals' },
  { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd', sector: 'Energy' },
  { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Ltd', sector: 'Energy' },
  { symbol: 'GAIL', name: 'GAIL (India) Ltd', sector: 'Energy' },
  { symbol: 'PETRONET', name: 'Petronet LNG Ltd', sector: 'Energy' },
  { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', sector: 'Power' },
  { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG' },
  { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG' },
  { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG' },
  { symbol: 'DLF', name: 'DLF Ltd', sector: 'Real Estate' },
  { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd', sector: 'Cement' },
  { symbol: 'ACC', name: 'ACC Ltd', sector: 'Cement' },
  { symbol: 'SHREECEM', name: 'Shree Cement Ltd', sector: 'Cement' },
  { symbol: 'IDEA', name: 'Vodafone Idea Ltd', sector: 'Telecom' },
  { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd', sector: 'Aviation' },
  { symbol: 'SRF', name: 'SRF Ltd', sector: 'Chemicals' },
  { symbol: 'PIIND', name: 'PI Industries Ltd', sector: 'Chemicals' },
  { symbol: 'UPL', name: 'UPL Ltd', sector: 'Chemicals' },
  { symbol: 'SIEMENS', name: 'Siemens Ltd', sector: 'Capital Goods' },
  { symbol: 'ABB', name: 'ABB India Ltd', sector: 'Capital Goods' },
  { symbol: 'BHEL', name: 'Bharat Heavy Electricals Ltd', sector: 'Capital Goods' },
  { symbol: 'TRENT', name: 'Trent Ltd', sector: 'Retail' },
  { symbol: 'GRASIM', name: 'Grasim Industries Ltd', sector: 'Conglomerate' },
]

// Gann Steps for calculation
const GANN_STEPS = {
  buy: { up: 0.333, avg: 0.250, sl: 0.166, t1: 0.416, t2: 0.500, t3: 0.666 },
  sell: { below: -0.333, avg: -0.250, sl: -0.166, t1: -0.416, t2: -0.500, t3: -0.666 }
}

// NIFTY Indices for display
const NIFTY_INDICES = [
  { symbol: 'NIFTY', name: 'NIFTY 50', sector: 'Index' },
  { symbol: 'BANKNIFTY', name: 'BANK NIFTY', sector: 'Index' },
  { symbol: 'FINNIFTY', name: 'FIN NIFTY', sector: 'Index' },
  { symbol: 'MIDCPNIFTY', name: 'MIDCAP NIFTY', sector: 'Index' },
  { symbol: 'NIFTYIT', name: 'NIFTY IT', sector: 'Index' },
  { symbol: 'NIFTYAUTO', name: 'NIFTY AUTO', sector: 'Index' },
]

// Generate simulated stock data
function generateStockData(symbol: string, name: string, sector: string): Stock {
  const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const basePrice = symbol.includes('NIFTY') ? 20000 + (seed % 5000) : 100 + (seed % 4000)
  const changeP = (Math.random() * 6) - 3
  const livePrice = basePrice * (1 + changeP / 100)
  
  return {
    symbol,
    name,
    sector,
    price: Math.round(livePrice * 100) / 100,
    change: Math.round((livePrice - basePrice) * 100) / 100,
    pChange: Math.round(changeP * 100) / 100,
    o: Math.round(basePrice * 0.995 * 100) / 100,
    h: Math.round(basePrice * 1.02 * 100) / 100,
    l: Math.round(basePrice * 0.98 * 100) / 100,
    c: Math.round(basePrice * 100) / 100,
    todayOpen: Math.round(livePrice * 0.995 * 100) / 100,
    todayHigh: Math.round(livePrice * 1.015 * 100) / 100,
    todayLow: Math.round(livePrice * 0.985 * 100) / 100,
    todayClose: Math.round(livePrice * 100) / 100,
    prevMonthHigh: Math.round(basePrice * 1.08 * 100) / 100,
    prevMonthLow: Math.round(basePrice * 0.92 * 100) / 100,
    prevMonthClose: Math.round(basePrice * 0.98 * 100) / 100,
    week52High: Math.round(basePrice * 1.25 * 100) / 100,
    week52Low: Math.round(basePrice * 0.75 * 100) / 100,
    lifetimeHigh: Math.round(basePrice * 1.5 * 100) / 100,
    lifetimeLow: Math.round(basePrice * 0.5 * 100) / 100,
  }
}

// Calculate Gann levels
function calculateGann(price: number, multiplier: number) {
  const baseSqrt = Math.sqrt(price)
  const step = (val: number) => Math.pow(baseSqrt + (val * multiplier), 2)
  
  return {
    buy: {
      entry: step(GANN_STEPS.buy.up),
      avg: step(GANN_STEPS.buy.avg),
      sl: step(GANN_STEPS.buy.sl),
      t1: step(GANN_STEPS.buy.t1),
      t2: step(GANN_STEPS.buy.t2),
      t3: step(GANN_STEPS.buy.t3)
    },
    sell: {
      entry: step(GANN_STEPS.sell.below),
      avg: step(GANN_STEPS.sell.avg),
      sl: step(GANN_STEPS.sell.sl),
      t1: step(GANN_STEPS.sell.t1),
      t2: step(GANN_STEPS.sell.t2),
      t3: step(GANN_STEPS.sell.t3)
    }
  }
}

export default function Home() {
  // Lock Screen State
  const [isLocked, setIsLocked] = useState(true)
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [session, setSession] = useState<UserSession | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Color/Theme State
  const [backgroundColor, setBackgroundColor] = useState('#000000')
  const [showColorPicker, setShowColorPicker] = useState(false)
  
  // Color palette options
  const COLOR_PALETTE = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Blue', value: '#0a1628' },
    { name: 'Navy', value: '#1a1f36' },
    { name: 'Dark Purple', value: '#1a0a28' },
    { name: 'Dark Red', value: '#280a0a' },
    { name: 'Dark Green', value: '#0a280a' },
    { name: 'Orange', value: '#2a1a0a' },
    { name: 'Gray', value: '#1a1a1a' },
  ]
  
  // App State
  const [stocks, setStocks] = useState<Stock[]>([])
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('all')
  const [news, setNews] = useState<NewsItem[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  // Calculator State - Default is Y.Close (Yesterday's Close)
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('yClose')
  const [customPrice, setCustomPrice] = useState<number>(0)
  const [multiplier, setMultiplier] = useState<number>(1)
  
  // All available multipliers
  const MULTIPLIERS = [1, 1.25, 2, 2.5, 3, 4, 5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 32, 35, 64, 100]
  const [alertPrice, setAlertPrice] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<string>('buy')
  const [mainTab, setMainTab] = useState<string>('dashboard')
  
  // Get calculation price based on mode
  const getCalcPrice = useCallback(() => {
    if (!selectedStock) return 0
    
    switch (calculationMode) {
      case 'yClose': return selectedStock.c
      case 'yHigh': return selectedStock.h
      case 'yLow': return selectedStock.l
      case 'tOpen': return selectedStock.todayOpen || selectedStock.o
      case 'tHigh': return selectedStock.todayHigh || selectedStock.h
      case 'tLow': return selectedStock.todayLow || selectedStock.l
      case 'pmHigh': return selectedStock.prevMonthHigh || selectedStock.h
      case 'pmLow': return selectedStock.prevMonthLow || selectedStock.l
      case 'live': return selectedStock.price
      case 'custom': return customPrice
      default: return selectedStock.c
    }
  }, [selectedStock, calculationMode, customPrice])
  
  // Get OHLC for display
  const getOHLC = useCallback(() => {
    if (!selectedStock) return { o: 0, h: 0, l: 0, c: 0 }
    return {
      o: selectedStock.todayOpen || selectedStock.o,
      h: selectedStock.todayHigh || selectedStock.h,
      l: selectedStock.todayLow || selectedStock.l,
      c: selectedStock.todayClose || selectedStock.price
    }
  }, [selectedStock])
  
  // Fetch stocks from API (real-time data)
  const fetchStocks = useCallback(async () => {
    try {
      const res = await fetch('/api/stocks')
      
      if (!res.ok) {
        console.error('Stocks API error:', res.status)
        return
      }
      
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Stocks API returned non-JSON response')
        return
      }
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Failed to parse stocks JSON')
        return
      }
      
      if (data.stocks && data.stocks.length > 0) {
        setStocks(data.stocks)
      }
    } catch (error) {
      console.error('Failed to fetch stocks:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize stocks and set up real-time updates
  useEffect(() => {
    // Initial load
    fetchStocks()
    
    // Refresh every 10 seconds for real-time data
    const interval = setInterval(fetchStocks, 10000)
    return () => clearInterval(interval)
  }, [fetchStocks])
  
  // Update selected stock when stocks data refreshes
  useEffect(() => {
    if (selectedStock && stocks.length > 0) {
      const updatedStock = stocks.find(s => s.symbol === selectedStock.symbol)
      if (updatedStock && updatedStock.price !== selectedStock.price) {
        setSelectedStock(updatedStock)
      }
    }
  }, [stocks, selectedStock])
  
  // Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('/api/favorites')
        
        if (!res.ok) return
        
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) return
        
        const text = await res.text()
        let data
        try {
          data = JSON.parse(text)
        } catch {
          return
        }
        
        setFavorites(data.favorites || [])
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      }
    }
    if (!isLocked) fetchFavorites()
  }, [isLocked])
  
  // Fetch news
  useEffect(() => {
    const fetchNews = async () => {
      if (!selectedStock) return
      setNewsLoading(true)
      try {
        const res = await fetch(`/api/news?symbol=${selectedStock.symbol}`)
        
        if (!res.ok) {
          setNewsLoading(false)
          return
        }
        
        const contentType = res.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          setNewsLoading(false)
          return
        }
        
        const text = await res.text()
        let data
        try {
          data = JSON.parse(text)
        } catch {
          setNewsLoading(false)
          return
        }
        
        setNews(data.results || [])
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setNewsLoading(false)
      }
    }
    if (!isLocked && mainTab === 'news') fetchNews()
  }, [selectedStock, isLocked, mainTab])
  
  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  // Alert monitoring
  useEffect(() => {
    if (!selectedStock || !alertPrice) return
    const interval = setInterval(() => {
      if (selectedStock.price >= alertPrice) {
        speakAlert(`Alert! ${selectedStock.symbol} crossed ${alertPrice}`)
        toast({ title: 'Breakout Alert', description: `${selectedStock.symbol} crossed ${alertPrice}!` })
      } else if (selectedStock.price <= alertPrice) {
        speakAlert(`Alert! ${selectedStock.symbol} fell below ${alertPrice}`)
        toast({ title: 'Breakdown Alert', description: `${selectedStock.symbol} fell below ${alertPrice}!` })
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [selectedStock, alertPrice])
  
  // Filter stocks
  const filteredStocks = stocks.filter(s => {
    const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSector = selectedSector === 'all' || s.sector === selectedSector
    return matchesSearch && matchesSector
  })
  
  // Gainers and losers
  const gainers = filteredStocks.filter(s => s.pChange > 0).sort((a, b) => b.pChange - a.pChange)
  const losers = filteredStocks.filter(s => s.pChange < 0).sort((a, b) => a.pChange - b.pChange)
  
  // Get sectors
  const sectors = [...new Set(stocks.map(s => s.sector))].sort()
  
  // Check for existing session on mount
  useEffect(() => {
    // Run only after component mounts (client-side only)
    const checkSession = async () => {
      try {
        // Clear any corrupted data by checking version
        const version = localStorage.getItem('j8pro_version')
        if (version !== '2.0') {
          // Clear all localStorage and set new version
          localStorage.clear()
          localStorage.setItem('j8pro_version', '2.0')
          console.log('Cleared old cache, please refresh if needed')
          return
        }
        
        const savedToken = localStorage.getItem('j8pro_token')
        if (savedToken && savedToken.length < 100) { // Basic validation
          await verifySession(savedToken)
        }
      } catch (error) {
        // localStorage might not be available
        console.log('No saved session')
      }
    }
    
    // Small delay to ensure page is loaded
    const timer = setTimeout(checkSession, 100)
    return () => clearTimeout(timer)
  }, [])
  
  // Verify session with server
  const verifySession = async (token: string) => {
    try {
      const res = await fetch(`/api/auth?token=${encodeURIComponent(token)}`)
      
      // Check if response is ok and JSON
      if (!res.ok) {
        localStorage.removeItem('j8pro_token')
        return
      }
      
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        localStorage.removeItem('j8pro_token')
        return
      }
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        localStorage.removeItem('j8pro_token')
        return
      }
      
      if (data.valid) {
        setSession(data.session)
        setIsLocked(false)
        if (data.settings?.backgroundColor) {
          setBackgroundColor(data.settings.backgroundColor)
        }
      } else {
        localStorage.removeItem('j8pro_token')
        if (data.reason === 'expired') {
          setErrorMessage('Your access has expired. Please contact admin to renew.')
        }
      }
    } catch (error) {
      console.log('Session verify error')
      try {
        localStorage.removeItem('j8pro_token')
      } catch (e) {
        // Ignore localStorage errors
      }
    }
  }
  
  // Check password via API
  const checkPassword = async () => {
    setAuthLoading(true)
    setErrorMessage('')
    setPasswordError(false)
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      
      // Check if response is ok
      if (!res.ok) {
        setPasswordError(true)
        setErrorMessage('Server error. Please try again.')
        setAuthLoading(false)
        return
      }
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        setPasswordError(true)
        setErrorMessage('Server error. Please refresh and try again.')
        setAuthLoading(false)
        return
      }
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        setPasswordError(true)
        setErrorMessage('Server error. Please refresh.')
        setAuthLoading(false)
        return
      }
      
      if (data.success) {
        setSession(data.session)
        try {
          localStorage.setItem('j8pro_token', data.session.token)
        } catch (e) {
          // Ignore localStorage errors
        }
        setIsLocked(false)
        setPassword('')
      } else {
        setPasswordError(true)
        setErrorMessage(data.error || 'Invalid password')
        setTimeout(() => {
          setPasswordError(false)
        }, 2000)
      }
    } catch (error) {
      setPasswordError(true)
      setErrorMessage('Server error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }
  
  // Update background color
  const updateBackgroundColor = async (color: string) => {
    setBackgroundColor(color)
    if (session?.token) {
      try {
        await fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: session.token, backgroundColor: color })
        })
      } catch (error) {
        console.error('Failed to save color:', error)
      }
    }
  }
  
  // Logout
  const logout = () => {
    try {
      localStorage.removeItem('j8pro_token')
    } catch (e) {
      // Ignore localStorage errors
    }
    setSession(null)
    setIsLocked(true)
  }
  
  // Get user type label
  const getUserTypeLabel = () => {
    switch (session?.userType) {
      case 'admin': return '👑 Admin'
      case 'client': return '👤 Client'
      case 'demo': return '⏰ Demo'
      default: return ''
    }
  }
  
  // Get remaining time
  const getRemainingTime = () => {
    if (!session?.expiresAt) return null
    const expires = new Date(session.expiresAt)
    const now = new Date()
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h left`
    return `${hours}h left`
  }
  
  // Add to favorites
  const addToFavorites = async (stock: Stock) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: stock.symbol, name: stock.name })
      })
      
      if (!res.ok) {
        toast({ title: 'Error', description: 'Failed to add favorite', variant: 'destructive' })
        return
      }
      
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        toast({ title: 'Error', description: 'Server error', variant: 'destructive' })
        return
      }
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        toast({ title: 'Error', description: 'Server error', variant: 'destructive' })
        return
      }
      
      if (data.success) {
        setFavorites([...favorites, { symbol: stock.symbol, name: stock.name }])
        toast({ title: 'Added to Favorites' })
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to add favorite', variant: 'destructive' })
    }
  }
  
  // Remove from favorites
  const removeFromFavorites = async (symbol: string) => {
    try {
      await fetch(`/api/favorites?symbol=${symbol}`, { method: 'DELETE' })
      setFavorites(favorites.filter(f => f.symbol !== symbol))
      toast({ title: 'Removed from Favorites' })
    } catch {
      toast({ title: 'Error', description: 'Failed to remove favorite', variant: 'destructive' })
    }
  }
  
  // Check if favorite
  const isFavorite = (symbol: string) => favorites.some(f => f.symbol === symbol)
  
  // Share Buy levels to WhatsApp
  const shareBuyWhatsApp = () => {
    if (!selectedStock) return
    const levels = calculateGann(getCalcPrice(), multiplier)
    const dateStr = formatDate(currentTime)
    const timeStr = formatTime(currentTime)
    const text = `🔮 *J8PRO Magic Levels* - ${selectedStock.symbol}

📅 Date: ${dateStr}
🕐 Time: ${timeStr}

🟢 *BUY LEVELS:*
Entry: ${levels.buy.entry.toFixed(2)}
Avg: ${levels.buy.avg.toFixed(2)}
SL: ${levels.buy.sl.toFixed(2)}
T1: ${levels.buy.t1.toFixed(2)}
T2: ${levels.buy.t2.toFixed(2)}
T3: ${levels.buy.t3.toFixed(2)}

_Price: ${getCalcPrice().toFixed(2)}_

⚠️ *Disclaimer:* This is for educational purposes only. Not financial advice. Trade at your own risk. J8PRO is not responsible for any losses.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
  
  // Share Sell levels to WhatsApp
  const shareSellWhatsApp = () => {
    if (!selectedStock) return
    const levels = calculateGann(getCalcPrice(), multiplier)
    const dateStr = formatDate(currentTime)
    const timeStr = formatTime(currentTime)
    const text = `🔮 *J8PRO Magic Levels* - ${selectedStock.symbol}

📅 Date: ${dateStr}
🕐 Time: ${timeStr}

🔴 *SELL LEVELS:*
Entry: ${levels.sell.entry.toFixed(2)}
Avg: ${levels.sell.avg.toFixed(2)}
SL: ${levels.sell.sl.toFixed(2)}
T1: ${levels.sell.t1.toFixed(2)}
T2: ${levels.sell.t2.toFixed(2)}
T3: ${levels.sell.t3.toFixed(2)}

_Price: ${getCalcPrice().toFixed(2)}_

⚠️ *Disclaimer:* This is for educational purposes only. Not financial advice. Trade at your own risk. J8PRO is not responsible for any losses.`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
  
  // Share to Telegram
  const shareTelegram = () => {
    if (!selectedStock) return
    const levels = calculateGann(getCalcPrice(), multiplier)
    const text = `🔮 *J8PRO Magic Levels* - ${selectedStock.symbol}

🟢 BUY: ${levels.buy.entry.toFixed(2)} | 🔴 SELL: ${levels.sell.entry.toFixed(2)}
Price: ${getCalcPrice().toFixed(2)} | Multiplier: ${multiplier}x`
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://j8pro.com')}&text=${encodeURIComponent(text)}`, '_blank')
  }
  
  // Open TradingView
  const openTradingView = (symbol: string) => {
    window.open(`https://www.tradingview.com/chart/?symbol=NSE:${symbol}`, '_blank')
  }
  
  // Get related stocks
  const getRelatedStocks = (stock: Stock) => {
    return stocks.filter(s => s.sector === stock.sector && s.symbol !== stock.symbol).slice(0, 5)
  }
  
  // Speak alert
  const speakAlert = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-IN'
      utterance.rate = 1.0
      window.speechSynthesis.speak(utterance)
    }
  }
  
  // Format date/time
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  
  // Get levels for display
  const levels = selectedStock ? calculateGann(getCalcPrice(), multiplier) : null
  const ohlc = getOHLC()
  
  // Calculation mode labels
  const modeLabels: Record<CalculationMode, string> = {
    yClose: 'Y.Close',
    yHigh: 'Y.High',
    yLow: 'Y.Low',
    tOpen: 'T.Open',
    tHigh: 'T.High',
    tLow: 'T.Low',
    pmHigh: 'PM.High',
    pmLow: 'PM.Low',
    live: 'Live',
    custom: 'Custom'
  }

  // Lock Screen
  if (isLocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950 to-black">
        <div className="w-full max-w-sm px-4">
          <Card className="bg-gray-900/90 border-purple-500/50 shadow-2xl shadow-purple-500/20">
            <CardContent className="pt-8 pb-6 px-6 text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500 bg-clip-text text-transparent mb-2">
                J8PRO LOCKED
              </h1>
              <p className="text-gray-500 text-sm mb-6">Access Restricted for Clients</p>
              
              {errorMessage && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-sm">{errorMessage}</p>
                </div>
              )}
              
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !authLoading && checkPassword()}
                placeholder="Enter Password"
                className="bg-black border-gray-700 text-white text-center mb-4 focus:border-purple-500"
                disabled={authLoading}
              />
              
              <Button
                onClick={checkPassword}
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    UNLOCKING...
                  </>
                ) : (
                  <>
                    <Unlock className="h-4 w-4 mr-2" />
                    UNLOCK DASHBOARD
                  </>
                )}
              </Button>
              
              {passwordError && (
                <p className="text-red-500 text-sm mt-4 animate-pulse">Incorrect Password!</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ backgroundColor }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-950/80 to-gray-900/80 backdrop-blur-sm border-b border-gray-800 px-2 sm:px-4 py-2 sm:py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-red-500 bg-clip-text text-transparent">
              J8PRO — LIVE MAGIC DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Type Badge */}
            <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 rounded-full">
              <span className="text-xs font-medium text-purple-300">{getUserTypeLabel()}</span>
            </div>
            {getRemainingTime() && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 rounded-full">
                <Clock4 className="h-3 w-3 text-yellow-400" />
                <span className="text-xs text-yellow-300">{getRemainingTime()}</span>
              </div>
            )}
            
            {/* Live indicator */}
            <div className="hidden md:flex items-center gap-4 text-xs text-white/70">
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-400 font-medium">LIVE</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-mono">{formatTime(currentTime)}</span>
              </div>
            </div>
            <div className="flex md:hidden items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-green-400 font-medium text-xs">LIVE</span>
            </div>
            
            {/* Color Picker Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="border-gray-700 text-white/70 hover:text-white h-7 sm:h-8"
              >
                <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              
              {showColorPicker && (
                <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg p-3 z-50 shadow-xl">
                  <p className="text-xs text-white/70 mb-2">Background Color</p>
                  <div className="grid grid-cols-4 gap-2">
                    {COLOR_PALETTE.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => {
                          updateBackgroundColor(color.value)
                          setShowColorPicker(false)
                        }}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          backgroundColor === color.value 
                            ? 'border-purple-500 scale-110' 
                            : 'border-gray-600 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-gray-700 text-white/70 hover:text-white h-7 sm:h-8"
            >
              <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="border-red-700 text-red-400 hover:text-red-300 hover:bg-red-900/20 h-7 sm:h-8"
            >
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-2 sm:p-4">
        <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-3 sm:mb-4 bg-gray-900 border border-gray-800 h-9 sm:h-10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm h-8 sm:h-9">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="favorites" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm h-8 sm:h-9">
              <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Favorites
            </TabsTrigger>
            <TabsTrigger value="news" className="data-[state=active]:bg-purple-600 text-xs sm:text-sm h-8 sm:h-9">
              <Newspaper className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              News
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-4">
              {/* Sidebar - Stock List */}
              <div className="lg:col-span-3">
                <Card className="bg-gray-900 border-gray-800 h-full">
                  <CardHeader className="p-2 sm:p-3 pb-2">
                    {/* Search */}
                    <div className="relative mb-2">
                      <Search className="absolute left-2.5 top-2 h-4 w-4 text-white/50" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search stocks..."
                        className="bg-black border-gray-700 pl-8 focus:border-purple-500 text-white text-sm h-9 placeholder:text-white/50"
                      />
                    </div>
                    {/* Sector Filter */}
                    <Select value={selectedSector} onValueChange={setSelectedSector}>
                      <SelectTrigger className="bg-black border-gray-700 text-white text-sm h-9">
                        <SelectValue placeholder="All Sectors" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700 text-white">
                        <SelectItem value="all">All Sectors</SelectItem>
                        {sectors.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardHeader>
                  <CardContent className="p-0">
                    {/* NIFTY INDICES Section */}
                    <div className="border-b border-gray-800 p-2">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <BarChart3 className="h-4 w-4 text-purple-500" />
                        <span className="text-xs font-semibold text-white/80">NIFTY INDICES</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {stocks.filter(s => NIFTY_INDICES.some(i => i.symbol === s.symbol)).slice(0, 6).map((index) => (
                          <div
                            key={index.symbol}
                            onClick={() => setSelectedStock(index)}
                            className={`p-2 rounded-lg cursor-pointer transition-all ${
                              selectedStock?.symbol === index.symbol 
                                ? 'bg-purple-600/20 border border-purple-500/50' 
                                : 'bg-gray-800/50 hover:bg-gray-800'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-white/90">{index.symbol.replace('NIFTY', 'NIFTY ').replace('BANKNIFTY', 'BANK NIFTY')}</span>
                              <span className={`text-[10px] font-medium ${index.pChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {index.pChange >= 0 ? '+' : ''}{index.pChange.toFixed(2)}%
                              </span>
                            </div>
                            <div className="text-sm font-bold text-white mt-0.5">{index.price.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full grid-cols-3 bg-gray-800 rounded-none border-b border-gray-700 h-9">
                        <TabsTrigger value="buy" className="data-[state=active]:text-green-400 data-[state=active]:border-b-2 data-[state=active]:border-green-400 text-white/70 text-xs h-8">
                          🟢 Buy
                        </TabsTrigger>
                        <TabsTrigger value="sell" className="data-[state=active]:text-red-400 data-[state=active]:border-b-2 data-[state=active]:border-red-400 text-white/70 text-xs h-8">
                          🔴 Sell
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="data-[state=active]:text-yellow-400 data-[state=active]:border-b-2 data-[state=active]:border-yellow-400 text-white/70 text-xs h-8">
                          ⭐ Fav
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <ScrollArea className="h-[calc(100vh-480px)] sm:h-[calc(100vh-430px)]">
                      <div className="divide-y divide-gray-800">
                        {(activeTab === 'buy' ? gainers : activeTab === 'sell' ? losers : stocks.filter(s => favorites.some(f => f.symbol === s.symbol))).slice(0, 50).map((stock) => (
                          <div
                            key={stock.symbol}
                            onClick={() => setSelectedStock(stock)}
                            className={`p-2 sm:p-3 cursor-pointer transition-colors hover:bg-gray-800 ${
                              selectedStock?.symbol === stock.symbol ? 'bg-gray-800 border-l-2 border-purple-500' : ''
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (isFavorite(stock.symbol)) {
                                      removeFromFavorites(stock.symbol)
                                    } else {
                                      addToFavorites(stock)
                                    }
                                  }}
                                  className="p-0.5"
                                >
                                  <Star className={`h-4 w-4 ${isFavorite(stock.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-white/50 hover:text-yellow-400'}`} />
                                </button>
                                <div>
                                  <div className="font-semibold text-sm text-white">{stock.symbol}</div>
                                  <div className="text-xs text-white/60">₹{stock.price.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className={`text-xs sm:text-sm font-medium ${stock.pChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stock.pChange >= 0 ? '▲' : '▼'} {Math.abs(stock.pChange).toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Main Dashboard */}
              <div className="lg:col-span-6">
                {selectedStock ? (
                  <div className="space-y-2 sm:space-y-3">
                    {/* Yesterday's OHLC Cards */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Y.Open</div>
                          <div className="text-sm sm:text-base font-bold text-purple-400">{selectedStock.o.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Y.High</div>
                          <div className="text-sm sm:text-base font-bold text-green-400">{selectedStock.h.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Y.Low</div>
                          <div className="text-sm sm:text-base font-bold text-red-400">{selectedStock.l.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Y.Close</div>
                          <div className="text-sm sm:text-base font-bold text-cyan-400">{selectedStock.c.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Today's OHLC Cards */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">T.Open</div>
                          <div className="text-sm sm:text-base font-bold text-cyan-400">{ohlc.o.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">T.High</div>
                          <div className="text-sm sm:text-base font-bold text-green-400">{ohlc.h.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">T.Low</div>
                          <div className="text-sm sm:text-base font-bold text-red-400">{ohlc.l.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Live</div>
                          <div className="text-sm sm:text-base font-bold text-purple-400">{selectedStock.price.toFixed(2)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 52W High/Low & Lifetime High/Low */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">52W High</div>
                          <div className="text-sm sm:text-base font-bold text-green-400">{(selectedStock.week52High || selectedStock.h * 1.2).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">52W Low</div>
                          <div className="text-sm sm:text-base font-bold text-red-400">{(selectedStock.week52Low || selectedStock.l * 0.8).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Life High</div>
                          <div className="text-sm sm:text-base font-bold text-cyan-400">{(selectedStock.lifetimeHigh || selectedStock.h * 1.5).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">Life Low</div>
                          <div className="text-sm sm:text-base font-bold text-purple-400">{(selectedStock.lifetimeLow || selectedStock.l * 0.5).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Previous Month High/Low */}
                    <div className="grid grid-cols-4 gap-1 sm:gap-2">
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">PM High</div>
                          <div className="text-sm sm:text-base font-bold text-orange-400">{(selectedStock.prevMonthHigh || selectedStock.h).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">PM Low</div>
                          <div className="text-sm sm:text-base font-bold text-orange-400">{(selectedStock.prevMonthLow || selectedStock.l).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-gray-900 border-gray-800 col-span-2">
                        <CardContent className="p-2 text-center">
                          <div className="text-[10px] text-white/60 uppercase">PM Close</div>
                          <div className="text-sm sm:text-base font-bold text-yellow-400">{(selectedStock.prevMonthClose || selectedStock.c).toFixed(2)}</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Calculator Panel */}
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader className="p-2 sm:p-3 pb-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm sm:text-base flex items-center gap-2 text-white">
                            <span className="text-purple-500">🔮</span>
                            {selectedStock.symbol}
                            <Badge variant="secondary" className="text-[10px] bg-gray-700 text-white">{selectedStock.sector}</Badge>
                          </CardTitle>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => isFavorite(selectedStock.symbol) 
                                ? removeFromFavorites(selectedStock.symbol)
                                : addToFavorites(selectedStock)
                              }
                              className="h-7 w-7 p-0 text-white/70 hover:text-white"
                            >
                              <Star className={`h-4 w-4 ${isFavorite(selectedStock.symbol) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openTradingView(selectedStock.symbol)}
                              className="h-7 w-7 p-0 text-white/70 hover:text-white"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-2 sm:p-3 pt-1">
                        {/* Calculation Mode Tabs - Like the image */}
                        <div className="flex flex-wrap gap-1 mb-3 bg-black p-1.5 rounded-lg">
                          {(['yClose', 'yHigh', 'yLow', 'tOpen', 'tHigh', 'tLow', 'pmHigh', 'pmLow', 'live', 'custom'] as CalculationMode[]).map((mode) => (
                            <Button
                              key={mode}
                              size="sm"
                              onClick={() => setCalculationMode(mode)}
                              className={`h-7 px-2 text-[11px] font-medium transition-all ${
                                calculationMode === mode 
                                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                  : 'bg-gray-800 text-white/70 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              {modeLabels[mode]}
                            </Button>
                          ))}
                        </div>

                        {/* Custom Price Input */}
                        {calculationMode === 'custom' && (
                          <div className="mb-3">
                            <label className="text-xs text-white/70 mb-1 block">Custom Price</label>
                            <Input
                              type="number"
                              value={customPrice || ''}
                              onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                              placeholder="Enter price"
                              className="bg-black border-gray-700 focus:border-purple-500 text-white placeholder:text-white/50 h-9"
                            />
                          </div>
                        )}

                        {/* Multiplier Tabs - Black Background */}
                        <div className="mb-3">
                          <label className="text-xs text-white/70 mb-1.5 block">Multiplier</label>
                          <div className="flex flex-wrap gap-1 bg-black p-1.5 rounded-lg">
                            {MULTIPLIERS.map(m => (
                              <Button
                                key={m}
                                size="sm"
                                onClick={() => setMultiplier(m)}
                                className={`h-7 px-2 text-[11px] font-medium transition-all ${
                                  multiplier === m 
                                    ? 'bg-purple-600 text-white hover:bg-purple-700' 
                                    : 'bg-gray-800 text-white/70 hover:bg-gray-700 hover:text-white'
                                }`}
                              >
                                {m}x
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Alert Price */}
                        <div className="mb-3">
                          <label className="text-xs text-white/70 mb-1 block flex items-center gap-1">
                            <Bell className="h-3 w-3" /> Alert Price
                          </label>
                          <Input
                            type="number"
                            value={alertPrice || ''}
                            onChange={(e) => setAlertPrice(parseFloat(e.target.value) || 0)}
                            placeholder="Set alert price"
                            className="bg-black border-gray-700 focus:border-purple-500 text-white placeholder:text-white/50 h-9"
                          />
                        </div>

                        {/* Levels Display */}
                        {levels && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            {/* Buy Levels */}
                            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                              <h3 className="text-green-400 font-semibold text-sm mb-2 border-b border-green-500/20 pb-2">
                                🟢 BUY LEVELS
                              </h3>
                              <div className="space-y-1.5 text-sm text-white">
                                <div className="flex justify-between"><span>Buy Above</span><span className="font-bold">{levels.buy.entry.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Avg</span><span className="font-bold">{levels.buy.avg.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Stoploss</span><span className="font-bold text-red-400">{levels.buy.sl.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tgt 1</span><span className="font-bold text-green-300">{levels.buy.t1.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tgt 2</span><span className="font-bold text-green-300">{levels.buy.t2.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tgt 3</span><span className="font-bold text-green-300">{levels.buy.t3.toFixed(2)}</span></div>
                              </div>
                              {/* WhatsApp Buy Button */}
                              <Button
                                onClick={shareBuyWhatsApp}
                                className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white h-8 text-sm"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Share Buy Levels
                              </Button>
                            </div>

                            {/* Sell Levels */}
                            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                              <h3 className="text-red-400 font-semibold text-sm mb-2 border-b border-red-500/20 pb-2">
                                🔴 SELL LEVELS
                              </h3>
                              <div className="space-y-1.5 text-sm text-white">
                                <div className="flex justify-between"><span>Sell Below</span><span className="font-bold">{levels.sell.entry.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Avg</span><span className="font-bold">{levels.sell.avg.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Stoploss</span><span className="font-bold text-green-400">{levels.sell.sl.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tgt 1</span><span className="font-bold text-red-300">{levels.sell.t1.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tgt 2</span><span className="font-bold text-red-300">{levels.sell.t2.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tgt 3</span><span className="font-bold text-red-300">{levels.sell.t3.toFixed(2)}</span></div>
                              </div>
                              {/* WhatsApp Sell Button */}
                              <Button
                                onClick={shareSellWhatsApp}
                                className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white h-8 text-sm"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Share Sell Levels
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Other Share Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={shareTelegram}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white h-8 text-sm"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Telegram
                          </Button>
                          <Button
                            onClick={() => openTradingView(selectedStock.symbol)}
                            variant="outline"
                            className="border-gray-700 text-white hover:text-white h-8 text-sm"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Chart
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-gray-900 border-gray-800 h-full flex items-center justify-center">
                    <CardContent className="text-center p-8">
                      <Target className="h-16 w-16 mx-auto mb-4 text-white/30" />
                      <p className="text-white/70">Select a stock to view Magic Levels</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right Sidebar - News & Related */}
              <div className="lg:col-span-3">
                <div className="space-y-2 sm:space-y-3">
                  {/* Related Stocks */}
                  {selectedStock && (
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader className="p-2 sm:p-3">
                        <CardTitle className="text-sm text-white">Related ({selectedStock.sector})</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-gray-800">
                          {getRelatedStocks(selectedStock).map((stock) => (
                            <div
                              key={stock.symbol}
                              onClick={() => setSelectedStock(stock)}
                              className="p-2 sm:p-3 cursor-pointer hover:bg-gray-800 flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (isFavorite(stock.symbol)) {
                                      removeFromFavorites(stock.symbol)
                                    } else {
                                      addToFavorites(stock)
                                    }
                                  }}
                                  className="p-0.5"
                                >
                                  <Star className={`h-3.5 w-3.5 ${isFavorite(stock.symbol) ? 'fill-yellow-400 text-yellow-400' : 'text-white/50 hover:text-yellow-400'}`} />
                                </button>
                                <div>
                                  <div className="text-sm font-medium text-white">{stock.symbol}</div>
                                  <div className="text-xs text-white/60">₹{stock.price.toFixed(2)}</div>
                                </div>
                              </div>
                              <div className={`text-xs ${stock.pChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {stock.pChange >= 0 ? '+' : ''}{stock.pChange.toFixed(2)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Quick News */}
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="p-2 sm:p-3">
                      <CardTitle className="text-sm flex items-center gap-2 text-white">
                        <Newspaper className="h-4 w-4" />
                        Market News
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-48">
                        <div className="divide-y divide-gray-800">
                          {news.length > 0 ? news.slice(0, 5).map((item, idx) => (
                            <a
                              key={idx}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-2 sm:p-3 hover:bg-gray-800"
                            >
                              <div className="text-sm font-medium line-clamp-2 text-white">{item.name}</div>
                              <div className="text-xs text-white/50 mt-1">{item.host_name}</div>
                            </a>
                          )) : (
                            <div className="p-4 text-center text-white/60 text-sm">
                              Click News tab for updates
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="mt-0">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-white">Your Favorite Stocks</CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {stocks.filter(s => favorites.some(f => f.symbol === s.symbol)).map((stock) => {
                      const stockLevels = calculateGann(stock.c, 1)
                      return (
                        <Card key={stock.symbol} className="bg-gray-800 border-gray-700">
                          <CardHeader className="p-3 pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base text-white">{stock.symbol}</CardTitle>
                                <p className="text-xs text-white/60">{stock.name}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFromFavorites(stock.symbol)}
                                className="h-6 w-6 p-0 text-white/70 hover:text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-3 pt-0">
                            <div className="text-xs space-y-1">
                              <div className="flex justify-between text-green-400">
                                <span>Buy:</span><span>{stockLevels.buy.entry.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-purple-400">
                                <span>Pivot:</span><span>{stock.c.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-red-400">
                                <span>Sell:</span><span>{stockLevels.sell.entry.toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="flex gap-1 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedStock(stock)
                                  setMainTab('dashboard')
                                }}
                                className="flex-1 h-7 text-xs border-gray-700 text-white hover:text-white"
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openTradingView(stock.symbol)}
                                className="h-7 w-7 p-0 border-gray-700 text-white hover:text-white"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Star className="h-16 w-16 mx-auto mb-4 text-white/30" />
                    <p className="text-white/70">No favorite stocks yet</p>
                    <p className="text-xs text-white/50 mt-1">Star stocks to add them here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* News Tab */}
          <TabsContent value="news" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="p-3 sm:p-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Latest Market News</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (selectedStock) {
                            setNewsLoading(true)
                            fetch(`/api/news?symbol=${selectedStock.symbol}`)
                              .then(res => res.json())
                              .then(data => setNews(data.results || []))
                              .finally(() => setNewsLoading(false))
                          }
                        }}
                        disabled={newsLoading}
                        className="border-gray-700 text-white hover:text-white h-8"
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${newsLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-280px)]">
                      {news.length > 0 ? (
                        <div className="space-y-3">
                          {news.map((item, idx) => (
                            <a
                              key={idx}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block p-3 sm:p-4 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
                            >
                              <div className="font-medium mb-1 text-white">{item.name}</div>
                              <p className="text-sm text-white/60 mb-2">{item.snippet}</p>
                              <div className="flex items-center gap-2 text-xs text-white/50">
                                <span>{item.host_name}</span>
                                <span>•</span>
                                <span>{item.date}</span>
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Newspaper className="h-16 w-16 mx-auto mb-4 text-white/30" />
                          <p className="text-white/70">Select a stock for specific news</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm text-white">Quick Stock News</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-400px)]">
                      <div className="space-y-1">
                        {stocks.slice(0, 30).map((stock) => (
                          <div
                            key={stock.symbol}
                            onClick={() => setSelectedStock(stock)}
                            className="p-2 rounded hover:bg-gray-800 cursor-pointer flex justify-between items-center"
                          >
                            <span className="text-sm text-white">{stock.symbol}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedStock(stock)
                                fetch(`/api/news?symbol=${stock.symbol}`)
                                  .then(res => res.json())
                                  .then(data => setNews(data.results || []))
                              }}
                              className="h-6 text-xs text-white/70 hover:text-white"
                            >
                              <Newspaper className="h-3 w-3 mr-1" />
                              News
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer - Disclaimer */}
      <footer className="border-t border-gray-800 bg-gray-950 px-2 sm:px-4 py-2 sm:py-3 mt-auto">
        <div className="container mx-auto flex items-start gap-2">
          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
          <p className="text-[10px] sm:text-xs text-white/50">
            <strong className="text-yellow-500">Disclaimer:</strong> Educational purposes only. Not financial advice. 
            Stock market investments are subject to market risks. J8PRO is not responsible for any financial losses.
          </p>
        </div>
      </footer>
    </div>
  )
}
