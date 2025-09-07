// Application Data
const APP_DATA = {
  templates: [
    {
      id: "process-flow",
      name: "Process Flow",
      description: "Horizontal steps connected by arrows",
      icon: "→",
      sampleText: "Step 1: Research your market\nStep 2: Define your target audience\nStep 3: Develop your product\nStep 4: Create marketing plan\nStep 5: Launch and monitor"
    },
    {
      id: "circular-diagram", 
      name: "Circular Diagram",
      description: "Central topic with radiating elements",
      icon: "◯",
      sampleText: "Digital Marketing Strategy\n- Social Media Marketing\n- Content Marketing\n- Email Marketing\n- SEO Optimization\n- Paid Advertising\n- Analytics & Reporting"
    },
    {
      id: "timeline",
      name: "Timeline", 
      description: "Chronological progression of events",
      icon: "│",
      sampleText: "Project Timeline\n2024 Q1: Planning Phase\n2024 Q2: Development Phase\n2024 Q3: Testing Phase\n2024 Q4: Launch Phase"
    },
    {
      id: "comparison",
      name: "Comparison Chart",
      description: "Side-by-side analysis", 
      icon: "⚖",
      sampleText: "Remote Work vs Office Work\nRemote Work:\n- Flexibility\n- No commute\n- Work-life balance\nOffice Work:\n- Team collaboration\n- Office resources\n- Social interaction"
    },
    {
      id: "pyramid",
      name: "Hierarchy Pyramid",
      description: "Layered information structure",
      icon: "▲", 
      sampleText: "Maslow's Hierarchy of Needs\nSelf-actualization\nEsteem needs\nLove and belonging\nSafety needs\nPhysiological needs"
    },
    {
      id: "statistics",
      name: "Statistics Dashboard", 
      description: "Data visualization with charts",
      icon: "📊",
      sampleText: "Business Performance 2024\nRevenue: $2.5M (↑15%)\nUsers: 50K (↑25%)\nConversion Rate: 3.2% (↑10%)\nCustomer Satisfaction: 92%"
    }
  ],
  colorPalettes: [
    {name: "Ocean Blue", primary: "#2563eb", secondary: "#60a5fa", accent: "#1d4ed8"},
    {name: "Forest Green", primary: "#16a34a", secondary: "#4ade80", accent: "#15803d"},
    {name: "Sunset Orange", primary: "#ea580c", secondary: "#fb923c", accent: "#c2410c"},
    {name: "Royal Purple", primary: "#9333ea", secondary: "#c084fc", accent: "#7c3aed"},
    {name: "Rose Pink", primary: "#e11d48", secondary: "#fb7185", accent: "#be123c"},
    {name: "Neutral Gray", primary: "#6b7280", secondary: "#9ca3af", accent: "#4b5563"}
  ],
  iconCategories: [
    {
      name: "Business",
      icons: ["💼", "📈", "💰", "🏢", "📊", "⚡", "🎯", "🔧", "📋", "💡"]
    },
    {
      name: "Technology", 
      icons: ["💻", "📱", "⚙️", "🔌", "📡", "🛠️", "🖥️", "🔒", "☁️", "🚀"]
    },
    {
      name: "Education",
      icons: ["📚", "🎓", "✏️", "📝", "🔬", "🧮", "📐", "🎨", "🏫", "👨‍🏫"]
    },
    {
      name: "Health",
      icons: ["❤️", "🏥", "💊", "🩺", "🧬", "🍎", "🏃", "🧘", "😊", "⚕️"]
    }
  ]
};

// Application State
const state = {
  currentTemplate: null,
  selectedPalette: APP_DATA.colorPalettes[0],
  selectedFont: 'Arial',
  canvasSize: '800x600',
  zoomLevel: 1,
  parsedContent: null,
  canvas: null,
  ctx: null,
  selectedIcon: null
};

// DOM Elements
const elements = {
  textInput: null,
  charCount: null,
  clearBtn: null,
  templatesGrid: null,
  generateBtn: null,
  canvas: null,
  canvasPlaceholder: null,
  colorPalettes: null,
  fontSelect: null,
  iconTabs: null,
  iconGrid: null,
  downloadBtns: {}
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupEventListeners();
  renderTemplates();
  renderColorPalettes();
  renderIconCategories();
  updateCharCount();
});

