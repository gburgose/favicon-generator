import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const iconsDir = path.join(process.cwd(), 'src/assets/icons');
    const files = fs.readdirSync(iconsDir);

    const svgFiles = files.filter(file => file.endsWith('.svg'));

    return NextResponse.json({ icons: svgFiles });
  } catch (error) {
    return NextResponse.json({ error: 'Error reading icons directory' }, { status: 500 });
  }
} 
