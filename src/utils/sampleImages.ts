/**
 * Generates high-detail synthetic photo-like sample images directly in the browser
 * so users can test compression, resizing, and format conversion immediately.
 */
export async function createSampleImage(
  type: 'landscape' | 'macro' | 'portrait' = 'landscape'
): Promise<File> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  if (type === 'landscape') {
    canvas.width = 1920;
    canvas.height = 1080;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, 700);
    sky.addColorStop(0, '#1e3a8a');
    sky.addColorStop(0.5, '#f97316');
    sky.addColorStop(0.8, '#fde047');
    sky.addColorStop(1, '#ffedd5');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 1920, 700);

    // Glowing Sun
    const sun = ctx.createRadialGradient(960, 520, 10, 960, 520, 180);
    sun.addColorStop(0, '#ffffff');
    sun.addColorStop(0.2, '#fef08a');
    sun.addColorStop(0.6, '#f97316');
    sun.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = sun;
    ctx.beginPath();
    ctx.arc(960, 520, 180, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountain layers
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(0, 650);
    ctx.lineTo(300, 480);
    ctx.lineTo(600, 600);
    ctx.lineTo(950, 420);
    ctx.lineTo(1350, 580);
    ctx.lineTo(1700, 460);
    ctx.lineTo(1920, 620);
    ctx.lineTo(1920, 1080);
    ctx.lineTo(0, 1080);
    ctx.closePath();
    ctx.fill();

    // Foreground mountain layer
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(0, 750);
    ctx.lineTo(450, 580);
    ctx.lineTo(850, 720);
    ctx.lineTo(1200, 540);
    ctx.lineTo(1650, 700);
    ctx.lineTo(1920, 620);
    ctx.lineTo(1920, 1080);
    ctx.lineTo(0, 1080);
    ctx.closePath();
    ctx.fill();

    // Water lake reflection
    const water = ctx.createLinearGradient(0, 720, 0, 1080);
    water.addColorStop(0, '#0f172a');
    water.addColorStop(0.5, '#1e293b');
    water.addColorStop(1, '#020617');
    ctx.fillStyle = water;
    ctx.fillRect(0, 720, 1920, 360);

    // Lake ripples & textures
    ctx.strokeStyle = 'rgba(253, 224, 71, 0.25)';
    ctx.lineWidth = 2;
    for (let y = 730; y < 1080; y += 8) {
      ctx.beginPath();
      const waveOffset = Math.sin(y * 0.1) * 30;
      ctx.moveTo(750 + waveOffset, y);
      ctx.lineTo(1170 + waveOffset, y);
      ctx.stroke();
    }

    // Add noise texture for realistic photographic complexity
    const imgData = ctx.getImageData(0, 0, 1920, 1080);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 16) {
      const noise = (Math.random() - 0.5) * 14;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // Watermark/label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '24px sans-serif';
    ctx.fillText('Sample Sunset Landscape (1920x1080)', 40, 1040);

    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.95));
    return new File([blob], 'sample-sunset-landscape.jpg', { type: 'image/jpeg' });
  }

  // Fallback to high-res graphic sample
  canvas.width = 1200;
  canvas.height = 1200;
  const grad = ctx.createLinearGradient(0, 0, 1200, 1200);
  grad.addColorStop(0, '#06b6d4');
  grad.addColorStop(0.5, '#6366f1');
  grad.addColorStop(1, '#ec4899');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 1200);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(600 + Math.cos(i) * 300, 600 + Math.sin(i) * 300, 80 + i * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Sample Artwork (1200x1200)', 600, 600);

  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));
  return new File([blob], 'sample-artwork.png', { type: 'image/png' });
}