function initializeElements() {
  elements.textInput = document.getElementById('textInput');
  elements.charCount = document.getElementById('charCount');
  elements.clearBtn = document.getElementById('clearBtn');
  elements.templatesGrid = document.getElementById('templatesGrid');
  elements.generateBtn = document.getElementById('generateBtn');
  elements.canvas = document.getElementById('infographicCanvas');
  elements.canvasPlaceholder = document.getElementById('canvasPlaceholder');
  elements.colorPalettes = document.getElementById('colorPalettes');
  elements.fontSelect = document.getElementById('fontSelect');
  elements.iconTabs = document.getElementById('iconTabs');
  elements.iconGrid = document.getElementById('iconGrid');
  elements.downloadBtns = {
    png: document.getElementById('downloadPng'),
    svg: document.getElementById('downloadSvg'),
    pdf: document.getElementById('downloadPdf')
  };

  state.canvas = elements.canvas;
  state.ctx = elements.canvas.getContext('2d');
}

function setupEventListeners() {
  // Text input events
  elements.textInput.addEventListener('input', updateCharCount);
  elements.clearBtn.addEventListener('click', clearText);

  // Example buttons
  document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const text = e.target.getAttribute('data-text').replace(/&#10;/g, '\n');
      elements.textInput.value = text;
      updateCharCount();
    });
  });

  // Generate button
  elements.generateBtn.addEventListener('click', generateInfographic);

  // Font selection
  elements.fontSelect.addEventListener('change', (e) => {
    state.selectedFont = e.target.value;
    if (state.parsedContent) {
      renderInfographic();
    }
  });

  // Canvas size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.canvasSize = e.target.getAttribute('data-size');
      updateCanvasSize();
    });
  });

  // Zoom controls
  document.getElementById('zoomIn').addEventListener('click', () => adjustZoom(0.1));
  document.getElementById('zoomOut').addEventListener('click', () => adjustZoom(-0.1));

  // Download buttons
  elements.downloadBtns.png.addEventListener('click', () => downloadCanvas('png'));
  elements.downloadBtns.svg.addEventListener('click', () => downloadCanvas('svg'));
  elements.downloadBtns.pdf.addEventListener('click', () => downloadCanvas('pdf'));
}

function updateCharCount() {
  const count = elements.textInput.value.length;
  elements.charCount.textContent = count;
}

function clearText() {
  elements.textInput.value = '';
  updateCharCount();
}

function renderTemplates() {
  elements.templatesGrid.innerHTML = APP_DATA.templates.map(template => `
    <div class="template-card" data-template="${template.id}">
      <span class="template-icon">${template.icon}</span>
      <div class="template-name">${template.name}</div>
      <div class="template-description">${template.description}</div>
    </div>
  `).join('');

  // Add click listeners
  document.querySelectorAll('.template-card').forEach(card => {
    card.addEventListener('click', (e) => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      
      const templateId = e.currentTarget.getAttribute('data-template');
      state.currentTemplate = APP_DATA.templates.find(t => t.id === templateId);
    });
  });
}

function renderColorPalettes() {
  elements.colorPalettes.innerHTML = APP_DATA.colorPalettes.map((palette, index) => `
    <div class="color-palette ${index === 0 ? 'selected' : ''}" data-palette="${index}">
      <div class="color-swatches">
        <div class="color-swatch" style="background-color: ${palette.primary}"></div>
        <div class="color-swatch" style="background-color: ${palette.secondary}"></div>
        <div class="color-swatch" style="background-color: ${palette.accent}"></div>
      </div>
      <div class="palette-name">${palette.name}</div>
    </div>
  `).join('');

  // Add click listeners
  document.querySelectorAll('.color-palette').forEach(palette => {
    palette.addEventListener('click', (e) => {
      document.querySelectorAll('.color-palette').forEach(p => p.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      
      const paletteIndex = parseInt(e.currentTarget.getAttribute('data-palette'));
      state.selectedPalette = APP_DATA.colorPalettes[paletteIndex];
      
      if (state.parsedContent) {
        renderInfographic();
      }
    });
  });
}

function renderIconCategories() {
  // Render tabs
  elements.iconTabs.innerHTML = APP_DATA.iconCategories.map((category, index) => `
    <button class="icon-tab ${index === 0 ? 'active' : ''}" data-category="${index}">
      ${category.name}
    </button>
  `).join('');

  // Render initial icons (Business category)
  renderIconGrid(0);

  // Add tab listeners
  document.querySelectorAll('.icon-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('.icon-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      
      const categoryIndex = parseInt(e.target.getAttribute('data-category'));
      renderIconGrid(categoryIndex);
    });
  });
}

