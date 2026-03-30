import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const topic = searchParams.get('topic');
  const timeframe = searchParams.get('timeframe') || 'recent';
  
  try {
    const zai = await ZAI.create();
    
    const timeKeywords: Record<string, string> = {
      recent: 'latest news',
      today: 'today news',
      week: 'this week news',
      month: 'this month news'
    };
    
    let query = '';
    if (symbol) {
      query = `${symbol} stock India ${timeKeywords[timeframe] || timeKeywords.recent}`;
    } else if (topic) {
      query = `${topic} ${timeKeywords[timeframe] || timeKeywords.recent}`;
    } else {
      query = `Indian stock market NSE BSE ${timeKeywords[timeframe] || timeKeywords.recent}`;
    }
    
    const results = await zai.functions.invoke('web_search', {
      query: query,
      num: 15
    });
    
    const sortedResults = results.sort((a: { date: string }, b: { date: string }) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return NextResponse.json({
      success: true,
      query: query,
      symbol: symbol,
      results: sortedResults,
      total: sortedResults.length
    });
  } catch (error) {
    console.error('News fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch news',
      results: []
    }, { status: 500 });
  }
}
