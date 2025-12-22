import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { presetId, mode } = await request.json();

    if (!presetId || !mode) {
      return NextResponse.json(
        { error: 'Missing presetId or mode' },
        { status: 400 }
      );
    }

    const presetsDir = path.join(process.cwd(), '..', 'presets');
    const presetPath = path.join(presetsDir, `${presetId}.json`);
    const colorsPath = path.join(process.cwd(), '..', 'colors.json');

    const presetContent = await fs.readFile(presetPath, 'utf-8');
    const preset = JSON.parse(presetContent);

    const colorsContent = await fs.readFile(colorsPath, 'utf-8');
    const colors = JSON.parse(colorsContent);

    // Apply preset semantic colors to the theme
    for (const [key, value] of Object.entries(preset.semantic)) {
      colors.themes[mode].semantic[key] = value;
    }

    await fs.writeFile(colorsPath, JSON.stringify(colors, null, 2));

    return NextResponse.json({
      success: true,
      message: `Applied preset "${preset.name}" to ${mode} theme`,
    });
  } catch (error) {
    console.error('Error applying preset:', error);
    return NextResponse.json(
      { error: 'Failed to apply preset' },
      { status: 500 }
    );
  }
}
