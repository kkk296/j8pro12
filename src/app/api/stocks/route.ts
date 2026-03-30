import { NextResponse } from 'next/server'

// Indian stock symbols
const STOCK_DATA: Record<string, { symbol: string; name: string; sector: string; basePrice: number }> = {
  'NIFTY': { symbol: 'NIFTY', name: 'NIFTY 50', sector: 'Index', basePrice: 22350 },
  'BANKNIFTY': { symbol: 'BANKNIFTY', name: 'BANK NIFTY', sector: 'Index', basePrice: 48200 },
  'FINNIFTY': { symbol: 'FINNIFTY', name: 'FIN NIFTY', sector: 'Index', basePrice: 21100 },
  'MIDCPNIFTY': { symbol: 'MIDCPNIFTY', name: 'MIDCAP NIFTY', sector: 'Index', basePrice: 11750 },
  'RELIANCE': { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', basePrice: 1280 },
  'TCS': { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT', basePrice: 3560 },
  'HDFCBANK': { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', basePrice: 1745 },
  'INFY': { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT', basePrice: 1590 },
  'ICICIBANK': { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', basePrice: 1290 },
  'HINDUNILVR': { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', basePrice: 2410 },
  'SBIN': { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', basePrice: 785 },
  'BHARTIARTL': { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', basePrice: 1690 },
  'ITC': { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', basePrice: 445 },
  'KOTAKBANK': { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking', basePrice: 1785 },
  'LT': { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Capital Goods', basePrice: 3590 },
  'AXISBANK': { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking', basePrice: 1190 },
  'ASIANPAINT': { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer Durables', basePrice: 2380 },
  'MARUTI': { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Automobile', basePrice: 12850 },
  'SUNPHARMA': { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharma', basePrice: 1790 },
  'TITAN': { symbol: 'TITAN', name: 'Titan Company Ltd', sector: 'Consumer Durables', basePrice: 3490 },
  'BAJFINANCE': { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Financial Services', basePrice: 7290 },
  'DMART': { symbol: 'DMART', name: 'Avenue Supermarts Ltd', sector: 'Retail', basePrice: 3890 },
  'WIPRO': { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT', basePrice: 485 },
  'HCLTECH': { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT', basePrice: 1690 },
  'ULTRACEMCO': { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', sector: 'Cement', basePrice: 11850 },
  'NTPC': { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Power', basePrice: 385 },
  'TATAMOTORS': { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', basePrice: 685 },
  'TATASTEEL': { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', sector: 'Metals', basePrice: 150 },
  'ONGC': { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd', sector: 'Energy', basePrice: 270 },
  'JSWSTEEL': { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', sector: 'Metals', basePrice: 985 },
  'M&M': { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Automobile', basePrice: 2890 },
  'ADANIENT': { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate', basePrice: 2490 },
  'ADANIPORTS': { symbol: 'ADANIPORTS', name: 'Adani Ports and SEZ Ltd', sector: 'Infrastructure', basePrice: 1190 },
  'TMCV': { symbol: 'TMCV', name: 'Tata Motors DVR', sector: 'Automobile', basePrice: 485 },
  'TMPV': { symbol: 'TMPV', name: 'Tata Technologies', sector: 'Automobile', basePrice: 785 },
  'BANDHANBNK': { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking', basePrice: 170 },
  'FEDERALBNK': { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd', sector: 'Banking', basePrice: 180 },
  'RBLBANK': { symbol: 'RBLBANK', name: 'RBL Bank Ltd', sector: 'Banking', basePrice: 170 },
  'IDFCFIRSTB': { symbol: 'IDFCFIRSTB', name: 'IDFC FIRST Bank Ltd', sector: 'Banking', basePrice: 70 },
  'PNB': { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking', basePrice: 100 },
  'BANKBARODA': { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking', basePrice: 250 },
  'INDUSINDBK': { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Banking', basePrice: 1390 },
  'AUBANK': { symbol: 'AUBANK', name: 'AU Small Finance Bank Ltd', sector: 'Banking', basePrice: 685 },
  'BAJAJFINSV': { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', sector: 'Financial Services', basePrice: 1790 },
  'SBILIFE': { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd', sector: 'Insurance', basePrice: 1590 },
  'HDFCLIFE': { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd', sector: 'Insurance', basePrice: 685 },
  'TECHM': { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT', basePrice: 1490 },
  'COFORGE': { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT', basePrice: 5850 },
  'DRREDDY': { symbol: 'DRREDDY', name: "Dr Reddy's Laboratories Ltd", sector: 'Pharma', basePrice: 1290 },
  'CIPLA': { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma', basePrice: 1490 },
  'APOLLOHOSP': { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', sector: 'Healthcare', basePrice: 6890 },
  'DIVISLAB': { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd', sector: 'Pharma', basePrice: 4890 },
  'BAJAJ-AUTO': { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', sector: 'Automobile', basePrice: 8890 },
  'EICHERMOT': { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', sector: 'Automobile', basePrice: 4890 },
  'HEROMOTOCO': { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', sector: 'Automobile', basePrice: 3890 },
  'MRF': { symbol: 'MRF', name: 'MRF Ltd', sector: 'Automobile', basePrice: 128500 },
  'HINDALCO': { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', sector: 'Metals', basePrice: 685 },
  'COALINDIA': { symbol: 'COALINDIA', name: 'Coal India Ltd', sector: 'Mining', basePrice: 385 },
  'VEDL': { symbol: 'VEDL', name: 'Vedanta Ltd', sector: 'Metals', basePrice: 425 },
  'JINDALSTEL': { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd', sector: 'Metals', basePrice: 985 },
  'SAIL': { symbol: 'SAIL', name: 'Steel Authority of India Ltd', sector: 'Metals', basePrice: 130 },
  'BPCL': { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd', sector: 'Energy', basePrice: 325 },
  'HPCL': { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Ltd', sector: 'Energy', basePrice: 425 },
  'GAIL': { symbol: 'GAIL', name: 'GAIL (India) Ltd', sector: 'Energy', basePrice: 180 },
  'PETRONET': { symbol: 'PETRONET', name: 'Petronet LNG Ltd', sector: 'Energy', basePrice: 385 },
  'TATAPOWER': { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', sector: 'Power', basePrice: 425 },
  'NESTLEIND': { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG', basePrice: 2490 },
  'BRITANNIA': { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG', basePrice: 5290 },
  'DABUR': { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG', basePrice: 585 },
  'DLF': { symbol: 'DLF', name: 'DLF Ltd', sector: 'Real Estate', basePrice: 785 },
  'AMBUJACEM': { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd', sector: 'Cement', basePrice: 585 },
  'IDEA': { symbol: 'IDEA', name: 'Vodafone Idea Ltd', sector: 'Telecom', basePrice: 12 },
  'INDIGO': { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd', sector: 'Aviation', basePrice: 4290 },
  'SRF': { symbol: 'SRF', name: 'SRF Ltd', sector: 'Chemicals', basePrice: 2490 },
  'PIIND': { symbol: 'PIIND', name: 'PI Industries Ltd', sector: 'Chemicals', basePrice: 3490 },
  'UPL': { symbol: 'UPL', name: 'UPL Ltd', sector: 'Chemicals', basePrice: 485 },
  'SIEMENS': { symbol: 'SIEMENS', name: 'Siemens Ltd', sector: 'Capital Goods', basePrice: 6850 },
  'BHEL': { symbol: 'BHEL', name: 'Bharat Heavy Electricals Ltd', sector: 'Capital Goods', basePrice: 180 },
  'TRENT': { symbol: 'TRENT', name: 'Trent Ltd', sector: 'Retail', basePrice: 4850 },
  'GRASIM': { symbol: 'GRASIM', name: 'Grasim Industries Ltd', sector: 'Conglomerate', basePrice: 2490 },
  'BEL': { symbol: 'BEL', name: 'Bharat Electronics Ltd', sector: 'Defense', basePrice: 285 },
  'HAL': { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd', sector: 'Defense', basePrice: 4250 },
  'ZOMATO': { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Internet', basePrice: 185 },
  'PAYTM': { symbol: 'PAYTM', name: 'One97 Communications Ltd', sector: 'Internet', basePrice: 685 },
}

interface StockQuote {
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

// Global cache
let stockCache: { data: StockQuote[]; timestamp: number } | null = null
const CACHE_DURATION = 15000 // 15 seconds

// Gateway URL for Finance API (Z.ai environment)
const GATEWAY_URL = process.env.GATEWAY_URL || 'https://internal-api.z.ai'
const API_PREFIX = process.env.API_PREFIX || '/external/finance'

// Yahoo Finance symbol mapping
const YAHOO_SYMBOLS: Record<string, string> = {
  'NIFTY': '^NSEI',
  'BANKNIFTY': '^NSEBANK',
  'FINNIFTY': 'NIFTY_FIN_SERVICE.NS',
  'MIDCPNIFTY': 'NIFTY_MIDCAP_150.NS',
}

// Try Gateway API (Z.ai environment) - Returns ALL stocks
async function fetchFromGateway(): Promise<StockQuote[] | null> {
  try {
    const symbols = Object.keys(STOCK_DATA)
    const tickerParam = symbols.map(s => {
      if (YAHOO_SYMBOLS[s]) return YAHOO_SYMBOLS[s]
      return `${s}.NS`
    }).join(',')

    const response = await fetch(
      `${GATEWAY_URL}${API_PREFIX}/v1/markets/stock/quotes?ticker=${encodeURIComponent(tickerParam)}`,
      {
        headers: { 'X-Z-AI-From': 'Z' },
        signal: AbortSignal.timeout(12000)
      }
    )

    if (!response.ok) return null

    const data = await response.json()
    const results: StockQuote[] = []

    if (data.body && Array.isArray(data.body)) {
      for (const quote of data.body) {
        const ticker = quote.symbol as string
        const price = quote.regularMarketPrice as number

        if (price && price > 0) {
          let ourSymbol = ticker.replace('.NS', '')
          if (ticker === '^NSEI') ourSymbol = 'NIFTY'
          if (ticker === '^NSEBANK') ourSymbol = 'BANKNIFTY'

          const stockInfo = STOCK_DATA[ourSymbol]
          if (stockInfo) {
            results.push({
              symbol: ourSymbol,
              name: stockInfo.name,
              sector: stockInfo.sector,
              price: price,
              change: (quote.regularMarketChange as number) || 0,
              pChange: (quote.regularMarketChangePercent as number) || 0,
              o: (quote.regularMarketOpen as number) || price,
              h: (quote.regularMarketDayHigh as number) || price,
              l: (quote.regularMarketDayLow as number) || price,
              c: (quote.regularMarketPreviousClose as number) || price,
              todayOpen: (quote.regularMarketOpen as number) || price,
              todayHigh: (quote.regularMarketDayHigh as number) || price,
              todayLow: (quote.regularMarketDayLow as number) || price,
              todayClose: price,
              prevMonthHigh: Math.round(price * 1.05 * 100) / 100,
              prevMonthLow: Math.round(price * 0.95 * 100) / 100,
              prevMonthClose: (quote.regularMarketPreviousClose as number) || price,
              week52High: (quote.fiftyTwoWeekHigh as number) || price * 1.25,
              week52Low: (quote.fiftyTwoWeekLow as number) || price * 0.75,
              lifetimeHigh: (quote.fiftyTwoWeekHigh as number) ? (quote.fiftyTwoWeekHigh as number) * 1.15 : price * 1.4,
              lifetimeLow: (quote.fiftyTwoWeekLow as number) ? (quote.fiftyTwoWeekLow as number) * 0.85 : price * 0.6,
            })
          }
        }
      }
    }

    return results.length > 10 ? results : null
  } catch {
    return null
  }
}

// Fetch from Yahoo Finance in multiple batches to get ALL stocks
async function fetchFromYahooAll(): Promise<StockQuote[]> {
  const allSymbols = Object.keys(STOCK_DATA)
  const results: StockQuote[] = []
  const batchSize = 50 // Yahoo allows up to 50 symbols per request
  
  // Create batches
  const batches: string[][] = []
  for (let i = 0; i < allSymbols.length; i += batchSize) {
    batches.push(allSymbols.slice(i, i + batchSize))
  }
  
  // Fetch each batch
  for (const batch of batches) {
    const yahooSymbols = batch.map(s => {
      if (YAHOO_SYMBOLS[s]) return YAHOO_SYMBOLS[s]
      return `${s}.NS`
    }).join(',')

    try {
      const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      })

      if (!response.ok) continue

      const data = await response.json()
      const quotes = data.quoteResponse?.result || []

      for (const quote of quotes) {
        const ticker = quote.symbol as string
        const price = quote.regularMarketPrice as number

        if (price && price > 0) {
          let ourSymbol = ticker.replace('.NS', '')
          if (ticker === '^NSEI') ourSymbol = 'NIFTY'
          if (ticker === '^NSEBANK') ourSymbol = 'BANKNIFTY'

          const stockInfo = STOCK_DATA[ourSymbol]
          if (stockInfo) {
            results.push({
              symbol: ourSymbol,
              name: stockInfo.name,
              sector: stockInfo.sector,
              price: price,
              change: (quote.regularMarketChange as number) || 0,
              pChange: (quote.regularMarketChangePercent as number) || 0,
              o: (quote.regularMarketOpen as number) || price,
              h: (quote.regularMarketDayHigh as number) || price,
              l: (quote.regularMarketDayLow as number) || price,
              c: (quote.regularMarketPreviousClose as number) || price,
              todayOpen: (quote.regularMarketOpen as number) || price,
              todayHigh: (quote.regularMarketDayHigh as number) || price,
              todayLow: (quote.regularMarketDayLow as number) || price,
              todayClose: price,
              prevMonthHigh: Math.round(price * 1.05 * 100) / 100,
              prevMonthLow: Math.round(price * 0.95 * 100) / 100,
              prevMonthClose: (quote.regularMarketPreviousClose as number) || price,
              week52High: (quote.fiftyTwoWeekHigh as number) || price * 1.25,
              week52Low: (quote.fiftyTwoWeekLow as number) || price * 0.75,
              lifetimeHigh: (quote.fiftyTwoWeekHigh as number) ? (quote.fiftyTwoWeekHigh as number) * 1.15 : price * 1.4,
              lifetimeLow: (quote.fiftyTwoWeekLow as number) ? (quote.fiftyTwoWeekLow as number) * 0.85 : price * 0.6,
            })
          }
        }
      }
    } catch {
      // Continue to next batch on error
    }
  }

  return results
}

// Generate fallback data with realistic prices - ALL stocks
function generateFallbackData(): StockQuote[] {
  const now = Date.now()
  
  return Object.entries(STOCK_DATA).map(([symbol, data]) => {
    const seed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const timeVariation = Math.sin(now / 5000 + seed) * 0.015
    const randomVariation = (Math.random() - 0.5) * 0.01
    const changePercent = (timeVariation + randomVariation) * 100
    const price = data.basePrice * (1 + changePercent / 100)
    const prevClose = data.basePrice * (1 + (Math.random() - 0.5) * 0.01)
    
    return {
      symbol,
      name: data.name,
      sector: data.sector,
      price: Math.round(price * 100) / 100,
      change: Math.round((price - prevClose) * 100) / 100,
      pChange: Math.round(changePercent * 100) / 100,
      o: Math.round(data.basePrice * (1 + (Math.random() - 0.5) * 0.005) * 100) / 100,
      h: Math.round(price * 1.008 * 100) / 100,
      l: Math.round(price * 0.992 * 100) / 100,
      c: Math.round(prevClose * 100) / 100,
      todayOpen: Math.round(data.basePrice * (1 + (Math.random() - 0.5) * 0.005) * 100) / 100,
      todayHigh: Math.round(price * 1.008 * 100) / 100,
      todayLow: Math.round(price * 0.992 * 100) / 100,
      todayClose: Math.round(price * 100) / 100,
      prevMonthHigh: Math.round(data.basePrice * 1.08 * 100) / 100,
      prevMonthLow: Math.round(data.basePrice * 0.92 * 100) / 100,
      prevMonthClose: Math.round(data.basePrice * 0.98 * 100) / 100,
      week52High: Math.round(data.basePrice * 1.25 * 100) / 100,
      week52Low: Math.round(data.basePrice * 0.75 * 100) / 100,
      lifetimeHigh: Math.round(data.basePrice * 1.45 * 100) / 100,
      lifetimeLow: Math.round(data.basePrice * 0.55 * 100) / 100,
    }
  })
}

export async function GET() {
  const now = Date.now()

  // Check cache first
  if (stockCache && (now - stockCache.timestamp) < CACHE_DURATION) {
    return NextResponse.json({ stocks: stockCache.data, timestamp: new Date().toISOString(), cached: true })
  }

  let stocks: StockQuote[] = []
  let source = 'fallback'

  // 1. Try Gateway API (Z.ai environment - fastest and most reliable)
  const gatewayData = await fetchFromGateway()
  if (gatewayData && gatewayData.length > 10) {
    stocks = gatewayData
    source = 'gateway'
  } else {
    // 2. Try Yahoo Finance for ALL stocks (multiple batches)
    const yahooData = await fetchFromYahooAll()
    if (yahooData.length > 10) {
      stocks = yahooData
      source = 'yahoo'
    }
  }

  // 3. If we got partial data, fill remaining with fallback
  const allSymbols = Object.keys(STOCK_DATA)
  if (stocks.length > 0 && stocks.length < allSymbols.length) {
    const fetchedSymbols = new Set(stocks.map(s => s.symbol))
    const fallbackData = generateFallbackData()
    const missingStocks = fallbackData.filter(s => !fetchedSymbols.has(s.symbol))
    stocks = [...stocks, ...missingStocks]
    source = source + '+partial'
  }

  // 4. If no data at all, use complete fallback
  if (stocks.length === 0) {
    stocks = generateFallbackData()
    source = 'fallback'
  }

  // Update cache
  stockCache = { data: stocks, timestamp: now }

  return NextResponse.json({
    stocks,
    timestamp: new Date().toISOString(),
    source,
    count: stocks.length
  })
}
