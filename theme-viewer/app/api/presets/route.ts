import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const presetsDir = path.join(process.cwd(), '..', 'presets');
    const files = await fs.readdir(presetsDir);

    const presets = await Promise.all(
      files
        .filter(f => f.endsWith('.json'))
        .map(async (file) => {
          const content = await fs.readFile(path.join(presetsDir, file), 'utf-8');
          const data = JSON.parse(content);
          return {
            id: file.replace('.json', ''),
            name: data.name,
            description: data.description,
          };
        })
    );

    return NextResponse.json(presets);
  } catch (error) {
    console.error('Error reading presets:', error);
    return NextResponse.json(
      { error: 'Failed to read presets' },
      { status: 500 }
    );
  }
}
