// scripts/generate-frames-debug.js - Versão com debug detalhado
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando debug do gerador de frames...');
console.log('📁 Diretório atual:', process.cwd());

// Testar se FFmpeg está disponível
function testFFmpeg() {
  return new Promise((resolve) => {
    ffmpeg.getAvailableFormats((err, formats) => {
      if (err) {
        console.error('❌ FFmpeg não encontrado:', err.message);
        console.log('💡 Instale o FFmpeg:');
        console.log('   Windows: https://ffmpeg.org/download.html');
        console.log('   macOS: brew install ffmpeg');
        console.log('   Linux: sudo apt install ffmpeg');
        resolve(false);
      } else {
        console.log('✅ FFmpeg encontrado e funcionando');
        resolve(true);
      }
    });
  });
}

// Testar estrutura de pastas
async function testFolderStructure() {
  console.log('\n📂 Testando estrutura de pastas...');
  
  const videosDir = 'static/videos';
  const outputDir = 'static/img/frames';
  
  try {
    // Verificar pasta de vídeos
    const allFiles = await fs.readdir(videosDir);
    console.log(`✅ Pasta ${videosDir} encontrada`);
    console.log('📁 Todos os arquivos:', allFiles);
    
    // Filtrar apenas arquivos de vídeo válidos
    const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm', '.m4v'];
    const videoFiles = allFiles.filter(file => {
      const ext = path.extname(file).toLowerCase();
      const isVideo = videoExtensions.includes(ext);
      if (!isVideo && file !== '.DS_Store') {
        console.log(`⚠️ Arquivo ignorado (não é vídeo): ${file}`);
      }
      return isVideo;
    });
    
    console.log('📹 Vídeos válidos encontrados:', videoFiles);
    
    // Criar pasta de output se não existir
    await fs.mkdir(outputDir, { recursive: true });
    console.log(`✅ Pasta ${outputDir} criada/verificada`);
    
    return { videosDir, outputDir, videoFiles };
  } catch (error) {
    console.error('❌ Erro na estrutura de pastas:', error.message);
    return null;
  }
}

// Testar informações de um vídeo
async function testVideoInfo(videoPath) {
  console.log(`\n🎬 Testando informações do vídeo: ${videoPath}`);
  
  return new Promise((resolve) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error('❌ Erro ao analisar vídeo:', err.message);
        resolve(null);
      } else {
        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
        if (!videoStream) {
          console.error('❌ Stream de vídeo não encontrado');
          resolve(null);
        } else {
          const info = {
            duration: parseFloat(metadata.format.duration),
            width: videoStream.width,
            height: videoStream.height,
            fps: eval(videoStream.r_frame_rate),
            codec: videoStream.codec_name,
            size: parseInt(metadata.format.size)
          };
          
          console.log('✅ Informações do vídeo:');
          console.log(`   Duração: ${info.duration}s`);
          console.log(`   Dimensões: ${info.width}x${info.height}`);
          console.log(`   FPS: ${info.fps}`);
          console.log(`   Codec: ${info.codec}`);
          console.log(`   Tamanho: ${(info.size / 1024 / 1024).toFixed(2)} MB`);
          
          resolve(info);
        }
      }
    });
  });
}

// Testar extração de um único frame
async function testSingleFrame(videoPath, outputPath) {
  console.log(`\n🖼️ Testando extração de frame...`);
  console.log(`   Input: ${videoPath}`);
  console.log(`   Output: ${outputPath}`);
  
  return new Promise((resolve) => {
    ffmpeg(videoPath)
      .seekInput(2) // 2 segundos
      .frames(1)
      .size('1920x1080')
      .outputFormat('image2')
      .outputOptions(['-q:v', '80', '-update', '1'])
      .output(outputPath)
      .on('start', (cmd) => {
        console.log('🚀 Comando FFmpeg:', cmd);
      })
      .on('progress', (progress) => {
        console.log('📊 Progresso:', progress.percent + '%');
      })
      .on('end', () => {
        console.log('✅ Frame extraído com sucesso!');
        resolve(true);
      })
      .on('error', (err) => {
        console.error('❌ Erro na extração:', err.message);
        resolve(false);
      })
      .run();
  });
}

// Função principal de debug
async function debugMain() {
  console.log('🔍 === DIAGNÓSTICO COMPLETO ===\n');
  
  // 1. Testar FFmpeg
  const ffmpegOk = await testFFmpeg();
  if (!ffmpegOk) {
    console.log('\n❌ Pare aqui! Instale o FFmpeg primeiro.');
    return;
  }
  
  // 2. Testar estrutura de pastas
  const structure = await testFolderStructure();
  if (!structure) {
    console.log('\n❌ Problemas na estrutura de pastas.');
    return;
  }
  
  if (structure.videoFiles.length === 0) {
    console.log('\n⚠️ Nenhum vídeo encontrado em static/videos/');
    console.log('📁 Coloque seus vídeos na pasta static/videos/');
    return;
  }
  
  // 3. Testar primeiro vídeo encontrado
  const firstVideo = structure.videoFiles[0];
  const videoPath = path.join(structure.videosDir, firstVideo);
  
  const videoInfo = await testVideoInfo(videoPath);
  if (!videoInfo) {
    console.log(`\n❌ Não foi possível analisar o vídeo: ${firstVideo}`);
    return;
  }
  
  // 4. Testar extração de um frame
  const testOutputDir = path.join(structure.outputDir, 'test');
  await fs.mkdir(testOutputDir, { recursive: true });
  const testFramePath = path.join(testOutputDir, 'test_frame.jpg');
  
  const frameOk = await testSingleFrame(videoPath, testFramePath);
  if (!frameOk) {
    console.log('\n❌ Falha na extração de frame.');
    return;
  }
  
  // 5. Verificar se o frame foi criado
  try {
    const stats = await fs.stat(testFramePath);
    console.log(`✅ Frame criado: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`📁 Localização: ${testFramePath}`);
  } catch (error) {
    console.error('❌ Frame não foi criado:', error.message);
  }
  
  console.log('\n🎉 DIAGNÓSTICO CONCLUÍDO!');
  console.log('\nSe tudo passou, o problema pode ser:');
  console.log('1. Caminho do vídeo incorreto');
  console.log('2. Vídeo corrompido');
  console.log('3. Permissões de escrita');
  console.log('\nTente novamente com: node scripts/generate-frames.js generate parte1.mp4');
}

// Executar debug
debugMain().catch(console.error);