function renderIconGrid(categoryIndex) {
  const category = APP_DATA.iconCategories[categoryIndex];
  elements.iconGrid.innerHTML = category.icons.map(icon => `
    <div class="icon-item" data-icon="${icon}">
      ${icon}
    </div>
  `).join('');

  // Add icon listeners
  document.querySelectorAll('.icon-item').forEach(item => {
    item.addEventListener('click', (e) => {
      document.querySelectorAll('.icon-item').forEach(i => i.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
      
      state.selectedIcon = e.currentTarget.getAttribute('data-icon');
    });
  });
}

function parseTextContent(text) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Try to detect content type
  const hasSteps = lines.some(line => /^step\s+\d+/i.test(line.trim()));
  const hasBullets = lines.some(line => line.trim().startsWith('-'));
  const hasNumbers = lines.some(line => /\d+%|\$[\d,]+|↑|↓/.test(line));
  const hasColons = lines.some(line => line.includes(':'));

  let contentType = 'generic';
  if (hasSteps) contentType = 'steps';
  else if (hasNumbers) contentType = 'statistics';
  else if (hasBullets) contentType = 'bullets';
  else if (hasColons) contentType = 'timeline';

  // Parse based on content type
  let parsed = {
    type: contentType,
    title: lines[0] || 'Untitled',
    items: []
  };

  if (contentType === 'steps') {
    parsed.items = lines.filter(line => /^step\s+\d+/i.test(line.trim()))
      .map(line => line.replace(/^step\s+\d+:\s*/i, '').trim());
  } else if (contentType === 'bullets') {
    parsed.items = lines.filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
  } else if (contentType === 'statistics') {
    parsed.items = lines.slice(1).map(line => {
      const match = line.match(/^([^:]+):\s*(.+)$/);
      return match ? { label: match[1].trim(), value: match[2].trim() } : { label: line, value: '' };
    });
  } else {
    parsed.items = lines.slice(1);
  }

  return parsed;
}

async function generateInfographic() {
  const text = elements.textInput.value.trim();
  if (!text) {
    alert('Please enter some text to generate an infographic.');
    return;
  }

  // Show loading state
  showLoading(true);

  try {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse content
    state.parsedContent = parseTextContent(text);

    // Auto-select template if none selected
    if (!state.currentTemplate) {
      state.currentTemplate = suggestTemplate(state.parsedContent);
      
      // Update UI to show selected template
      document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
        if (card.getAttribute('data-template') === state.currentTemplate.id) {
          card.classList.add('selected');
        }
      });
    }

    // Render infographic
    renderInfographic();

    // Hide placeholder, show canvas
    elements.canvasPlaceholder.style.display = 'none';
    elements.canvas.style.display = 'block';
    elements.canvas.classList.add('canvas-reveal');

  } catch (error) {
    console.error('Error generating infographic:', error);
    alert('Error generating infographic. Please try again.');
  } finally {
    showLoading(false);
  }
}

function suggestTemplate(content) {
  // Simple AI-like template suggestion logic
  if (content.type === 'steps') {
    return APP_DATA.templates.find(t => t.id === 'process-flow');
  } else if (content.type === 'statistics') {
    return APP_DATA.templates.find(t => t.id === 'statistics');
  } else if (content.type === 'timeline') {
    return APP_DATA.templates.find(t => t.id === 'timeline');
  } else {
    return APP_DATA.templates.find(t => t.id === 'circular-diagram');
  }
}

