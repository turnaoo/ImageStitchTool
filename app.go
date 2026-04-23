package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/disintegration/imaging"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type ImageInfo struct {
	Path       string `json:"path"`
	Name       string `json:"name"`
	Width      int    `json:"width"`
	Height     int    `json:"height"`
	Timestamp  int64  `json:"timestamp"`
	Data       []byte `json:"data,omitempty"`
	DataBase64 string `json:"dataBase64,omitempty"`
}

type LayoutConfig struct {
	Type           string  `json:"type"`
	Cols           int     `json:"cols"`
	Rows           int     `json:"rows"`
	Spacing        float64 `json:"spacing"`
	Padding        float64 `json:"padding"`
	CornerRadius   float64 `json:"cornerRadius"`
	BGType         string  `json:"bgType"`
	BGSolidColor   string  `json:"bgSolidColor"`
	BGGradientFrom string  `json:"bgGradientFrom"`
	BGGradientTo   string  `json:"bgGradientTo"`
	BGBlur         float64 `json:"bgBlur"`
	FitType        string  `json:"fitType"`
}

type PosterTemplate struct {
	Name      string       `json:"name"`
	Layout    LayoutConfig `json:"layout"`
	Positions []Position   `json:"positions"`
}

type Position struct {
	X      float64 `json:"x"`
	Y      float64 `json:"y"`
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

var defaultTemplates = []PosterTemplate{
	{
		Name: "海报模板1",
		Layout: LayoutConfig{
			Type:         "poster",
			Cols:         1,
			Rows:         1,
			Spacing:      10,
			Padding:      20,
			CornerRadius: 0,
			BGType:       "solid",
			BGSolidColor: "#FFFFFF",
			FitType:      "crop",
		},
		Positions: []Position{
			{X: 0.1, Y: 0.05, Width: 0.8, Height: 0.6},
			{X: 0.1, Y: 0.7, Width: 0.35, Height: 0.25},
			{X: 0.55, Y: 0.7, Width: 0.35, Height: 0.25},
		},
	},
	{
		Name: "海报模板2",
		Layout: LayoutConfig{
			Type:           "poster",
			Cols:           1,
			Rows:           1,
			Spacing:        10,
			Padding:        20,
			CornerRadius:   0,
			BGType:         "gradient",
			BGSolidColor:   "#1a1a2e",
			BGGradientFrom: "#16213e",
			BGGradientTo:   "#0f3460",
			FitType:        "fit",
		},
		Positions: []Position{
			{X: 0.05, Y: 0.05, Width: 0.9, Height: 0.5},
			{X: 0.05, Y: 0.58, Width: 0.43, Height: 0.37},
			{X: 0.52, Y: 0.58, Width: 0.43, Height: 0.37},
		},
	},
}

func (a *App) GetTemplates() []PosterTemplate {
	return defaultTemplates
}

func (a *App) LoadImages(files []string) ([]ImageInfo, error) {
	var images []ImageInfo
	for _, file := range files {
		info, err := loadImageInfo(file)
		if err != nil {
			continue
		}
		images = append(images, info)
	}
	sort.Slice(images, func(i, j int) bool {
		return images[i].Timestamp < images[j].Timestamp
	})
	return images, nil
}

func loadImageInfo(path string) (ImageInfo, error) {
	file, err := os.Open(path)
	if err != nil {
		return ImageInfo{}, err
	}
	defer file.Close()

	img, format, err := image.Decode(file)
	if err != nil {
		return ImageInfo{}, err
	}

	bounds := img.Bounds()
	stat, _ := os.Stat(path)

	var data []byte
	if format == "jpeg" {
		file.Seek(0, 0)
		data, _ = io.ReadAll(file)
	} else if format == "png" {
		file.Seek(0, 0)
		data, _ = io.ReadAll(file)
	}

	return ImageInfo{
		Path:      path,
		Name:      filepath.Base(path),
		Width:     bounds.Dx(),
		Height:    bounds.Dy(),
		Timestamp: stat.ModTime().Unix(),
		Data:      data,
	}, nil
}

func (a *App) StitchImages(images []ImageInfo, config LayoutConfig, outputWidth, outputHeight int) ([]byte, error) {
	if len(images) == 0 {
		return nil, fmt.Errorf("no images provided")
	}

	spacing := config.Spacing
	padding := config.Padding

	var canvas *image.NRGBA
	bg := parseColor(config.BGSolidColor)

	switch config.BGType {
	case "gradient":
		gradientFrom := parseColor(config.BGGradientFrom)
		gradientTo := parseColor(config.BGGradientTo)
		canvas = imaging.New(outputWidth, outputHeight, bg)
		canvas = fillGradient(canvas, gradientFrom, gradientTo)
	case "blur":
		canvas = imaging.New(outputWidth, outputHeight, bg)
		if len(images) > 0 {
			data, _ := getImageData(images[0])
			if data != nil {
				blurImg, _, _ := image.Decode(bytes.NewReader(data))
				blurred := imaging.Blur(blurImg, config.BGBlur)
				blurred = imaging.Resize(blurred, outputWidth, outputHeight, imaging.Lanczos)
				canvas = imaging.Paste(canvas, blurred, image.Point{0, 0})
			}
		}
	case "transparent":
		canvas = imaging.New(outputWidth, outputHeight, color.Transparent)
	default:
		canvas = imaging.New(outputWidth, outputHeight, bg)
	}

	positions := calculatePositions(config, len(images), outputWidth, outputHeight, spacing, padding)

	for i, pos := range positions {
		if i >= len(images) {
			break
		}

		data, err := getImageData(images[i])
		if err != nil {
			continue
		}
		img, _, err := image.Decode(bytes.NewReader(data))
		if err != nil {
			continue
		}

		var processedImg image.Image
		switch config.FitType {
		case "crop":
			processedImg = imaging.Fill(img, int(pos.Width), int(pos.Height), imaging.Center, imaging.Lanczos)
		case "fit":
			processedImg = imaging.Fit(img, int(pos.Width), int(pos.Height), imaging.Lanczos)
		default:
			processedImg = imaging.Fill(img, int(pos.Width), int(pos.Height), imaging.Center, imaging.Lanczos)
		}

		if config.CornerRadius > 0 {
			processedImg = applyRoundCorner(processedImg, config.CornerRadius)
		}

		canvas = imaging.Paste(canvas, processedImg, image.Point{X: int(pos.X), Y: int(pos.Y)})
	}

	var buf bytes.Buffer
	err := png.Encode(&buf, canvas)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (a *App) StitchGridImages(images []ImageInfo, config LayoutConfig, outputWidth, outputHeight int) ([]byte, error) {
	if len(images) == 0 {
		return nil, fmt.Errorf("no images provided")
	}

	cols := config.Cols
	if cols <= 0 {
		cols = 2
	}
	rows := config.Rows
	if rows <= 0 {
		rows = (len(images) + cols - 1) / cols
	}

	spacing := config.Spacing
	padding := config.Padding

	totalWidth := outputWidth
	totalHeight := outputHeight

	cellWidth := float64(totalWidth) - padding*2 - float64(cols-1)*spacing
	cellHeight := float64(totalHeight) - padding*2 - float64(rows-1)*spacing

	bg := parseColor(config.BGSolidColor)
	var canvas *image.NRGBA

	switch config.BGType {
	case "gradient":
		gradientFrom := parseColor(config.BGGradientFrom)
		gradientTo := parseColor(config.BGGradientTo)
		canvas = imaging.New(totalWidth, totalHeight, bg)
		canvas = fillGradient(canvas, gradientFrom, gradientTo)
	case "blur":
		canvas = imaging.New(totalWidth, totalHeight, bg)
		if len(images) > 0 {
			data, _ := getImageData(images[0])
			if data != nil {
				blurImg, _, _ := image.Decode(bytes.NewReader(data))
				blurred := imaging.Blur(blurImg, config.BGBlur)
				blurred = imaging.Resize(blurred, totalWidth, totalHeight, imaging.Lanczos)
				canvas = imaging.Paste(canvas, blurred, image.Point{0, 0})
			}
		}
	case "transparent":
		canvas = imaging.New(totalWidth, totalHeight, color.Transparent)
	default:
		canvas = imaging.New(totalWidth, totalHeight, bg)
	}

	for i, imgInfo := range images {
		if i >= cols*rows {
			break
		}

		col := i % cols
		row := i / cols

		x := padding + float64(col)*(cellWidth+spacing)
		y := padding + float64(row)*(cellHeight+spacing)

		img, _, err := image.Decode(bytes.NewReader(imgInfo.Data))
		if err != nil {
			continue
		}

		var processedImg image.Image
		switch config.FitType {
		case "crop":
			processedImg = imaging.Fill(img, int(cellWidth), int(cellHeight), imaging.Center, imaging.Lanczos)
		case "fit":
			processedImg = imaging.Fit(img, int(cellWidth), int(cellHeight), imaging.Lanczos)
		default:
			processedImg = imaging.Fill(img, int(cellWidth), int(cellHeight), imaging.Center, imaging.Lanczos)
		}

		if config.CornerRadius > 0 {
			processedImg = applyRoundCorner(processedImg, config.CornerRadius)
		}

		canvas = imaging.Paste(canvas, processedImg, image.Point{X: int(x), Y: int(y)})
	}

	var buf bytes.Buffer
	err := png.Encode(&buf, canvas)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (a *App) StitchPosterImage(images []ImageInfo, template PosterTemplate, outputWidth, outputHeight int) ([]byte, error) {
	if len(images) == 0 {
		return nil, fmt.Errorf("no images provided")
	}

	config := template.Layout
	bg := parseColor(config.BGSolidColor)
	var canvas *image.NRGBA

	switch config.BGType {
	case "gradient":
		gradientFrom := parseColor(config.BGGradientFrom)
		gradientTo := parseColor(config.BGGradientTo)
		canvas = imaging.New(outputWidth, outputHeight, bg)
		canvas = fillGradient(canvas, gradientFrom, gradientTo)
	case "blur":
		canvas = imaging.New(outputWidth, outputHeight, bg)
		if len(images) > 0 {
			data, _ := getImageData(images[0])
			if data != nil {
				blurImg, _, err := image.Decode(bytes.NewReader(data))
				if err == nil {
					blurred := imaging.Blur(blurImg, config.BGBlur)
					blurred = imaging.Resize(blurred, outputWidth, outputHeight, imaging.Lanczos)
					canvas = imaging.Paste(canvas, blurred, image.Point{0, 0})
				}
			}
		}
	case "transparent":
		canvas = imaging.New(outputWidth, outputHeight, color.Transparent)
	default:
		canvas = imaging.New(outputWidth, outputHeight, bg)
	}

	for i, pos := range template.Positions {
		if i >= len(images) {
			break
		}

		x := pos.X * float64(outputWidth)
		y := pos.Y * float64(outputHeight)
		w := pos.Width * float64(outputWidth)
		h := pos.Height * float64(outputHeight)

		data, err := getImageData(images[i])
		if err != nil {
			continue
		}
		img, _, err := image.Decode(bytes.NewReader(data))
		if err != nil {
			continue
		}

		var processedImg image.Image
		switch config.FitType {
		case "crop":
			processedImg = imaging.Fill(img, int(w), int(h), imaging.Center, imaging.Lanczos)
		case "fit":
			processedImg = imaging.Fit(img, int(w), int(h), imaging.Lanczos)
		default:
			processedImg = imaging.Fill(img, int(w), int(h), imaging.Center, imaging.Lanczos)
		}

		if config.CornerRadius > 0 {
			processedImg = applyRoundCorner(processedImg, config.CornerRadius)
		}

		canvas = imaging.Paste(canvas, processedImg, image.Point{X: int(x), Y: int(y)})
	}

	var buf bytes.Buffer
	err := png.Encode(&buf, canvas)
	if err != nil {
		return nil, err
	}
	return buf.Bytes(), nil
}

func (a *App) SaveImage(data []byte, path string) error {
	return os.WriteFile(path, data, 0644)
}

func calculatePositions(config LayoutConfig, imageCount, width, height int, spacing, padding float64) []Position {
	var positions []Position

	switch config.Type {
	case "horizontal":
		cols := imageCount
		cellWidth := (float64(width) - padding*2 - float64(cols-1)*spacing) / float64(cols)
		cellHeight := float64(height) - padding*2
		for i := 0; i < imageCount; i++ {
			x := padding + float64(i)*(cellWidth+spacing)
			y := padding
			positions = append(positions, Position{X: x, Y: y, Width: cellWidth, Height: cellHeight})
		}
	case "vertical":
		rows := imageCount
		cellWidth := float64(width) - padding*2
		cellHeight := (float64(height) - padding*2 - float64(rows-1)*spacing) / float64(rows)
		for i := 0; i < imageCount; i++ {
			x := padding
			y := padding + float64(i)*(cellHeight+spacing)
			positions = append(positions, Position{X: x, Y: y, Width: cellWidth, Height: cellHeight})
		}
	case "free":
		cols := 2
		if imageCount <= 4 {
			cols = imageCount
		}
		rows := (imageCount + cols - 1) / cols
		cellWidth := (float64(width) - padding*2 - float64(cols-1)*spacing) / float64(cols)
		cellHeight := (float64(height) - padding*2 - float64(rows-1)*spacing) / float64(rows)
		for i := 0; i < imageCount; i++ {
			col := i % cols
			row := i / cols
			x := padding + float64(col)*(cellWidth+spacing)
			y := padding + float64(row)*(cellHeight+spacing)
			positions = append(positions, Position{X: x, Y: y, Width: cellWidth, Height: cellHeight})
		}
	default:
		cols := config.Cols
		if cols <= 0 {
			cols = 2
		}
		rows := config.Rows
		if rows <= 0 {
			rows = (imageCount + cols - 1) / cols
		}
		cellWidth := (float64(width) - padding*2 - float64(cols-1)*spacing) / float64(cols)
		cellHeight := (float64(height) - padding*2 - float64(rows-1)*spacing) / float64(rows)
		for i := 0; i < imageCount; i++ {
			col := i % cols
			row := i / cols
			x := padding + float64(col)*(cellWidth+spacing)
			y := padding + float64(row)*(cellHeight+spacing)
			positions = append(positions, Position{X: x, Y: y, Width: cellWidth, Height: cellHeight})
		}
	}

	return positions
}

func parseColor(hex string) color.NRGBA {
	hex = strings.TrimPrefix(hex, "#")
	if len(hex) == 6 {
		var r, g, b uint8
		fmt.Sscanf(hex, "%02x%02x%02x", &r, &g, &b)
		return color.NRGBA{R: r, G: g, B: b, A: 255}
	}
	return color.NRGBA{R: 255, G: 255, B: 255, A: 255}
}

func getImageData(imgInfo ImageInfo) ([]byte, error) {
	if len(imgInfo.Data) > 0 {
		return imgInfo.Data, nil
	}
	if imgInfo.DataBase64 != "" {
		return base64.StdEncoding.DecodeString(imgInfo.DataBase64)
	}
	return nil, fmt.Errorf("no image data available")
}

func fillGradient(img *image.NRGBA, from, to color.NRGBA) *image.NRGBA {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	result := imaging.New(width, height, color.Transparent)
	for y := 0; y < height; y++ {
		ratio := float64(y) / float64(height)
		r := uint8(float64(from.R)*(1-ratio) + float64(to.R)*ratio)
		g := uint8(float64(from.G)*(1-ratio) + float64(to.G)*ratio)
		b := uint8(float64(from.B)*(1-ratio) + float64(to.B)*ratio)
		for x := 0; x < width; x++ {
			result.Set(x, y, color.NRGBA{R: r, G: g, B: b, A: 255})
		}
	}
	return result
}

func applyRoundCorner(img image.Image, radius float64) *image.NRGBA {
	bounds := img.Bounds()
	w, h := bounds.Dx(), bounds.Dy()
	mask := imaging.New(w, h, color.White)

	for y := 0; y < h; y++ {
		for x := 0; x < w; x++ {
			inCorner := false
			if radius > 0 {
				if x < int(radius) && y < int(radius) {
					dx, dy := int(radius)-x, int(radius)-y
					if dx*dx+dy*dy > int(radius*radius) {
						inCorner = true
					}
				} else if x >= w-int(radius) && y < int(radius) {
					dx, dy := x-(w-int(radius)), int(radius)-y
					if dx*dx+dy*dy > int(radius*radius) {
						inCorner = true
					}
				} else if x < int(radius) && y >= h-int(radius) {
					dx, dy := int(radius)-x, y-(h-int(radius))
					if dx*dx+dy*dy > int(radius*radius) {
						inCorner = true
					}
				} else if x >= w-int(radius) && y >= h-int(radius) {
					dx, dy := x-(w-int(radius)), y-(h-int(radius))
					if dx*dx+dy*dy > int(radius*radius) {
						inCorner = true
					}
				}
			}
			if inCorner {
				mask.Set(x, y, color.Transparent)
			}
		}
	}

	return imaging.OverlayCenter(img, mask, 100)
}

func (a *App) GetImageDimensions(data []byte) (int, int, error) {
	cfg, _, err := image.DecodeConfig(bytes.NewReader(data))
	if err != nil {
		return 0, 0, err
	}
	return cfg.Width, cfg.Height, nil
}

func (a *App) SaveFileDialog(defaultName string) (string, error) {
	options := runtime.SaveDialogOptions{
		DefaultFilename: defaultName,
	}
	return runtime.SaveFileDialog(a.ctx, options)
}

func (a *App) ExportImage(base64Data string, path string, format string) error {
	data, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return err
	}
	switch strings.ToLower(format) {
	case "png":
		return os.WriteFile(path, data, 0644)
	case "jpg", "jpeg":
		img, _, err := image.Decode(bytes.NewReader(data))
		if err != nil {
			return err
		}
		f, err := os.Create(path)
		if err != nil {
			return err
		}
		defer f.Close()
		return jpeg.Encode(f, img, &jpeg.Options{Quality: 95})
	default:
		return os.WriteFile(path, data, 0644)
	}
}

func (a *App) SortImagesByName(images []ImageInfo) []ImageInfo {
	sorted := make([]ImageInfo, len(images))
	copy(sorted, images)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Name < sorted[j].Name
	})
	return sorted
}

func (a *App) SortImagesByTime(images []ImageInfo) []ImageInfo {
	sorted := make([]ImageInfo, len(images))
	copy(sorted, images)
	sort.Slice(sorted, func(i, j int) bool {
		return sorted[i].Timestamp < sorted[j].Timestamp
	})
	return sorted
}

func (a *App) ReorderImages(images []ImageInfo, order []int) []ImageInfo {
	if len(order) != len(images) {
		return images
	}
	reordered := make([]ImageInfo, len(images))
	for i, idx := range order {
		if idx >= 0 && idx < len(images) {
			reordered[i] = images[idx]
		}
	}
	return reordered
}
