import {css, html, LitElement} from 'lit'
import './style.css';
import {SaveFileDialog, ExportImage} from "../wailsjs/go/main/App.js";

export class ImageStitchApp extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        height: 100vh;
        overflow: hidden;
      }
      .app-container {
        display: flex;
        height: 100vh;
        font-family: "Nunito", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #1a1a2e;
        color: #fff;
      }
      .sidebar {
        width: 280px;
        background: #16213e;
        padding: 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .sidebar h2 {
        margin: 0 0 8px 0;
        font-size: 18px;
        color: #e94560;
      }
      .sidebar-section {
        background: #1a1a2e;
        border-radius: 8px;
        padding: 12px;
      }
      .sidebar-section h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: #a0a0a0;
      }
      .btn {
        width: 100%;
        padding: 10px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
        transition: all 0.2s;
      }
      .btn-primary {
        background: linear-gradient(135deg, #e94560 0%, #0f3460 100%);
        color: white;
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(233, 69, 96, 0.4);
      }
      .btn-secondary {
        background: #2a2a4a;
        color: white;
      }
      .btn-secondary:hover {
        background: #3a3a5a;
      }
      .layout-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .layout-btn {
        padding: 12px 8px;
        border: 2px solid transparent;
        border-radius: 8px;
        background: #2a2a4a;
        color: white;
        cursor: pointer;
        font-size: 12px;
        text-align: center;
        transition: all 0.2s;
      }
      .layout-btn:hover {
        border-color: #e94560;
      }
      .layout-btn.active {
        border-color: #e94560;
        background: rgba(233, 69, 96, 0.2);
      }
      .template-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .template-item {
        padding: 10px;
        border: 2px solid #2a2a4a;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        background: #2a2a4a;
      }
      .template-item:hover {
        border-color: #e94560;
      }
      .template-item.active {
        border-color: #e94560;
        background: rgba(233, 69, 96, 0.2);
      }
      .template-preview {
        height: 60px;
        background: #1a1a2e;
        border-radius: 4px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        color: #666;
      }
      .template-name {
        font-size: 12px;
        text-align: center;
      }
      .control-group {
        margin-bottom: 12px;
      }
      .control-group label {
        display: block;
        margin-bottom: 4px;
        font-size: 12px;
        color: #a0a0a0;
      }
      .control-group input[type="range"] {
        width: 100%;
        height: 6px;
        border-radius: 3px;
        background: #2a2a4a;
        outline: none;
        -webkit-appearance: none;
      }
      .control-group input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #e94560;
        cursor: pointer;
      }
      .control-group input[type="color"] {
        width: 100%;
        height: 32px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        background: #2a2a4a;
      }
      .control-group select {
        width: 100%;
        padding: 8px;
        border: none;
        border-radius: 4px;
        background: #2a2a4a;
        color: white;
        font-size: 13px;
        cursor: pointer;
      }
      .control-value {
        text-align: right;
        font-size: 12px;
        color: #e94560;
        margin-top: 2px;
      }
      .image-count {
        font-size: 12px;
        color: #a0a0a0;
        text-align: center;
        padding: 8px;
        background: #1a1a2e;
        border-radius: 4px;
      }
      .main-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 16px;
        gap: 16px;
        overflow: hidden;
      }
      .preview-area {
        flex: 1;
        background: #16213e;
        border-radius: 12px;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        overflow: auto;
        position: relative;
        padding: 20px;
      }
      .preview-area img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
      }
      .preview-placeholder {
        color: #666;
        font-size: 16px;
        text-align: center;
      }
      .preview-placeholder svg {
        width: 80px;
        height: 80px;
        margin-bottom: 16px;
        opacity: 0.3;
      }
      .toolbar {
        display: flex;
        gap: 12px;
        align-items: center;
        background: #16213e;
        padding: 12px 16px;
        border-radius: 8px;
      }
      .toolbar-group {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .toolbar label {
        font-size: 13px;
        color: #a0a0a0;
      }
      .toolbar input[type="checkbox"] {
        width: auto;
        margin: 0;
      }
      .toolbar input {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background: #2a2a4a;
        color: white;
        font-size: 13px;
        width: 80px;
      }
      .toolbar .btn {
        width: auto;
        padding: 8px 16px;
      }
      .sort-buttons {
        display: flex;
        gap: 8px;
      }
      .sort-btn {
        padding: 6px 12px;
        border: 1px solid #3a3a5a;
        border-radius: 4px;
        background: transparent;
        color: #a0a0a0;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }
      .sort-btn:hover {
        border-color: #e94560;
        color: white;
      }
      .sort-btn.active {
        border-color: #e94560;
        background: rgba(233, 69, 96, 0.2);
        color: white;
      }
      .image-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 8px;
        padding: 8px;
        background: #1a1a2e;
        border-radius: 8px;
        max-height: 200px;
        overflow-y: auto;
      }
      .image-item {
        position: relative;
        aspect-ratio: 1;
        border-radius: 6px;
        overflow: hidden;
        cursor: move;
        border: 2px solid transparent;
        transition: all 0.2s;
      }
      .image-item:hover {
        border-color: #e94560;
      }
      .image-item.dragging {
        opacity: 0.5;
      }
      .image-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .image-item .remove-btn {
        position: absolute;
        top: 4px;
        right: 4px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(233, 69, 96, 0.9);
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .image-item:hover .remove-btn {
        opacity: 1;
      }
      .export-options {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-left: auto;
      }
      .export-options select {
        padding: 8px 12px;
        border: none;
        border-radius: 4px;
        background: #2a2a4a;
        color: white;
        font-size: 13px;
        cursor: pointer;
      }
      .loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
      }
      .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #3a3a5a;
        border-top-color: #e94560;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .drop-zone {
        border: 2px dashed #3a3a5a;
        border-radius: 8px;
        padding: 20px;
        text-align: center;
        margin-top: 8px;
        transition: all 0.2s;
      }
      .drop-zone:hover, .drop-zone.drag-over {
        border-color: #e94560;
        background: rgba(233, 69, 96, 0.1);
      }
    `
  }

  static get properties() {
    return {
      images: { type: Array },
      config: { type: Object },
      templates: { type: Array },
      selectedTemplate: { type: Object },
      previewUrl: { type: String },
      layoutType: { type: String },
      loading: { type: Boolean },
      sortMode: { type: String },
      outputWidth: { type: Number },
      outputHeight: { type: Number },
      exportFormat: { type: String },
      autoSize: { type: Boolean }
    }
  }

  constructor() {
    super()
    this.images = []
    this.layoutType = 'grid'
    this.loading = false
    this.sortMode = 'time'
    this.outputWidth = 1920
    this.outputHeight = 1080
    this.exportFormat = 'png'
    this.autoSize = true
    this.config = {
      type: 'grid',
      cols: 2,
      rows: 2,
      spacing: 10,
      padding: 20,
      cornerRadius: 0,
      bgType: 'solid',
      bgSolidColor: '#FFFFFF',
      bgGradientFrom: '#16213e',
      bgGradientTo: '#0f3460',
      bgBlur: 10,
      fitType: 'crop'
    }
    this.templates = [
      {
        name: '海报模板1',
        layout: {
          type: 'poster',
          cols: 1,
          rows: 1,
          spacing: 10,
          padding: 20,
          cornerRadius: 0,
          bgType: 'solid',
          bgSolidColor: '#FFFFFF',
          fitType: 'crop'
        },
        positions: [
          { x: 0.1, y: 0.05, width: 0.8, height: 0.6 },
          { x: 0.1, y: 0.7, width: 0.35, height: 0.25 },
          { x: 0.55, y: 0.7, width: 0.35, height: 0.25 }
        ]
      },
      {
        name: '海报模板2',
        layout: {
          type: 'poster',
          cols: 1,
          rows: 1,
          spacing: 10,
          padding: 20,
          cornerRadius: 0,
          bgType: 'gradient',
          bgSolidColor: '#1a1a2e',
          bgGradientFrom: '#16213e',
          bgGradientTo: '#0f3460',
          fitType: 'fit'
        },
        positions: [
          { x: 0.05, y: 0.05, width: 0.9, height: 0.5 },
          { x: 0.05, y: 0.58, width: 0.43, height: 0.37 },
          { x: 0.52, y: 0.58, width: 0.43, height: 0.37 }
        ]
      }
    ]
    this.selectedTemplate = null
    this.previewUrl = null
  }

  async handleAddImages() {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    input.onchange = async (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) return
      await this.loadFiles(files)
    }
    input.click()
  }

  arrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  async loadFiles(files) {
    this.loading = true
    try {
      const loadedImages = []
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const base64 = this.arrayBufferToBase64(arrayBuffer)
        const exists = this.images.some(img => img.name === file.name)
        if (!exists) {
          const img = new Image()
          await new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            img.src = 'data:image/png;base64,' + base64
          })
          loadedImages.push({
            name: file.name,
            width: img.width,
            height: img.height,
            timestamp: Date.now(),
            dataBase64: base64,
            image: img
          })
        }
      }
      this.images = [...this.images, ...loadedImages]
      this.requestUpdate()
      await this.updatePreview()
    } catch (e) {
      console.error('Failed to load images:', e)
      alert('加载图片失败: ' + e.message)
    } finally {
      this.loading = false
    }
  }

  removeImage(index) {
    this.images = this.images.filter((_, i) => i !== index)
    this.updatePreview()
  }

  async sortImages(mode) {
    this.sortMode = mode
    if (this.images.length === 0) return

    const sorted = [...this.images]
    if (mode === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name))
    } else if (mode === 'time') {
      sorted.sort((a, b) => a.timestamp - b.timestamp)
    }
    this.images = sorted
    this.requestUpdate()
    await this.updatePreview()
  }

  handleDragStart(e, index) {
    this.draggedIndex = index
    e.target.classList.add('dragging')
  }

  handleDragEnd(e) {
    e.target.classList.remove('dragging')
    this.draggedIndex = null
  }

  handleDragOver(e) {
    e.preventDefault()
  }

  handleDrop(e, targetIndex) {
    e.preventDefault()
    if (this.draggedIndex === null || this.draggedIndex === targetIndex) return

    const newImages = [...this.images]
    const [draggedItem] = newImages.splice(this.draggedIndex, 1)
    newImages.splice(targetIndex, 0, draggedItem)
    this.images = newImages
    this.draggedIndex = null
    this.updatePreview()
  }

  setLayoutType(type) {
    this.layoutType = type
    this.config = { ...this.config, type }
    if (type !== 'poster') {
      this.selectedTemplate = null
    }
    this.updatePreview()
  }

  selectTemplate(template) {
    this.selectedTemplate = template
    this.layoutType = 'poster'
    this.config = { ...template.layout }
    this.updatePreview()
  }

  updateConfig(key, value) {
    this.config = { ...this.config, [key]: value }
    this.updatePreview()
  }

  hexToRgba(hex) {
    hex = hex.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return { r, g, b, a: 255 }
  }

  async updatePreview() {
    if (this.images.length === 0) {
      this.previewUrl = null
      return
    }

    if (this.autoSize) {
      this.calculateAutoSize()
    }

    this.loading = true
    try {
      const canvas = document.createElement('canvas')
      canvas.width = this.outputWidth
      canvas.height = this.outputHeight
      const ctx = canvas.getContext('2d')

      if (this.config.bgType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.outputHeight)
        gradient.addColorStop(0, this.config.bgGradientFrom)
        gradient.addColorStop(1, this.config.bgGradientTo)
        ctx.fillStyle = gradient
      } else if (this.config.bgType === 'blur') {
        if (this.images.length > 0 && this.images[0].image) {
          ctx.filter = `blur(${this.config.bgBlur}px)`
          ctx.drawImage(this.images[0].image, 0, 0, this.outputWidth, this.outputHeight)
          ctx.filter = 'none'
        }
      } else if (this.config.bgType === 'transparent') {
        ctx.clearRect(0, 0, this.outputWidth, this.outputHeight)
      } else {
        ctx.fillStyle = this.config.bgSolidColor
      }
      ctx.fillRect(0, 0, this.outputWidth, this.outputHeight)

      const positions = this.calculatePositions()
      
      for (let i = 0; i < positions.length && i < this.images.length; i++) {
        const pos = positions[i]
        const img = this.images[i].image
        if (!img) continue

        ctx.save()
        
        if (this.config.cornerRadius > 0) {
          this.roundRect(ctx, pos.x, pos.y, pos.width, pos.height, this.config.cornerRadius)
          ctx.clip()
        }

        let sx = 0, sy = 0, sw = img.width, sh = img.height
        let dx = pos.x, dy = pos.y, dw = pos.width, dh = pos.height

        if (this.config.fitType === 'crop') {
          const imgRatio = img.width / img.height
          const cellRatio = pos.width / pos.height
          if (imgRatio > cellRatio) {
            sw = img.height * cellRatio
            sx = (img.width - sw) / 2
          } else {
            sh = img.width / cellRatio
            sy = (img.height - sh) / 2
          }
        } else if (this.config.fitType === 'fit') {
          const imgRatio = img.width / img.height
          const cellRatio = pos.width / pos.height
          if (imgRatio > cellRatio) {
            dh = pos.width / imgRatio
            dy = pos.y + (pos.height - dh) / 2
          } else {
            dw = pos.height * imgRatio
            dx = pos.x + (pos.width - dw) / 2
          }
        }

        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        ctx.restore()
      }

      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl)
      }
      this.previewUrl = canvas.toDataURL('image/png')
    } catch (e) {
      console.error('Failed to generate preview:', e)
      alert('生成预览失败: ' + e.message)
    } finally {
      this.loading = false
    }
  }

  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
  }

  calculateAutoSize() {
    if (this.images.length === 0) return

    const baseSize = 500
    const spacing = this.config.spacing || 0
    const padding = this.config.padding || 0

    switch (this.layoutType) {
      case 'grid':
        const cols = this.config.cols || 2
        const rows = this.config.rows || Math.ceil(this.images.length / cols)
        this.outputWidth = cols * baseSize + (cols - 1) * spacing + padding * 2
        this.outputHeight = rows * baseSize + (rows - 1) * spacing + padding * 2
        break
      case 'horizontal':
        this.outputWidth = this.images.length * baseSize + (this.images.length - 1) * spacing + padding * 2
        this.outputHeight = baseSize + padding * 2
        break
      case 'vertical':
        this.outputWidth = baseSize + padding * 2
        this.outputHeight = this.images.length * baseSize + (this.images.length - 1) * spacing + padding * 2
        break
      case 'poster':
        if (this.selectedTemplate) {
          this.outputWidth = 1920
          this.outputHeight = 1080
        }
        break
      default:
        const gridCols = Math.min(3, Math.ceil(Math.sqrt(this.images.length)))
        const gridRows = Math.ceil(this.images.length / gridCols)
        this.outputWidth = gridCols * baseSize + (gridCols - 1) * spacing + padding * 2
        this.outputHeight = gridRows * baseSize + (gridRows - 1) * spacing + padding * 2
    }
  }

  calculatePositions() {
    const positions = []
    const cols = this.config.cols || 2
    const rows = this.config.rows || 2
    const spacing = this.config.spacing || 0
    const padding = this.config.padding || 0

    const cellWidth = (this.outputWidth - padding * 2 - (cols - 1) * spacing) / cols
    const cellHeight = (this.outputHeight - padding * 2 - (rows - 1) * spacing) / rows

    if (this.layoutType === 'horizontal') {
      const count = this.images.length
      const hCellWidth = (this.outputWidth - padding * 2 - (count - 1) * spacing) / count
      for (let i = 0; i < count; i++) {
        positions.push({
          x: padding + i * (hCellWidth + spacing),
          y: padding,
          width: hCellWidth,
          height: this.outputHeight - padding * 2
        })
      }
    } else if (this.layoutType === 'vertical') {
      const count = this.images.length
      const vCellHeight = (this.outputHeight - padding * 2 - (count - 1) * spacing) / count
      for (let i = 0; i < count; i++) {
        positions.push({
          x: padding,
          y: padding + i * (vCellHeight + spacing),
          width: this.outputWidth - padding * 2,
          height: vCellHeight
        })
      }
    } else if (this.layoutType === 'poster' && this.selectedTemplate) {
      for (const pos of this.selectedTemplate.positions) {
        positions.push({
          x: pos.x * this.outputWidth,
          y: pos.y * this.outputHeight,
          width: pos.width * this.outputWidth,
          height: pos.height * this.outputHeight
        })
      }
    } else {
      for (let i = 0; i < this.images.length; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        positions.push({
          x: padding + col * (cellWidth + spacing),
          y: padding + row * (cellHeight + spacing),
          width: cellWidth,
          height: cellHeight
        })
      }
    }

    return positions
  }

  async handleExport() {
    if (!this.previewUrl || this.images.length === 0) return

    try {
      const defaultName = `output.${this.exportFormat}`
      const savePath = await SaveFileDialog(defaultName)
      if (!savePath) return

      const canvas = document.createElement('canvas')
      canvas.width = this.outputWidth
      canvas.height = this.outputHeight
      const ctx = canvas.getContext('2d')

      if (this.config.bgType === 'gradient') {
        const gradient = ctx.createLinearGradient(0, 0, 0, this.outputHeight)
        gradient.addColorStop(0, this.config.bgGradientFrom)
        gradient.addColorStop(1, this.config.bgGradientTo)
        ctx.fillStyle = gradient
      } else if (this.config.bgType === 'blur') {
        if (this.images.length > 0 && this.images[0].image) {
          ctx.filter = `blur(${this.config.bgBlur}px)`
          ctx.drawImage(this.images[0].image, 0, 0, this.outputWidth, this.outputHeight)
          ctx.filter = 'none'
        }
      } else if (this.config.bgType === 'transparent') {
        ctx.clearRect(0, 0, this.outputWidth, this.outputHeight)
      } else {
        ctx.fillStyle = this.config.bgSolidColor
      }
      ctx.fillRect(0, 0, this.outputWidth, this.outputHeight)

      const positions = this.calculatePositions()
      
      for (let i = 0; i < positions.length && i < this.images.length; i++) {
        const pos = positions[i]
        const img = this.images[i].image
        if (!img) continue

        ctx.save()
        
        if (this.config.cornerRadius > 0) {
          this.roundRect(ctx, pos.x, pos.y, pos.width, pos.height, this.config.cornerRadius)
          ctx.clip()
        }

        let sx = 0, sy = 0, sw = img.width, sh = img.height
        let dx = pos.x, dy = pos.y, dw = pos.width, dh = pos.height

        if (this.config.fitType === 'crop') {
          const imgRatio = img.width / img.height
          const cellRatio = pos.width / pos.height
          if (imgRatio > cellRatio) {
            sw = img.height * cellRatio
            sx = (img.width - sw) / 2
          } else {
            sh = img.width / cellRatio
            sy = (img.height - sh) / 2
          }
        } else if (this.config.fitType === 'fit') {
          const imgRatio = img.width / img.height
          const cellRatio = pos.width / pos.height
          if (imgRatio > cellRatio) {
            dh = pos.width / imgRatio
            dy = pos.y + (pos.height - dh) / 2
          } else {
            dw = pos.height * imgRatio
            dx = pos.x + (pos.width - dw) / 2
          }
        }

        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
        ctx.restore()
      }

      const mimeType = this.exportFormat === 'jpg' ? 'image/jpeg' : 'image/png'
      const dataUrl = canvas.toDataURL(mimeType, 0.95)
      const base64Data = dataUrl.split(',')[1]

      const { ExportImage } = await import("../wailsjs/go/main/App.js")
      await ExportImage(base64Data, savePath, this.exportFormat)
      alert('导出成功！')
    } catch (e) {
      console.error('Failed to export:', e)
      alert('导出失败: ' + e.message)
    }
  }

  handleDragOverZone(e) {
    e.preventDefault()
    e.currentTarget.classList.add('drag-over')
  }

  handleDragLeaveZone(e) {
    e.currentTarget.classList.remove('drag-over')
  }

  async handleDropZone(e) {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over')
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length > 0) {
      await this.loadFiles(files)
    }
  }

  clearImages() {
    if (confirm('确定要清除所有图片吗？')) {
      this.images = []
      this.previewUrl = null
      this.requestUpdate()
    }
  }

  getImageSrc(img) {
    if (img.dataBase64) {
      return 'data:image/png;base64,' + img.dataBase64
    }
    return ''
  }

  render() {
    return html`
      <div class="app-container">
        <div class="sidebar">
          <div class="sidebar-section">
            <h2>📸 图片拼接工具</h2>
          </div>

          <div class="sidebar-section">
            <button class="btn btn-primary" @click=${this.handleAddImages}>
              + 添加图片
            </button>
            <button class="btn btn-secondary" @click=${this.clearImages} style="margin-top: 8px;">
              🗑️ 清除图片
            </button>
            <div class="drop-zone"
                 @dragover=${this.handleDragOverZone}
                 @dragleave=${this.handleDragLeaveZone}
                 @drop=${this.handleDropZone}>
              或拖拽图片到这里
            </div>
            <div class="image-count" style="margin-top: 12px;">
              已添加: ${this.images.length} 张图片
            </div>
          </div>

          ${this.images.length > 0 ? html`
            <div class="sidebar-section">
              <h3>图片列表</h3>
              <div class="image-list">
                ${this.images.map((img, idx) => html`
                  <div class="image-item"
                       draggable="true"
                       @dragstart=${(e) => this.handleDragStart(e, idx)}
                       @dragend=${this.handleDragEnd}
                       @dragover=${this.handleDragOver}
                       @drop=${(e) => this.handleDrop(e, idx)}>
                    <img src=${this.getImageSrc(img)} alt=${img.name}>
                    <button class="remove-btn" @click=${() => this.removeImage(idx)}>×</button>
                  </div>
                `)}
              </div>
              <div class="sort-buttons" style="margin-top: 8px;">
                <button class="sort-btn ${this.sortMode === 'time' ? 'active' : ''}"
                        @click=${() => this.sortImages('time')}>按时间</button>
                <button class="sort-btn ${this.sortMode === 'name' ? 'active' : ''}"
                        @click=${() => this.sortImages('name')}>按名称</button>
              </div>
            </div>
          ` : ''}

          <div class="sidebar-section">
            <h3>布局类型</h3>
            <div class="layout-options">
              <button class="layout-btn ${this.layoutType === 'grid' ? 'active' : ''}"
                      @click=${() => this.setLayoutType('grid')}>
                📐 网格
              </button>
              <button class="layout-btn ${this.layoutType === 'horizontal' ? 'active' : ''}"
                      @click=${() => this.setLayoutType('horizontal')}>
                ↔️ 横向
              </button>
              <button class="layout-btn ${this.layoutType === 'vertical' ? 'active' : ''}"
                      @click=${() => this.setLayoutType('vertical')}>
                ↕️ 纵向
              </button>
              <button class="layout-btn ${this.layoutType === 'poster' ? 'active' : ''}"
                      @click=${() => this.setLayoutType('poster')}>
                🎨 海报
              </button>
            </div>
          </div>

          ${this.layoutType === 'grid' ? html`
            <div class="sidebar-section">
              <h3>网格设置</h3>
              <div class="control-group">
                <label>列数</label>
                <input type="range" min="2" max="5" .value=${this.config.cols}
                       @input=${(e) => this.updateConfig('cols', parseInt(e.target.value))}>
                <div class="control-value">${this.config.cols} 列</div>
              </div>
              <div class="control-group">
                <label>行数</label>
                <input type="range" min="2" max="5" .value=${this.config.rows}
                       @input=${(e) => this.updateConfig('rows', parseInt(e.target.value))}>
                <div class="control-value">${this.config.rows} 行</div>
              </div>
            </div>
          ` : ''}

          <div class="sidebar-section">
            <h3>间距与边距</h3>
            <div class="control-group">
              <label>图片间距</label>
              <input type="range" min="0" max="50" .value=${this.config.spacing}
                     @input=${(e) => this.updateConfig('spacing', parseFloat(e.target.value))}>
              <div class="control-value">${this.config.spacing}px</div>
            </div>
            <div class="control-group">
              <label>外边距</label>
              <input type="range" min="0" max="100" .value=${this.config.padding}
                     @input=${(e) => this.updateConfig('padding', parseFloat(e.target.value))}>
              <div class="control-value">${this.config.padding}px</div>
            </div>
            <div class="control-group">
              <label>圆角</label>
              <input type="range" min="0" max="50" .value=${this.config.cornerRadius}
                     @input=${(e) => this.updateConfig('cornerRadius', parseFloat(e.target.value))}>
              <div class="control-value">${this.config.cornerRadius}px</div>
            </div>
          </div>

          <div class="sidebar-section">
            <h3>背景填充</h3>
            <div class="control-group">
              <select @change=${(e) => this.updateConfig('bgType', e.target.value)}>
                <option value="solid" ?selected=${this.config.bgType === 'solid'}>纯色</option>
                <option value="gradient" ?selected=${this.config.bgType === 'gradient'}>渐变</option>
                <option value="blur" ?selected=${this.config.bgType === 'blur'}>模糊背景</option>
                <option value="transparent" ?selected=${this.config.bgType === 'transparent'}>透明</option>
              </select>
            </div>
            ${this.config.bgType === 'solid' ? html`
              <div class="control-group">
                <label>背景颜色</label>
                <input type="color" .value=${this.config.bgSolidColor}
                       @input=${(e) => this.updateConfig('bgSolidColor', e.target.value)}>
              </div>
            ` : ''}
            ${this.config.bgType === 'gradient' ? html`
              <div class="control-group">
                <label>渐变起始色</label>
                <input type="color" .value=${this.config.bgGradientFrom}
                       @input=${(e) => this.updateConfig('bgGradientFrom', e.target.value)}>
              </div>
              <div class="control-group">
                <label>渐变结束色</label>
                <input type="color" .value=${this.config.bgGradientTo}
                       @input=${(e) => this.updateConfig('bgGradientTo', e.target.value)}>
              </div>
            ` : ''}
            ${this.config.bgType === 'blur' ? html`
              <div class="control-group">
                <label>模糊程度</label>
                <input type="range" min="0" max="30" .value=${this.config.bgBlur}
                       @input=${(e) => this.updateConfig('bgBlur', parseFloat(e.target.value))}>
                <div class="control-value">${this.config.bgBlur}</div>
              </div>
            ` : ''}
          </div>

          <div class="sidebar-section">
            <h3>比例适配</h3>
            <div class="control-group">
              <select @change=${(e) => this.updateConfig('fitType', e.target.value)}>
                <option value="crop" ?selected=${this.config.fitType === 'crop'}>裁切填充</option>
                <option value="fit" ?selected=${this.config.fitType === 'fit'}>自适应内容</option>
              </select>
            </div>
          </div>

          ${this.templates.length > 0 ? html`
            <div class="sidebar-section">
              <h3>海报模板</h3>
              <div class="template-grid">
                ${this.templates.map(t => html`
                  <div class="template-item ${this.selectedTemplate?.name === t.name ? 'active' : ''}"
                       @click=${() => this.selectTemplate(t)}>
                    <div class="template-preview">${t.name}</div>
                    <div class="template-name">${t.name}</div>
                  </div>
                `)}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="main-content">
          <div class="toolbar">
            <div class="toolbar-group">
              <input type="checkbox" .checked=${this.autoSize} @change=${(e) => { this.autoSize = e.target.checked; this.updatePreview() }}>
              <label>自适应尺寸</label>
            </div>
            <div class="toolbar-group">
              <label>宽度:</label>
              <input type="number" .value=${this.outputWidth}
                     @input=${(e) => { this.outputWidth = parseInt(e.target.value) || 1920; this.autoSize = false; this.updatePreview() }}>
            </div>
            <div class="toolbar-group">
              <label>高度:</label>
              <input type="number" .value=${this.outputHeight}
                     @input=${(e) => { this.outputHeight = parseInt(e.target.value) || 1080; this.autoSize = false; this.updatePreview() }}>
            </div>
            <div class="export-options">
              <select .value=${this.exportFormat} @change=${(e) => this.exportFormat = e.target.value}>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
              <button class="btn btn-primary" @click=${this.handleExport}>💾 导出图片</button>
            </div>
          </div>

          <div class="preview-area">
            ${this.loading ? html`
              <div class="loading-overlay">
                <div class="spinner"></div>
              </div>
            ` : ''}
            ${this.previewUrl ? html`
              <img src=${this.previewUrl} alt="Preview">
            ` : html`
              <div class="preview-placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                <div>点击"添加图片"开始拼接</div>
              </div>
            `}
          </div>
        </div>
      </div>
    `
  }
}

window.customElements.define('image-stitch-app', ImageStitchApp)