function showLoading(show) {
  const btnText = elements.generateBtn.querySelector('.btn-text');
  const btnLoader = elements.generateBtn.querySelector('.btn-loader');
  
  if (show) {
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    elements.generateBtn.disabled = true;
  } else {
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
    elements.generateBtn.disabled = false;
  }
}

function renderInfographic() {
  if (!state.parsedContent || !state.currentTemplate) return;

  const ctx = state.ctx;
  const canvas = state.canvas;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Set background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Render based on template type
  switch (state.currentTemplate.id) {
    case 'process-flow':
      renderProcessFlow(ctx, canvas, state.parsedContent);
      break;
    case 'circular-diagram':
      renderCircularDiagram(ctx, canvas, state.parsedContent);
      break;
    case 'timeline':
      renderTimeline(ctx, canvas, state.parsedContent);
      break;
    case 'comparison':
      renderComparison(ctx, canvas, state.parsedContent);
      break;
    case 'pyramid':
      renderPyramid(ctx, canvas, state.parsedContent);
      break;
    case 'statistics':
      renderStatistics(ctx, canvas, state.parsedContent);
      break;
    default:
      renderGeneric(ctx, canvas, state.parsedContent);
  }
}

function renderProcessFlow(ctx, canvas, content) {
  const steps = content.items.slice(0, 5); // Max 5 steps
  const stepWidth = 140;
  const stepHeight = 80;
  const spacing = 60;
  const startX = (canvas.width - (steps.length * stepWidth + (steps.length - 1) * spacing)) / 2;
  const y = canvas.height / 2 - stepHeight / 2;

  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, canvas.width / 2, 60);

  steps.forEach((step, index) => {
    const x = startX + index * (stepWidth + spacing);
    
    // Draw step box
    ctx.fillStyle = state.selectedPalette.secondary;
    ctx.fillRect(x, y, stepWidth, stepHeight);
    
    // Draw step border
    ctx.strokeStyle = state.selectedPalette.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, stepWidth, stepHeight);
    
    // Draw step number
    ctx.fillStyle = state.selectedPalette.primary;
    ctx.font = `bold 16px ${state.selectedFont}`;
    ctx.fillText(`${index + 1}`, x + stepWidth / 2, y + 25);
    
    // Draw step text
    ctx.fillStyle = '#333333';
    ctx.font = `12px ${state.selectedFont}`;
    wrapText(ctx, step, x + stepWidth / 2, y + 45, stepWidth - 20, 14);
    
    // Draw arrow
    if (index < steps.length - 1) {
      drawArrow(ctx, x + stepWidth, y + stepHeight / 2, x + stepWidth + spacing, y + stepHeight / 2);
    }
  });
}

