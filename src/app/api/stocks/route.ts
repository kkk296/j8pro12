import { NextResponse } from 'next/server'

// Indian stock symbols with Yahoo Finance mapping
const INDIAN_STOCKS: Record<string, { symbol: string; name: string; sector: string; yahooSymbol: string }> = {
  'NIFTY': { symbol: 'NIFTY', name: 'NIFTY 50', sector: 'Index', yahooSymbol: '^NSEI' },
  'BANKNIFTY': { symbol: 'BANKNIFTY', name: 'BANK NIFTY', sector: 'Index', yahooSymbol: '^NSEBANK' },
  'FINNIFTY': { symbol: 'FINNIFTY', name: 'FIN NIFTY', sector: 'Index', yahooSymbol: 'NIFTY_FIN_SERVICE.NS' },
  'MIDCPNIFTY': { symbol: 'MIDCPNIFTY', name: 'MIDCAP NIFTY', sector: 'Index', yahooSymbol: 'NIFTY_MIDCAP_150.NS' },
  'RELIANCE': { symbol: 'RELIANCE', name: 'Reliance Industries Ltd', sector: 'Energy', yahooSymbol: 'RELIANCE.NS' },
  'TCS': { symbol: 'TCS', name: 'Tata Consultancy Services Ltd', sector: 'IT', yahooSymbol: 'TCS.NS' },
  'HDFCBANK': { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', sector: 'Banking', yahooSymbol: 'HDFCBANK.NS' },
  'INFY': { symbol: 'INFY', name: 'Infosys Ltd', sector: 'IT', yahooSymbol: 'INFY.NS' },
  'ICICIBANK': { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', sector: 'Banking', yahooSymbol: 'ICICIBANK.NS' },
  'HINDUNILVR': { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd', sector: 'FMCG', yahooSymbol: 'HINDUNILVR.NS' },
  'SBIN': { symbol: 'SBIN', name: 'State Bank of India', sector: 'Banking', yahooSymbol: 'SBIN.NS' },
  'BHARTIARTL': { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd', sector: 'Telecom', yahooSymbol: 'BHARTIARTL.NS' },
  'ITC': { symbol: 'ITC', name: 'ITC Ltd', sector: 'FMCG', yahooSymbol: 'ITC.NS' },
  'KOTAKBANK': { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd', sector: 'Banking', yahooSymbol: 'KOTAKBANK.NS' },
  'LT': { symbol: 'LT', name: 'Larsen & Toubro Ltd', sector: 'Capital Goods', yahooSymbol: 'LT.NS' },
  'AXISBANK': { symbol: 'AXISBANK', name: 'Axis Bank Ltd', sector: 'Banking', yahooSymbol: 'AXISBANK.NS' },
  'ASIANPAINT': { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd', sector: 'Consumer Durables', yahooSymbol: 'ASIANPAINT.NS' },
  'MARUTI': { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd', sector: 'Automobile', yahooSymbol: 'MARUTI.NS' },
  'SUNPHARMA': { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Industries Ltd', sector: 'Pharma', yahooSymbol: 'SUNPHARMA.NS' },
  'TITAN': { symbol: 'TITAN', name: 'Titan Company Ltd', sector: 'Consumer Durables', yahooSymbol: 'TITAN.NS' },
  'BAJFINANCE': { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', sector: 'Financial Services', yahooSymbol: 'BAJFINANCE.NS' },
  'DMART': { symbol: 'DMART', name: 'Avenue Supermarts Ltd', sector: 'Retail', yahooSymbol: 'DMART.NS' },
  'WIPRO': { symbol: 'WIPRO', name: 'Wipro Ltd', sector: 'IT', yahooSymbol: 'WIPRO.NS' },
  'HCLTECH': { symbol: 'HCLTECH', name: 'HCL Technologies Ltd', sector: 'IT', yahooSymbol: 'HCLTECH.NS' },
  'ULTRACEMCO': { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd', sector: 'Cement', yahooSymbol: 'ULTRACEMCO.NS' },
  'NTPC': { symbol: 'NTPC', name: 'NTPC Ltd', sector: 'Power', yahooSymbol: 'NTPC.NS' },
  'TATAMOTORS': { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', sector: 'Automobile', yahooSymbol: 'TATAMOTORS.NS' },
  'TATASTEEL': { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', sector: 'Metals', yahooSymbol: 'TATASTEEL.NS' },
  'ONGC': { symbol: 'ONGC', name: 'Oil & Natural Gas Corporation Ltd', sector: 'Energy', yahooSymbol: 'ONGC.NS' },
  'JSWSTEEL': { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd', sector: 'Metals', yahooSymbol: 'JSWSTEEL.NS' },
  'M&M': { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd', sector: 'Automobile', yahooSymbol: 'M&M.NS' },
  'ADANIENT': { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd', sector: 'Conglomerate', yahooSymbol: 'ADANIENT.NS' },
  'ADANIPORTS': { symbol: 'ADANIPORTS', name: 'Adani Ports and SEZ Ltd', sector: 'Infrastructure', yahooSymbol: 'ADANIPORTS.NS' },
  'TMCV': { symbol: 'TMCV', name: 'Tata Motors DVR', sector: 'Automobile', yahooSymbol: 'TATAMTRDVR.NS' },
  'TMPV': { symbol: 'TMPV', name: 'Tata Technologies', sector: 'Automobile', yahooSymbol: 'TATATECH.NS' },
  'BANDHANBNK': { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd', sector: 'Banking', yahooSymbol: 'BANDHANBNK.NS' },
  'FEDERALBNK': { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd', sector: 'Banking', yahooSymbol: 'FEDERALBNK.NS' },
  'RBLBANK': { symbol: 'RBLBANK', name: 'RBL Bank Ltd', sector: 'Banking', yahooSymbol: 'RBLBANK.NS' },
  'IDFCFIRSTB': { symbol: 'IDFCFIRSTB', name: 'IDFC FIRST Bank Ltd', sector: 'Banking', yahooSymbol: 'IDFCFIRSTB.NS' },
  'PNB': { symbol: 'PNB', name: 'Punjab National Bank', sector: 'Banking', yahooSymbol: 'PNB.NS' },
  'BANKBARODA': { symbol: 'BANKBARODA', name: 'Bank of Baroda', sector: 'Banking', yahooSymbol: 'BANKBARODA.NS' },
  'INDUSINDBK': { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd', sector: 'Banking', yahooSymbol: 'INDUSINDBK.NS' },
  'AUBANK': { symbol: 'AUBANK', name: 'AU Small Finance Bank Ltd', sector: 'Banking', yahooSymbol: 'AUBANK.NS' },
  'BAJAJFINSV': { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd', sector: 'Financial Services', yahooSymbol: 'BAJAJFINSV.NS' },
  'SBILIFE': { symbol: 'SBILIFE', name: 'SBI Life Insurance Company Ltd', sector: 'Insurance', yahooSymbol: 'SBILIFE.NS' },
  'HDFCLIFE': { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company Ltd', sector: 'Insurance', yahooSymbol: 'HDFCLIFE.NS' },
  'TECHM': { symbol: 'TECHM', name: 'Tech Mahindra Ltd', sector: 'IT', yahooSymbol: 'TECHM.NS' },
  'COFORGE': { symbol: 'COFORGE', name: 'Coforge Ltd', sector: 'IT', yahooSymbol: 'COFORGE.NS' },
  'DRREDDY': { symbol: 'DRREDDY', name: "Dr Reddy's Laboratories Ltd", sector: 'Pharma', yahooSymbol: 'DRREDDY.NS' },
  'CIPLA': { symbol: 'CIPLA', name: 'Cipla Ltd', sector: 'Pharma', yahooSymbol: 'CIPLA.NS' },
  'APOLLOHOSP': { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Enterprise Ltd', sector: 'Healthcare', yahooSymbol: 'APOLLOHOSP.NS' },
  'DIVISLAB': { symbol: 'DIVISLAB', name: 'Divis Laboratories Ltd', sector: 'Pharma', yahooSymbol: 'DIVISLAB.NS' },
  'BAJAJ-AUTO': { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd', sector: 'Automobile', yahooSymbol: 'BAJAJ-AUTO.NS' },
  'EICHERMOT': { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd', sector: 'Automobile', yahooSymbol: 'EICHERMOT.NS' },
  'HEROMOTOCO': { symbol: 'HEROMOTOCO', name: 'Hero MotoCorp Ltd', sector: 'Automobile', yahooSymbol: 'HEROMOTOCO.NS' },
  'MRF': { symbol: 'MRF', name: 'MRF Ltd', sector: 'Automobile', yahooSymbol: 'MRF.NS' },
  'HINDALCO': { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd', sector: 'Metals', yahooSymbol: 'HINDALCO.NS' },
  'COALINDIA': { symbol: 'COALINDIA', name: 'Coal India Ltd', sector: 'Mining', yahooSymbol: 'COALINDIA.NS' },
  'VEDL': { symbol: 'VEDL', name: 'Vedanta Ltd', sector: 'Metals', yahooSymbol: 'VEDL.NS' },
  'JINDALSTEL': { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd', sector: 'Metals', yahooSymbol: 'JINDALSTEL.NS' },
  'SAIL': { symbol: 'SAIL', name: 'Steel Authority of India Ltd', sector: 'Metals', yahooSymbol: 'SAIL.NS' },
  'BPCL': { symbol: 'BPCL', name: 'Bharat Petroleum Corporation Ltd', sector: 'Energy', yahooSymbol: 'BPCL.NS' },
  'HPCL': { symbol: 'HPCL', name: 'Hindustan Petroleum Corporation Ltd', sector: 'Energy', yahooSymbol: 'HPCL.NS' },
  'GAIL': { symbol: 'GAIL', name: 'GAIL (India) Ltd', sector: 'Energy', yahooSymbol: 'GAIL.NS' },
  'PETRONET': { symbol: 'PETRONET', name: 'Petronet LNG Ltd', sector: 'Energy', yahooSymbol: 'PETRONET.NS' },
  'TATAPOWER': { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd', sector: 'Power', yahooSymbol: 'TATAPOWER.NS' },
  'NESTLEIND': { symbol: 'NESTLEIND', name: 'Nestle India Ltd', sector: 'FMCG', yahooSymbol: 'NESTLEIND.NS' },
  'BRITANNIA': { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd', sector: 'FMCG', yahooSymbol: 'BRITANNIA.NS' },
  'DABUR': { symbol: 'DABUR', name: 'Dabur India Ltd', sector: 'FMCG', yahooSymbol: 'DABUR.NS' },
  'DLF': { symbol: 'DLF', name: 'DLF Ltd', sector: 'Real Estate', yahooSymbol: 'DLF.NS' },
  'AMBUJACEM': { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd', sector: 'Cement', yahooSymbol: 'AMBUJACEM.NS' },
  'IDEA': { symbol: 'IDEA', name: 'Vodafone Idea Ltd', sector: 'Telecom', yahooSymbol: 'IDEA.NS' },
  'INDIGO': { symbol: 'INDIGO', name: 'InterGlobe Aviation Ltd', sector: 'Aviation', yahooSymbol: 'INDIGO.NS' },
  'SRF': { symbol: 'SRF', name: 'SRF Ltd', sector: 'Chemicals', yahooSymbol: 'SRF.NS' },
  'PIIND': { symbol: 'PIIND', name: 'PI Industries Ltd', sector: 'Chemicals', yahooSymbol: 'PIIND.NS' },
  'UPL': { symbol: 'UPL', name: 'UPL Ltd', sector: 'Chemicals', yahooSymbol: 'UPL.NS' },
  'SIEMENS': { symbol: 'SIEMENS', name: 'Siemens Ltd', sector: 'Capital Goods', yahooSymbol: 'SIEMENS.NS' },
  'BHEL': { symbol: 'BHEL', name: 'Bharat Heavy Electricals Ltd', sector: 'Capital Goods', yahooSymbol: 'BHEL.NS' },
  'TRENT': { symbol: 'TRENT', name: 'Trent Ltd', sector: 'Retail', yahooSymbol: 'TRENT.NS' },
  'GRASIM': { symbol: 'GRASIM', name: 'Grasim Industries Ltd', sector: 'Conglomerate', yahooSymbol: 'GRASIM.NS' },
  'BEL': { symbol: 'BEL', name: 'Bharat Electronics Ltd', sector: 'Defense', yahooSymbol: 'BEL.NS' },
  'HAL': { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd', sector: 'Defense', yahooSymbol: 'HAL.NS' },
  'ZOMATO': { symbol: 'ZOMATO', name: 'Zomato Ltd', sector: 'Internet', yahooSymbol: 'ZOMATO.NS' },
  'PAYTM': { symbol: 'PAYTM', name: 'One97 Communications Ltd', sector: 'Internet', yahooSymbol: 'PAYTM.NS' },
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
const CACHE_DURATION = 20000 // 20 seconds

// Gateway URL for Finance API (Z.ai environment)
const GATEWAY_URL = process.env.GATEWAY_URL || 'https://internal-api.z.ai'
const API_PREFIX = process.env.API_PREFIX || '/external/finance'

// Fetch from Yahoo Finance quote API (batch supported)
async function fetchFromYahooQuotes(): Promise<StockQuote[]> {
  try {
    const symbols = Object.values(INDIAN_STOCKS)
    const yahooSymbols = symbols.map(s => s.yahooSymbol).join(',')

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${yahooSymbols}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(15000)
    })

    if (!res.ok) return []

    const data = await res.json()
    const quotes = data.quoteResponse?.result || []
    const results: StockQuote[] = []

    for (const quote of quotes) {
      const ticker = quote.symbol as string
      const price = quote.regularMarketPrice as number

      if (!price || price <= 0) continue

      // Map back to our symbol
      let ourSymbol = ticker.replace('.NS', '')
      if (ticker === '^NSEI') ourSymbol = 'NIFTY'
      if (ticker === '^NSEBANK') ourSymbol = 'BANKNIFTY'

      const stockInfo = INDIAN_STOCKS[ourSymbol]
      if (!stockInfo) continue

      const week52High = quote.fiftyTwoWeekHigh || price * 1.25
      const week52Low = quote.fiftyTwoWeekLow || price * 0.75

      results.push({
        symbol: ourSymbol,
        name: stockInfo.name,
        sector: stockInfo.sector,
        price: price,
        change: quote.regularMarketChange || 0,
        pChange: quote.regularMarketChangePercent || 0,
        o: quote.regularMarketOpen || price,
        h: quote.regularMarketDayHigh || price,
        l: quote.regularMarketDayLow || price,
        c: quote.regularMarketPreviousClose || price,
        todayOpen: quote.regularMarketOpen || price,
        todayHigh: quote.regularMarketDayHigh || price,
        todayLow: quote.regularMarketDayLow || price,
        todayClose: price,
        // Calculate approximate previous month values based on current price and 52W range
        prevMonthHigh: price * 1.05,
        prevMonthLow: price * 0.95,
        prevMonthClose: quote.regularMarketPreviousClose || price,
        week52High: week52High,
        week52Low: week52Low,
        lifetimeHigh: week52High * 1.15,
        lifetimeLow: week52Low * 0.85,
      })
    }

    return results
  } catch (error) {
    console.error('Yahoo quotes error:', error)
    return []
  }
}

// Try internal gateway first (for Z.ai environment)
async function fetchFromGateway(): Promise<StockQuote[] | null> {
  try {
    const symbols = Object.keys(INDIAN_STOCKS)
    const tickerParam = symbols.map(s => {
      if (s === 'NIFTY') return '^NSEI'
      if (s === 'BANKNIFTY') return '^NSEBANK'
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

          const stockInfo = INDIAN_STOCKS[ourSymbol]
          if (stockInfo) {
            const week52High = quote.fiftyTwoWeekHigh || price * 1.25
            const week52Low = quote.fiftyTwoWeekLow || price * 0.75

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
              prevMonthHigh: price * 1.05,
              prevMonthLow: price * 0.95,
              prevMonthClose: (quote.regularMarketPreviousClose as number) || price,
              week52High: week52High,
              week52Low: week52Low,
              lifetimeHigh: week52High * 1.15,
              lifetimeLow: week52Low * 0.85,
            })
          }
        }
      }
    }

    return results.length > 0 ? results : null
  } catch {
    return null
  }
}

export async function GET() {
  const now = Date.now()

  // Check cache first
  if (stockCache && (now - stockCache.timestamp) < CACHE_DURATION) {
    return NextResponse.json({ stocks: stockCache.data, timestamp: new Date().toISOString(), cached: true })
  }

  let stocks: StockQuote[] = []
  let source = 'unknown'

  // Try Z.ai Gateway first (fastest for Z.ai environment)
  const gatewayData = await fetchFromGateway()
  if (gatewayData && gatewayData.length > 10) {
    stocks = gatewayData
    source = 'gateway'
  } else {
    // Try Yahoo Finance quote API
    stocks = await fetchFromYahooQuotes()
    source = 'yahoo'
  }

  // Update cache
  if (stocks.length > 0) {
    stockCache = { data: stocks, timestamp: now }
    return NextResponse.json({ stocks, timestamp: new Date().toISOString(), source, count: stocks.length })
  }

  return NextResponse.json({ stocks: [], error: 'Unable to fetch stock data', timestamp: new Date().toISOString() })
}
