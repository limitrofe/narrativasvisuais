// scripts/generate-frames.js - Gerador de Frames para ScrollyFrames
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// INSTALAÇÃO NECESSÁRIA:
// npm install fluent-ffmpeg
// 
// TAMBÉM PRECISA TER O FFMPEG INSTALADO NO SISTEMA:
// - Windows: https://ffmpeg.org/download.html
// - macOS: brew install ffmpeg  
// - Linux: sudo apt install ffmpeg

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gerador de frames para o componente ScrollyFrames
 */
export class ScrollyFrameGenerator {
  constructor(options = {}) {
    this.videosDir = options.videosDir || 'static/videos';
    this.outputBaseDir = options.outputBaseDir || 'static/img/frames';
    this.quality = options.quality || 65; // 🎯 OTIMIZADO: 85 é ideal para JPG
    this.maxWidth = options.maxWidth || 1920;
    this.maxHeight = options.maxHeight || 1080;
    this.format = options.format || 'jpg'; // jpg, webp, png, avif
    this.framePadding = options.framePadding || 4;
    
    // 🚀 CONFIGURAÇÕES DE PERFORMANCE POR FORMATO
    this.formatSettings = {
      // ✅ MELHOR PARA PERFORMANCE + QUALIDADE
      jpg: {
        quality: 65, // Sweet spot para JPG
        outputOptions: ['-q:v', '65'],
        extension: 'jpg',
        size: '~180KB', // Aproximado
        pros: 'Carregamento rápido, compatibilidade universal',
        cons: 'Sem transparência'
      },
      
      // 🏆 MELHOR COMPRESSÃO (50% menor que JPG)
      webp: {
        quality: 70, // WebP aguenta qualidade maior
        outputOptions: ['-c:v', 'libwebp', '-q:v', '70', '-method', '6'], 
        extension: 'webp',
        size: '~100KB', // 50% menor que JPG
        pros: 'Muito menor, qualidade excelente',
        cons: 'Suporte limitado em browsers antigos'
      },
      
      // 🎨 PARA TRANSPARÊNCIAS
      png: {
        quality: null, // PNG é lossless
        outputOptions: [],
        extension: 'png',
        size: '~500KB', // Muito maior
        pros: 'Transparência, lossless',
        cons: 'Arquivos grandes, carregamento lento'
      },
      
      // 🔮 FUTURO (experimental)
      avif: {
        quality: 50, // AVIF é muito eficiente
        outputOptions: ['-c:v', 'libaom-av1', '-crf', '30'],
        extension: 'avif',
        size: '~80KB', // Ainda menor que WebP
        pros: 'Compressão extrema, futuro da web',
        cons: 'Suporte muito limitado ainda'
      }
    };
  }

  /**
   * Gerar todos os frames de um vídeo (para ScrollyFrames)
   */
  async generateAllFrames(videoFileName, options = {}) {
    const videoPath = path.join(this.videosDir, videoFileName);
    const videoBaseName = path.parse(videoFileName).name;
    const outputDir = path.join(this.outputBaseDir, videoBaseName);
    
    // Opções específicas
    const totalFrames = options.totalFrames || 100;
    const startTime = options.startTime || 0;
    const endTime = options.endTime || null;
    
    console.log(`🎬 Processando vídeo: ${videoFileName}`);
    console.log(`📁 Pasta de saída: ${outputDir}`);
    
    // Verificar se o vídeo existe
    try {
      await fs.access(videoPath);
    } catch (error) {
      throw new Error(`Vídeo não encontrado: ${videoPath}`);
    }
    
    // Obter informações do vídeo
    const videoInfo = await this.getVideoInfo(videoPath);
    console.log(`📊 Duração: ${videoInfo.duration}s | Dimensões: ${videoInfo.width}x${videoInfo.height}`);
    
    // Calcular tempos dos frames
    const duration = endTime || videoInfo.duration;
    const timeStep = (duration - startTime) / (totalFrames - 1);
    const times = [];
    
    for (let i = 0; i < totalFrames; i++) {
      times.push(startTime + (i * timeStep));
    }
    
    // Criar diretório de saída
    await fs.mkdir(outputDir, { recursive: true });
    
    // Gerar frames
    console.log(`📸 Gerando ${totalFrames} frames...`);
    const results = [];
    
    for (let i = 0; i < times.length; i++) {
      const time = times[i];
      const frameNumber = i + 1;
      const filename = `frame_${String(frameNumber).padStart(this.framePadding, '0')}.${this.format}`;
      const outputPath = path.join(outputDir, filename);
      
      try {
        console.log(`📸 Frame ${frameNumber}/${totalFrames} (${time.toFixed(2)}s)`);
        
        await this.extractFrame(videoPath, time, outputPath);
        
        results.push({
          frameNumber,
          time,
          filename,
          path: outputPath,
          url: `/img/frames/${videoBaseName}/${filename}`
        });
        
      } catch (error) {
        console.error(`❌ Erro no frame ${frameNumber}:`, error.message);
        // Continuar mesmo se um frame falhar
      }
    }
    
    // Gerar arquivo de configuração para o ScrollyFrames
    const configPath = path.join(outputDir, 'config.json');
    const config = {
      videoFile: videoFileName,
      videoBaseName,
      totalFrames: results.length,
      actualDuration: videoInfo.duration,
      extractedDuration: duration - startTime,
      startTime,
      endTime: endTime || videoInfo.duration,
      framePrefix: `/img/frames/${videoBaseName}/frame_`,
      frameExtension: `.${this.format}`,
      framePadding: this.framePadding,
      generatedAt: new Date().toISOString(),
      scrollyFramesProps: {
        framePrefix: `/img/frames/${videoBaseName}/frame_`,
        totalFrames: results.length,
        frameExtension: `.${this.format}`,
        framePadding: this.framePadding,
        startFrame: 1,
        endFrame: results.length
      }
    };
    
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    
    console.log(`✅ Gerados ${results.length} frames para ${videoFileName}`);
    console.log(`📄 Configuração salva em: config.json`);
    console.log(`\n🎯 Use no ScrollyFrames:`);
    console.log(`<ScrollyFrames`);
    console.log(`  framePrefix="/img/frames/${videoBaseName}/frame_"`);
    console.log(`  totalFrames={${results.length}}`);
    console.log(`  frameExtension=".${this.format}"`);
    console.log(`  framePadding={${this.framePadding}}`);
    console.log(`  height="400vh"`);
    console.log(`/>`);
    
    return {
      config,
      frames: results,
      outputDir
    };
  }

