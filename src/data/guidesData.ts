export interface GuideArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: 'Compression' | 'Formats' | 'Performance' | 'Biometrics';
  readingTime: string;
  publishedDate: string;
  modifiedDate: string;
  author: string;
  summary: string;
  relatedTool: {
    name: string;
    path: string;
    description: string;
  };
  sections: Array<{
    id: string;
    title: string;
    content: string[];
    callout?: {
      type: 'tip' | 'warning' | 'info';
      title: string;
      text: string;
    };
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const GUIDES: GuideArticle[] = [
  {
    slug: 'how-to-compress-image-without-losing-quality',
    title: 'How to Compress Images Without Losing Visual Quality',
    metaTitle: 'How to Compress Images Without Losing Visual Quality (Complete Guide)',
    metaDescription: 'Learn how to compress JPG, PNG, and WebP images by 60-80% without noticeable pixelation. Understand lossy vs lossless compression and visual perception thresholds.',
    category: 'Compression',
    readingTime: '6 min read',
    publishedDate: '2026-02-10',
    modifiedDate: '2026-09-25',
    author: 'Image Optimizer Engineering Team',
    summary: 'Discover the exact balance between file weight reduction and human visual perception. Learn how chroma subsampling and quantization tables eliminate redundant data while preserving razor-sharp details.',
    relatedTool: {
      name: 'Launch Online Image Compressor',
      path: '/compress',
      description: 'Test these compression principles right now with real-time side-by-side quality comparison.',
    },
    sections: [
      {
        id: 'understanding-visual-redundancy',
        title: '1. Human Visual Perception and Redundancy',
        content: [
          'The human eye is remarkably sensitive to variations in luminance (brightness), but significantly less sensitive to subtle differences in chrominance (color). Modern compression algorithms exploit this physiological fact through a technique called chroma subsampling (often written as 4:2:0 or 4:2:2).',
          'By discarding fine color nuances that human retinas cannot distinguish at regular viewing distances, compressors can shed up to 50% of an image’s uncompressed byte volume before any geometric or edge detail is touched.',
          'When you reduce the quality slider from 100% to 80% on a JPEG or WebP image, you are not smearing pixels—you are adjusting the quantization matrix that rounds high-frequency spatial components that human vision naturally filters out.',
        ],
        callout: {
          type: 'tip',
          title: 'The 80-85% Quality Sweet Spot',
          text: 'Compressing at 80% to 85% typically reduces file size by 65% to 75% compared to raw camera output, while remaining completely indistinguishable from the original to 99% of viewers.',
        },
      },
      {
        id: 'lossy-vs-lossless',
        title: '2. Lossy vs. Lossless: When to Use Each',
        content: [
          'Lossless compression preserves 100% of the original pixel values upon decompression. Every single RGB value remains bit-for-bit identical. This is achieved through entropy encoding algorithms such as Deflate (used in PNG) or LZ77.',
          'Lossy compression selectively discards imperceptible spatial and color information to achieve dramatically smaller files (often 5x to 10x smaller than lossless equivalents).',
          'Use Lossless (PNG) for logos with flat colors, technical diagrams, sharp line art, vector illustrations with transparent backgrounds, and pixel art where razor-sharp edges are vital.',
          'Use Lossy (WebP or JPEG) for photographs, blog hero images, product mockups, e-commerce listings, and camera captures with rich textures and gradients.',
        ],
      },
      {
        id: 'dimensions-matter-most',
        title: '3. Resize Before You Compress: The Dimensional Secret',
        content: [
          'The single most common mistake in image optimization is uploading a 4000x3000 pixel camera photo into a container that only displays at 800x600 pixels.',
          'File size scales quadratically with pixel dimensions (Width × Height). A 4000×3000 image contains 12,000,000 pixels. Resizing that same image to a crisp 1600×1200 retains crystal-clear high-DPI display fidelity while dropping the raw pixel count down to 1,920,000—an instantaneous 84% reduction in raw data before compression even begins.',
          'Always clamp the maximum width or height to the maximum viewport size your target audience will use.',
        ],
      },
      {
        id: 'step-by-step-workflow',
        title: '4. Step-by-Step Optimization Checklist',
        content: [
          'Step 1: Inspect the target usage (e.g., website banner, email attachment, job application upload).',
          'Step 2: Resize to the maximum required dimensions (e.g., 1920px width for desktop banners, 800px for email newsletters).',
          'Step 3: Convert legacy PNG or JPEG files to modern WebP format for 25-35% additional compression savings.',
          'Step 4: Set the quality slider between 75% and 85%. Avoid dropping below 65% unless targeting strict attachment limits (e.g., under 100 KB for government forms).',
          'Step 5: Inspect the result with our built-in Before/After side-by-side comparison slider to confirm edge sharpness and color accuracy.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does compressing an image lower its print quality?',
        answer: 'If you compress heavily with a low quality percentage or downscale pixel dimensions, print quality will degrade. For physical printing, maintain at least 300 DPI at the target print dimensions and use a quality setting of 90% or higher.',
      },
      {
        question: 'Can I compress an image multiple times to make it smaller?',
        answer: 'Repeated lossy compression introduces generation loss, causing artifacts and muddy textures to compound. Instead of repeatedly re-compressing, always start with your original source image and apply your desired quality target in a single pass.',
      },
      {
        question: 'Is WebP better than JPEG for photograph compression?',
        answer: 'Yes. At equivalent visual quality, WebP images are consistently 25% to 35% smaller than standard JPEG files, and WebP natively supports alpha transparency which JPEG lacks completely.',
      },
    ],
  },
  {
    slug: 'webp-vs-jpeg-vs-png-format-guide',
    title: 'WebP vs JPEG vs PNG: The Definitive Format Comparison',
    metaTitle: 'WebP vs JPEG vs PNG vs AVIF: Which Image Format Should You Use?',
    metaDescription: 'Comprehensive technical comparison between WebP, JPEG, PNG, and AVIF. Learn which format delivers the highest visual quality and smallest byte weight for your specific use case.',
    category: 'Formats',
    readingTime: '7 min read',
    publishedDate: '2026-02-15',
    modifiedDate: '2026-09-25',
    author: 'Image Optimizer Engineering Team',
    summary: 'A direct head-to-head comparison of compression algorithms, browser compatibility, alpha channel transparency, and decoding performance across modern image standards.',
    relatedTool: {
      name: 'Launch Image Format Converter',
      path: '/convert',
      description: 'Convert any image instantly between JPG, PNG, WebP, and AVIF with full control.',
    },
    sections: [
      {
        id: 'format-overview',
        title: '1. The Evolution of Web Image Formats',
        content: [
          'For nearly three decades, the web relied exclusively on JPEG (invented in 1992) for photographs and PNG (invented in 1996) for graphics needing transparent backgrounds. However, neither format was engineered for modern mobile network bandwidth or high-density Retina screens.',
          'Google developed WebP based on the VP8 video codec, introducing predictive block encoding. Modern WebP supports both lossy and lossless compression, ICC color profiles, and 8-bit alpha transparency with broad browser support across Chrome, Safari, Firefox, and Edge.',
        ],
      },
      {
        id: 'comparison-matrix',
        title: '2. Technical Comparison Matrix',
        content: [
          '• JPEG (Joint Photographic Experts Group): Lossy only. No transparency. Universal support (100% of devices since 1992). Ideal for legacy email clients and older hardware.',
          '• PNG (Portable Network Graphics): Lossless only. Full 8-bit alpha transparency. Clean edges and zero artifacting. Large file sizes when used for photographs.',
          '• WebP: Both lossy and lossless. Full alpha transparency. 25-34% smaller than JPEG at equal SSIM. Supported in all modern browsers (97%+ global coverage).',
          '• AVIF (AV1 Image File Format): Ultra-high compression based on the AV1 video codec. Often 20% smaller than WebP for high-detail photos, though encoding takes slightly longer.',
        ],
        callout: {
          type: 'info',
          title: 'The Default Recommendation',
          text: 'For 95% of modern websites and applications, WebP is the ideal default format. It provides superior compression, full transparency support, and universal compatibility across all modern desktop and mobile browsers.',
        },
      },
      {
        id: 'choosing-the-right-format',
        title: '3. Decision Tree: Which Format to Choose',
        content: [
          '1. Do you need a transparent background? If yes, choose WebP for photos/complex art, or PNG for simple geometric logos and icons.',
          '2. Is it a photograph or natural scene? Choose WebP (or JPEG if you must support legacy email clients that do not parse WebP).',
          '3. Is it a screenshot or user interface diagram containing small text? Choose PNG or lossless WebP to prevent mosquito noise around typography.',
          '4. Are you uploading to a government portal or passport application? Check the strict portal rules—most legacy portals require JPEG format specifically.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Do all modern browsers support WebP?',
        answer: 'Yes. Apple added full WebP support in iOS 14 and macOS Big Sur (Safari 14), while Chrome, Firefox, and Edge have supported it for many years. Global support exceeds 97%.',
      },
      {
        question: 'Why are PNG images of photos so much larger than JPEG or WebP?',
        answer: 'PNG was designed for lossless storage of graphics. When storing a photographic scene with millions of subtle color gradients, PNG cannot discard visually redundant data, resulting in files that are often 5 to 10 times larger than lossy WebP or JPEG.',
      },
    ],
  },
  {
    slug: 'image-optimization-for-web-performance',
    title: 'Image Optimization for Web Performance & Core Web Vitals',
    metaTitle: 'Image Optimization Guide for Web Performance & Google Core Web Vitals',
    metaDescription: 'Optimize Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) by properly sizing, compressing, and serving responsive images with modern HTML practices.',
    category: 'Performance',
    readingTime: '8 min read',
    publishedDate: '2026-03-01',
    modifiedDate: '2026-09-25',
    author: 'Image Optimizer Engineering Team',
    summary: 'Master Google Core Web Vitals. Discover how unoptimized images hurt your SEO rankings and learn practical techniques including responsive srcset, aspect ratio reservation, and browser-first caching.',
    relatedTool: {
      name: 'Compress for Website Preset',
      path: '/compress-image-for-website',
      description: 'One-click website optimization preset tuned for Google Lighthouse Core Web Vitals.',
    },
    sections: [
      {
        id: 'core-web-vitals-impact',
        title: '1. Why Images Make or Break Core Web Vitals',
        content: [
          'Google officially uses Core Web Vitals as a ranking factor in organic search. In over 70% of web audits, the Largest Contentful Paint (LCP) element on the page is a hero image or promotional banner.',
          'If a mobile user on a 4G connection must download a 3 MB uncompressed camera JPEG before your hero section renders, your LCP will easily exceed 4.5 seconds—earning a "Poor" rating from Google Lighthouse and causing high bounce rates.',
          'By compressing that hero image to WebP under 150 KB and resizing it to match the actual mobile display width, your LCP drops under 1.2 seconds, securing a "Good" rating and higher organic search visibility.',
        ],
      },
      {
        id: 'cumulative-layout-shift',
        title: '2. Eliminating Cumulative Layout Shift (CLS)',
        content: [
          'When images load without explicit width and height attributes in the HTML, the browser cannot reserve space on the screen before the image file is fetched. As a result, paragraphs and buttons jump downward when the image pops in.',
          'Always supply explicit width and height attributes or CSS aspect-ratio properties on every <img> tag. Modern browsers use these attributes to calculate the aspect ratio and allocate layout space immediately, achieving a zero CLS score.',
        ],
        callout: {
          type: 'tip',
          title: 'HTML Best Practice',
          text: 'Always include width="1200" height="630" on your <img> elements along with style="aspect-ratio: 1200 / 630; width: 100%; height: auto;".',
        },
      },
      {
        id: 'responsive-images',
        title: '3. Serving Responsive Images with srcset and sizes',
        content: [
          'Never deliver the same 1920px image file to both a 390px mobile phone and a 4K desktop display.',
          'Use the HTML <picture> tag or srcset attribute to provide multiple resolution tiers (e.g., 640px, 1024px, 1600px). The browser automatically selects the smallest suitable asset based on device pixel density and viewport width.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the recommended maximum file size for a website banner?',
        answer: 'For full-width hero banners, aim for under 200 KB. For standard blog in-content illustrations and thumbnails, aim for under 70 KB in WebP format.',
      },
      {
        question: 'Should I lazy-load every image on my page?',
        answer: 'No! Never lazy-load your above-the-fold hero image (the LCP element), as doing so delays fetching and harms your LCP score. Only apply loading="lazy" to images that are below the initial viewport fold.',
      },
    ],
  },
  {
    slug: 'passport-and-visa-photo-size-requirements',
    title: 'Official Passport & Visa Photo Size Requirements Guide',
    metaTitle: 'Passport & Visa Photo Size Requirements & Biometric Standards Guide',
    metaDescription: 'Complete reference for passport photo specifications worldwide: US (2x2 inch, 600x600px), Schengen (35x45mm), UK, and India. Understand head height ratios, file size caps, and biometric rules.',
    category: 'Biometrics',
    readingTime: '5 min read',
    publishedDate: '2026-03-12',
    modifiedDate: '2026-09-25',
    author: 'Image Optimizer Engineering Team',
    summary: 'Avoid passport and visa application rejections. Exact dimensional, resolution, aspect ratio, background color, and file size limits for government portals.',
    relatedTool: {
      name: 'Launch Passport Photo Creator',
      path: '/passport-photo-creator',
      description: 'Crop, align with biometric face oval guides, and cap under strict portal file size limits.',
    },
    sections: [
      {
        id: 'us-passport-specs',
        title: '1. United States Passport & Visa Specifications',
        content: [
          '• Dimensions: 2 × 2 inches (51 × 51 mm), square 1:1 aspect ratio.',
          '• Digital Resolution: Exactly 600 × 600 pixels minimum, up to 1200 × 1200 pixels at 300 DPI.',
          '• Head Proportion: The head (from bottom of chin to top of hair) must be between 1 inch and 1 3/8 inches (50% to 69% of the total image height).',
          '• Eye Height: Eyes must be between 1 1/8 inches and 1 3/8 inches (56% to 69%) from the bottom of the photo.',
          '• File Size Limits: Must be less than or equal to 240 KB for Department of State online renewals.',
          '• Format: Color JPEG (24-bit sRGB color space).',
          '• Background: Plain white or off-white with no shadows, texture, or patterns.',
        ],
        callout: {
          type: 'warning',
          title: 'Strict US Rules',
          text: 'Eyeglasses are strictly forbidden in US passport photos unless accompanied by a signed medical statement. Uniforms and hats/head coverings (except for religious/medical purposes) are also prohibited.',
        },
      },
      {
        id: 'schengen-uk-specs',
        title: '2. Schengen Area & UK Passport / Visa Specifications',
        content: [
          '• Dimensions: 35 × 45 mm (aspect ratio 7:9).',
          '• Digital Resolution: Minimum 413 × 531 pixels at 300 DPI.',
          '• Head Proportion: Chin-to-crown height must measure between 32 mm and 36 mm (70% to 80% of total height).',
          '• Background: Plain light grey or cream for UK; plain white or light neutral grey for Schengen embassies.',
          '• Neutral facial expression with mouth closed and eyes looking directly into the camera.',
        ],
      },
      {
        id: 'india-visa-specs',
        title: '3. Indian Passport & OCI / Visa Specifications',
        content: [
          '• Dimensions: 2 × 2 inches (51 × 51 mm) for OCI card applications and US consulate processing; 35 × 45 mm for domestic Indian passport seva kendras.',
          '• File Size Cap: The online Indian e-Visa portal requires the digital photograph to be between 10 KB and 300 KB in JPEG format.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do government portals reject photos for being too large?',
        answer: 'Government servers process millions of visa and passport applications through automated document verification pipelines. Strict file caps (such as 240 KB for US DS-11/DS-82 or 300 KB for e-Visa) prevent server overload and ensure database indexing speed.',
      },
      {
        question: 'How does the Passport Photo Creator help me comply?',
        answer: 'Our Passport Photo Creator tool provides semi-transparent face and eye alignment guides overlaid directly onto your photo, locks the correct aspect ratio (1:1 or 35:45), and allows you to enforce a strict file cap (e.g. under 240 KB) automatically.',
      },
    ],
  },
];