function renderCircularDiagram(ctx, canvas, content) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 180;
  const innerRadius = 80;
  const items = content.items.slice(0, 8); // Max 8 items

  // Draw title
  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, centerX, 50);

  // Draw center circle
  ctx.beginPath();
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.fill();

  // Draw center text
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold 16px ${state.selectedFont}`;
  ctx.fillText('MAIN', centerX, centerY - 5);
  ctx.fillText('TOPIC', centerX, centerY + 15);

  // Draw items around circle
  items.forEach((item, index) => {
    const angle = (index / items.length) * 2 * Math.PI - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Draw connection line
    ctx.beginPath();
    ctx.moveTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius);
    ctx.lineTo(x, y);
    ctx.strokeStyle = state.selectedPalette.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw item circle
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, 2 * Math.PI);
    ctx.fillStyle = state.selectedPalette.secondary;
    ctx.fill();
    ctx.strokeStyle = state.selectedPalette.primary;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw item text
    ctx.fillStyle = '#333333';
    ctx.font = `10px ${state.selectedFont}`;
    wrapText(ctx, item, x, y, 50, 10);
  });
}

function renderTimeline(ctx, canvas, content) {
  const items = content.items.slice(0, 6); // Max 6 items
  const lineY = canvas.height / 2;
  const startX = 100;
  const endX = canvas.width - 100;
  const itemSpacing = (endX - startX) / (items.length - 1);

  // Draw title
  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, canvas.width / 2, 60);

  // Draw timeline line
  ctx.beginPath();
  ctx.moveTo(startX, lineY);
  ctx.lineTo(endX, lineY);
  ctx.strokeStyle = state.selectedPalette.primary;
  ctx.lineWidth = 4;
  ctx.stroke();

  items.forEach((item, index) => {
    const x = startX + index * itemSpacing;
    const isEven = index % 2 === 0;
    const textY = isEven ? lineY - 60 : lineY + 60;
    
    // Draw timeline point
    ctx.beginPath();
    ctx.arc(x, lineY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = state.selectedPalette.secondary;
    ctx.fill();
    ctx.strokeStyle = state.selectedPalette.primary;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Draw connecting line
    ctx.beginPath();
    ctx.moveTo(x, lineY + (isEven ? -8 : 8));
    ctx.lineTo(x, textY + (isEven ? 20 : -20));
    ctx.strokeStyle = state.selectedPalette.secondary;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Draw item box
    const boxWidth = 120;
    const boxHeight = 40;
    ctx.fillStyle = state.selectedPalette.secondary;
    ctx.fillRect(x - boxWidth / 2, textY - boxHeight / 2, boxWidth, boxHeight);
    ctx.strokeStyle = state.selectedPalette.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - boxWidth / 2, textY - boxHeight / 2, boxWidth, boxHeight);
    
    // Draw item text
    ctx.fillStyle = '#333333';
    ctx.font = `10px ${state.selectedFont}`;
    ctx.textAlign = 'center';
    wrapText(ctx, item, x, textY, boxWidth - 10, 11);
  });
}

function renderStatistics(ctx, canvas, content) {
  const stats = content.items.slice(0, 4); // Max 4 stats
  const cols = 2;
  const rows = 2;
  const boxWidth = 180;
  const boxHeight = 120;
  const spacingX = (canvas.width - cols * boxWidth) / (cols + 1);
  const spacingY = (canvas.height - rows * boxHeight - 100) / (rows + 1);

  // Draw title
  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, canvas.width / 2, 50);

  stats.forEach((stat, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    const x = spacingX + col * (boxWidth + spacingX);
    const y = 100 + spacingY + row * (boxHeight + spacingY);
    
    // Draw stat box
    ctx.fillStyle = state.selectedPalette.secondary;
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.strokeStyle = state.selectedPalette.primary;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, boxWidth, boxHeight);
    
    // Draw stat label
    ctx.fillStyle = state.selectedPalette.primary;
    ctx.font = `bold 14px ${state.selectedFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(stat.label || `Metric ${index + 1}`, x + boxWidth / 2, y + 25);
    
    // Draw stat value
    ctx.fillStyle = '#333333';
    ctx.font = `bold 20px ${state.selectedFont}`;
    ctx.fillText(stat.value || '100%', x + boxWidth / 2, y + 55);
    
    // Draw icon if selected
    if (state.selectedIcon) {
      ctx.font = '24px serif';
      ctx.fillText(state.selectedIcon, x + boxWidth / 2, y + 85);
    }
  });
}

function renderComparison(ctx, canvas, content) {
  const items = content.items;
  const leftItems = items.slice(0, Math.ceil(items.length / 2));
  const rightItems = items.slice(Math.ceil(items.length / 2));
  
  const centerX = canvas.width / 2;
  const leftX = centerX / 2;
  const rightX = centerX + centerX / 2;

  // Draw title
  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, centerX, 50);

  // Draw center divider
  ctx.beginPath();
  ctx.moveTo(centerX, 80);
  ctx.lineTo(centerX, canvas.height - 50);
  ctx.strokeStyle = state.selectedPalette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Draw left side
  ctx.fillStyle = state.selectedPalette.secondary;
  ctx.font = `bold 16px ${state.selectedFont}`;
  ctx.textAlign = 'center';
  ctx.fillText('Option A', leftX, 100);
  
  leftItems.forEach((item, index) => {
    const y = 130 + index * 40;
    ctx.fillStyle = '#333333';
    ctx.font = `12px ${state.selectedFont}`;
    ctx.fillText(`• ${item}`, leftX, y);
  });

  // Draw right side
  ctx.fillStyle = state.selectedPalette.secondary;
  ctx.font = `bold 16px ${state.selectedFont}`;
  ctx.textAlign = 'center';
  ctx.fillText('Option B', rightX, 100);
  
  rightItems.forEach((item, index) => {
    const y = 130 + index * 40;
    ctx.fillStyle = '#333333';
    ctx.font = `12px ${state.selectedFont}`;
    ctx.fillText(`• ${item}`, rightX, y);
  });
}