  /**
   * Extrair um frame específico do vídeo
   */
  async extractFrame(videoPath, timeInSeconds, outputPath) {
    const formatConfig = this.formatSettings[this.format] || this.formatSettings.jpg;
    
    return new Promise((resolve, reject) => {
      const ffmpegCmd = ffmpeg(videoPath)
        .seekInput(timeInSeconds)
        .frames(1)
        .size(`${this.maxWidth}x${this.maxHeight}`)
        .outputFormat('image2');
      
      // 🎯 APLICAR CONFIGURAÇÕES ESPECÍFICAS DO FORMATO
      if (formatConfig.outputOptions && formatConfig.outputOptions.length > 0) {
        ffmpegCmd.outputOptions(formatConfig.outputOptions);
      }
      
      // Para JPG/WebP, adicionar qualidade
      if (formatConfig.quality && ['jpg', 'jpeg', 'webp'].includes(this.format)) {
        if (!formatConfig.outputOptions.includes('-q:v')) {
          ffmpegCmd.outputOptions(['-q:v', formatConfig.quality.toString()]);
        }
      }
      
      ffmpegCmd
        .output(outputPath)
        .on('end', () => {
          resolve(outputPath);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        })
        .run();
    });
  }

  /**
   * Obter informações do vídeo
   */
  async getVideoInfo(videoPath) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(videoPath, (err, metadata) => {
        if (err) {
          reject(new Error(`FFprobe error: ${err.message}`));
          return;
        }

        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        if (!videoStream) {
          reject(new Error('No video stream found'));
          return;
        }

        resolve({
          duration: parseFloat(metadata.format.duration),
          width: videoStream.width,
          height: videoStream.height,
          fps: eval(videoStream.r_frame_rate), // "30/1" → 30
          codec: videoStream.codec_name,
          bitrate: parseInt(metadata.format.bit_rate),
          size: parseInt(metadata.format.size)
        });
      });
    });
  }

  /**
   * Listar todos os vídeos disponíveis
   */
  async listVideos() {
    try {
      const files = await fs.readdir(this.videosDir);
      const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
      
      const videos = files.filter(file => {
        // Ignorar arquivos do sistema
        if (file.startsWith('.')) return false;
        
        const ext = path.extname(file).toLowerCase();
        return videoExtensions.includes(ext);
      });
      
      return videos;
    } catch (error) {
      console.error('Erro ao listar vídeos:', error.message);
      return [];
    }
  }

  /**
   * Processar múltiplos vídeos
   */
  async processMultipleVideos(videoList, options = {}) {
    const results = [];
    
    for (const videoConfig of videoList) {
      try {
        const result = await this.generateAllFrames(videoConfig.file, videoConfig.options);
        results.push({
          video: videoConfig.file,
          success: true,
          result
        });
      } catch (error) {
        console.error(`❌ Erro ao processar ${videoConfig.file}:`, error.message);
        results.push({
          video: videoConfig.file,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  /**
   * Limpar frames antigos
   */
  async cleanFrames(videoBaseName = null) {
    try {
      if (videoBaseName) {
        // Limpar frames de um vídeo específico
        const targetDir = path.join(this.outputBaseDir, videoBaseName);
        await fs.rm(targetDir, { recursive: true, force: true });
        console.log(`🧹 Frames removidos: ${videoBaseName}`);
      } else {
        // Limpar todos os frames
        await fs.rm(this.outputBaseDir, { recursive: true, force: true });
        console.log(`🧹 Todos os frames foram removidos`);
      }
    } catch (error) {
      console.warn('⚠️ Erro ao limpar frames:', error.message);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
🎬 Gerador de Frames para ScrollyFrames

ESTRUTURA DO PROJETO:
  static/
    videos/           ← Coloque seus vídeos aqui
      meu-video.mp4
      outro-video.mov
    img/
      frames/         ← Frames serão gerados aqui
        meu-video/
          frame_0001.jpg
          frame_0002.jpg
          ...
          config.json

USO:
  node generate-frames.js <comando> [opções]

COMANDOS:
  list                     - Listar vídeos disponíveis
  generate <video.mp4>     - Gerar frames de um vídeo
  generate-all             - Gerar frames de todos os vídeos
  clean [video-name]       - Limpar frames (específico ou todos)
  formats                  - Mostrar formatos disponíveis e performance

OPÇÕES:
  --frames <number>        - Número de frames (padrão: 100)
  --start <seconds>        - Tempo inicial (padrão: 0)
  --end <seconds>          - Tempo final (padrão: duração total)
  --quality <0-100>        - Qualidade (padrão: 85)
  --format <jpg|webp|png>  - Formato das imagens (padrão: jpg)
  --width <pixels>         - Largura máxima (padrão: 1920)
  --height <pixels>        - Altura máxima (padrão: 1080)

⚡ FORMATOS PARA PERFORMANCE:
  --format jpg             - Melhor balanceamento (padrão)
  --format webp            - 50% menor, navegadores modernos
  --format png             - Para transparências (muito maior)

EXEMPLOS:
  node generate-frames.js formats
  node generate-frames.js list
  node generate-frames.js generate meu-video.mp4
  node generate-frames.js generate meu-video.mp4 --format webp --quality 90
  node generate-frames.js generate meu-video.mp4 --frames 200 --start 10 --end 60
  node generate-frames.js generate-all --format webp
  node generate-frames.js clean
  node generate-frames.js clean meu-video
    `);
    process.exit(1);
  }
  
  try {
    const generator = new ScrollyFrameGenerator();
    const command = args[0];
    
    switch (command) {
      case 'formats': {
        console.log('🎨 FORMATOS SUPORTADOS E PERFORMANCE:\n');
        
        Object.entries(generator.formatSettings).forEach(([format, config]) => {
          console.log(`📊 ${format.toUpperCase()}:`);
          console.log(`   Tamanho médio: ${config.size}`);
          console.log(`   Vantagens: ${config.pros}`);
          console.log(`   Desvantagens: ${config.cons}`);
          console.log('');
        });
        
        console.log('🏆 RECOMENDAÇÕES:');
        console.log('   • JPG: Use como padrão (melhor balanceamento)');
        console.log('   • WebP: Use se quiser 50% menos tamanho');
        console.log('   • PNG: Use apenas se precisar de transparência');
        console.log('   • AVIF: Experimental, não use ainda');
        console.log('\n💡 EXEMPLOS:');
        console.log('   node generate-frames.js generate video.mp4 --format webp');
        console.log('   node generate-frames.js generate-all --format jpg --quality 85');
        break;
      }
      
      case 'list': {
        console.log('📁 Vídeos disponíveis em static/videos/:');
        const videos = await generator.listVideos();
        if (videos.length === 0) {
          console.log('  (nenhum vídeo encontrado)');
        } else {
          videos.forEach(video => console.log(`  • ${video}`));
        }
        break;
      }
      
      case 'generate': {
        if (args.length < 2) {
          throw new Error('Especifique o arquivo de vídeo: generate <video.mp4>');
        }
        
        const videoFile = args[1];
        const options = {};
        
        // Parse das opções
        for (let i = 2; i < args.length; i += 2) {
          const flag = args[i];
          const value = args[i + 1];
          
          switch (flag) {
            case '--frames':
              options.totalFrames = parseInt(value);
              break;
            case '--start':
              options.startTime = parseFloat(value);
              break;
            case '--end':
              options.endTime = parseFloat(value);
              break;
            case '--quality':
              generator.quality = parseInt(value);
              break;
            case '--format':
              generator.format = value;
              break;
          }
        }
        
        await generator.generateAllFrames(videoFile, options);
        break;
      }
      
      case 'generate-all': {
        console.log('🚀 Processando todos os vídeos...');
        const videos = await generator.listVideos();
        const videoConfigs = videos.map(file => ({ file, options: {} }));
        const results = await generator.processMultipleVideos(videoConfigs);
        
        const successful = results.filter(r => r.success).length;
        console.log(`\n✅ Processados ${successful}/${results.length} vídeos com sucesso`);
        break;
      }
      
      case 'clean': {
        const videoName = args[1] || null;
        await generator.cleanFrames(videoName);
        break;
      }
      
      default:
        throw new Error(`Comando desconhecido: ${command}`);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}