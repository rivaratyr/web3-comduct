import { NextResponse } from 'next/server';

const POAP_API_URL = 'https://api.poap.tech';

interface POAPToken {
  event: {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    image_url: string;
  };
  tokenId: string;
  created: string;
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Ensure the address is valid
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    const response = await fetch(`${POAP_API_URL}/actions/scan/${address}`, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': process.env.POAP_API_KEY || ''
      }
    });

    if (!response.ok) {
      throw new Error(`POAP API responded with status: ${response.status}`);
    }

    const poaps: POAPToken[] = await response.json();

    // Calculate some metrics
    const metrics = {
      totalPoaps: poaps.length,
      uniqueEvents: new Set(poaps.map(p => p.event.id)).size,
      eventsByYear: poaps.reduce((acc: Record<string, number>, poap) => {
        const year = new Date(poap.event.start_date).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {}),
      recentEvents: poaps
        .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
        .slice(0, 5)
        .map(p => ({
          name: p.event.name,
          date: p.event.start_date,
          imageUrl: p.event.image_url
        }))
    };

    return NextResponse.json({
      address,
      metrics,
      poaps: poaps.map(p => ({
        eventId: p.event.id,
        name: p.event.name,
        description: p.event.description,
        startDate: p.event.start_date,
        endDate: p.event.end_date,
        imageUrl: p.event.image_url,
        tokenId: p.tokenId
      }))
    });
  } catch (error) {
    console.error('POAP API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch POAP data' },
      { status: 500 }
    );
  }
}