function renderPyramid(ctx, canvas, content) {
  const items = content.items.slice(0, 5); // Max 5 levels
  const pyramidWidth = 400;
  const pyramidHeight = 300;
  const startX = (canvas.width - pyramidWidth) / 2;
  const startY = 120;

  // Draw title
  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, canvas.width / 2, 50);

  items.forEach((item, index) => {
    const levelHeight = pyramidHeight / items.length;
    const y = startY + index * levelHeight;
    const levelWidth = pyramidWidth * (items.length - index) / items.length;
    const x = (canvas.width - levelWidth) / 2;
    
    // Draw level rectangle
    ctx.fillStyle = `hsl(${200 + index * 20}, 60%, ${70 - index * 8}%)`;
    ctx.fillRect(x, y, levelWidth, levelHeight);
    ctx.strokeStyle = state.selectedPalette.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, levelWidth, levelHeight);
    
    // Draw level text
    ctx.fillStyle = '#333333';
    ctx.font = `bold 14px ${state.selectedFont}`;
    ctx.textAlign = 'center';
    wrapText(ctx, item, x + levelWidth / 2, y + levelHeight / 2, levelWidth - 20, 16);
  });
}

function renderGeneric(ctx, canvas, content) {
  // Fallback generic template
  ctx.font = `bold 24px ${state.selectedFont}`;
  ctx.fillStyle = state.selectedPalette.primary;
  ctx.textAlign = 'center';
  ctx.fillText(content.title, canvas.width / 2, 60);

  content.items.forEach((item, index) => {
    const y = 120 + index * 40;
    ctx.fillStyle = '#333333';
    ctx.font = `16px ${state.selectedFont}`;
    ctx.fillText(`• ${item}`, 100, y);
  });
}

// Helper Functions
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let testLine = '';
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  const startY = y - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, index) => {
    ctx.fillText(line.trim(), x, startY + index * lineHeight);
  });
}

function drawArrow(ctx, x1, y1, x2, y2) {
  const headlen = 15;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = state.selectedPalette.primary;
  ctx.lineWidth = 3;
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 6), y2 - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 6), y2 - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function updateCanvasSize() {
  const [width, height] = state.canvasSize.split('x').map(Number);
  elements.canvas.width = width;
  elements.canvas.height = height;
  
  if (state.parsedContent) {
    renderInfographic();
  }
}

function adjustZoom(delta) {
  state.zoomLevel = Math.max(0.5, Math.min(2, state.zoomLevel + delta));
  elements.canvas.style.transform = `scale(${state.zoomLevel})`;
  document.getElementById('zoomLevel').textContent = `${Math.round(state.zoomLevel * 100)}%`;
}

function downloadCanvas(format) {
  if (!state.parsedContent) {
    alert('Please generate an infographic first.');
    return;
  }

  const canvas = elements.canvas;
  const filename = `infographic-${Date.now()}`;

  switch (format) {
    case 'png':
      const pngUrl = canvas.toDataURL('image/png');
      downloadFile(pngUrl, `${filename}.png`);
      break;
    case 'svg':
      // For SVG, we'd need to recreate the canvas content as SVG
      // This is a simplified version
      alert('SVG export coming soon!');
      break;
    case 'pdf':
      // For PDF, we'd need a library like jsPDF
      alert('PDF export coming soon!');
      break;
  }
}

function downloadFile(url, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}