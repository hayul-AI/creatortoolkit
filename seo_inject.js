const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');
const domain = 'https://creatortoolkit.hotplmedia.com';

const schemaScript = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "CreatorToolkit",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "description": "유튜브 분석, 디자인 유틸리티 등 다양한 100% 무료 크리에이터 도구를 제공합니다.",
  "url": "https://creatortoolkit.hotplmedia.com/"
}
</script>
`;

// Helper to recursively get all HTML files
function getAllHtmlFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllHtmlFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.html') && file !== '404.html') {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const htmlFiles = getAllHtmlFiles(publicDir);

// 1. Update Sitemap
let sitemapUrls = '';
const today = new Date().toISOString().split('T')[0];

htmlFiles.forEach(file => {
  const relativePath = file.replace(publicDir, '').replace(/\\/g, '/');
  // Avoid leading double slash if any
  const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
  const fullUrl = `${domain}/${cleanPath}`;
  
  let priority = '0.5';
  let changefreq = 'monthly';
  
  if (cleanPath === 'index.html' || cleanPath === '') {
      priority = '1.0';
      changefreq = 'daily';
  } else if (cleanPath.includes('tools.html') || cleanPath.includes('guides.html')) {
      priority = '0.9';
      changefreq = 'weekly';
  } else if (cleanPath.startsWith('tools/') || cleanPath.startsWith('guides/')) {
       priority = '0.8';
       changefreq = 'weekly';
  }

  sitemapUrls += `
    <url>
        <loc>${fullUrl}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
});

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
</urlset>`;

fs.writeFileSync(sitemapPath, sitemapContent.trim());
console.log('Sitemap generated successfully.');

// 2. Inject Meta and Schema
const titleSuffix = ' | 크리에이터 도구 | 유튜브 분석 | 디자인 유틸리티';
const descSuffix = ' 크리에이터 도구, 유튜브 분석, 디자인 유틸리티를 제공합니다.';

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Inject Title if not present
    if (!content.includes(titleSuffix)) {
        content = content.replace(/<title>(.*?)<\/title>/i, (match, p1) => {
            return `<title>${p1}${titleSuffix}</title>`;
        });
    }

    // Inject Description if not present
    if (!content.includes('크리에이터 도구, 유튜브 분석, 디자인 유틸리티')) {
        content = content.replace(/<meta name="description" content="(.*?)">/i, (match, p1) => {
             // Avoid double appending if ran multiple times
             return `<meta name="description" content="${p1} ${descSuffix}">`;
        });
    }

    // Inject Schema before </head> if not present
    if (!content.includes('application/ld+json') && !content.includes('"@type": "WebApplication"')) {
         content = content.replace('</head>', `${schemaScript}</head>`);
    }

    fs.writeFileSync(file, content);
    console.log(`Processed: ${file}`);
});

console.log('Done Processing all HTML files.');
