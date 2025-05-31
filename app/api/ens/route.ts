import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Use Infura as the provider for more reliable ENS resolution
const provider = new ethers.JsonRpcProvider(process.env.JSON_RPC_PROVIDER);

export async function POST(request: Request) {

  provider.getNetwork().then(net => {
    console.log("Provider network:", net);
  });

  try {
    const { address } = await request.json();
    
    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    // Ensure the address is valid
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json({ error: 'Invalid Ethereum address' }, { status: 400 });
    }

    try {
      const ensName = await provider.lookupAddress(address);
      
      return NextResponse.json({
        address,
        ensName: ensName || null
      });
    } catch (lookupError) {
      console.error('ENS Lookup Error:', lookupError);
      return NextResponse.json({
        address,
        ensName: null
      });
    }
  } catch (error) {
    console.error('ENS Resolution Error:', error);
    return NextResponse.json(
      { error: 'Failed to resolve ENS name' },
      { status: 500 }
    );
  }
}