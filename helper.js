function createAudioHTML(path) {
  return '<audio controls controlslist="nodownload" class="px-1"> <source src=' +
      path +
      ' type="audio/wav">Your browser does not support the audio element.</audio>';
}

function createVideoHTML(path) {  
  return '<video controls class="px-1" width="280" height="210"> <source src="' +  
      path +  
      '" type="video/mp4">Your browser does not support the video tag.</video>';  
}
function createImageHTML(path) {  
  return '<img src="' + path + '" alt="Image" class="px-1" style="max-width: 100%; height: auto;">';  
}
// function generateExampleRowNewVideo(table_row, base_path, filename_ext, models, col_offset) {
//   let p = base_path + models[0] + '/' + filename_ext + '.mp4';  
//   let cell = table_row.cells[col_offset + 0]; 
//   cell.innerHTML = cell.innerHTML + createVideoHTML(p);
//   for (var i = 1; i < models.length; i++) {
//     let p = base_path + models[i] + '/' + filename_ext + '.wav';  
//     let cell = table_row.cells[col_offset + i];  
//     cell.innerHTML = cell.innerHTML + createAudioHTML(p);  
//   }

const extFor = {
  audioldm2: 'wav',
  maa2: 'flac',
  tango: 'flac',
  soundctm_dit: 'flac',
  AudioMid: 'flac',
  'AudioMid-BoN': 'flac',
};

// 读取 name/<id>.txt（同步 XHR，与你示例一致）
function readNameTxt(base_path, id) {
  const p = `${base_path}/${id}.txt`;
  const req = new XMLHttpRequest();
  try {
    req.open('GET', p, false); // 同步
    req.send(null);
    if (req.status >= 200 && req.status < 300) return req.responseText;
  } catch (e) {}
  return '(no description)'; // 兜底
}

// 生成一行：第0列写 input 文本，其余列写各模型音频
function generateExampleRow(table_row, base_path, id, models, col_offset) {
  // 1) 最左侧 Input 文本（name/<id>.txt）
  const inputCell = table_row.cells[0];
  if (inputCell) {
    const txt = readNameTxt(base_path, id);
    inputCell.innerHTML = '<font size="-1">' + txt + '</font>';
    inputCell.style.whiteSpace = 'normal';
    inputCell.style.wordBreak  = 'break-word';
  }

  // 2) 逐模型填音频（默认 .wav；若该模型在 extFor 里标 flac，则用 flac）
  for (let i = 0; i < models.length; i++) {
    const modelSpec = models[i];
    const model = typeof modelSpec === 'string' ? modelSpec : modelSpec.name;
    const modelDir = typeof modelSpec === 'string' ? modelSpec : modelSpec.dir;
    const ext   = (extFor[model] || 'wav').toLowerCase();

    const cell = table_row.cells[col_offset + i];
    if (!cell) continue;

    if (ext === 'wav') {
      const p = `${base_path}${modelDir}/${id}.wav`;
      cell.innerHTML = cell.innerHTML + createAudioHTML(p); // 用你现有的函数
    } else if (ext === 'flac') {
      const p = `${base_path}${modelDir}/${id}.flac`;
      // 不改你的 createAudioHTML；这里直接插入一个 flac 的 <audio>
      cell.innerHTML =
        cell.innerHTML +
        '<audio controls controlslist="nodownload" class="px-1">' +
        `<source src="${p}" type="audio/flac">Your browser does not support the audio element.` +
        '</audio>';
    } else {
      cell.innerHTML = '<span style="font-size:12px;opacity:.7">unsupported ext</span>';
    }
  }
}

function generateExampleRowVideoWithInput(table_row, video_base_path, id, models) {
  if (!table_row) return; // 保险：行不存在就跳过

  // 1) 最左侧 Input 文本：读取 text_base_path/<id>.txt
  const cell0 = table_row.cells[0];
  if (cell0) {
    const txt = readNameTxt(video_base_path, id); // 你已实现：p = `${base_path}/${id}.txt`
    cell0.innerHTML = '<font size="-1">' + txt + '</font>';
    cell0.style.whiteSpace = 'normal';
    cell0.style.wordBreak  = 'break-word';
  }

  // 2) 从第2列开始填充视频
  generateExampleRowVideo(table_row, video_base_path, id, models, 1);
}


// function generateExampleRow(table_row, base_path, filename_ext, col_offset) {
//   for (var i = 0; i < filename_ext.length; i++) {
//     let p = base_path + filename_ext[i];
//     let cell = table_row.cells[col_offset + i];
//     if (p.endsWith('txt')) {
//       var req = new XMLHttpRequest();
//       req.open("GET", p, false);
//       req.send(null);
//       cell.innerHTML = '<font size="-1">' + req.responseText + '</font>';
//     } else {
//       cell.innerHTML = cell.innerHTML + createAudioHTML(p);
//     }
//   }
// }
// }
function generateExampleRowVideo(table_row, base_path, filename_ext, models, col_offset) {
  for (var i = 0; i < models.length; i++) {
    let p = base_path + models[i] + '/' + filename_ext + '.mp4'; 
    let cell = table_row.cells[col_offset + i];  
    cell.innerHTML = cell.innerHTML + createVideoHTML(p); 
  }
}

function generateExampleRowMelVideo(table_row, base_path, filename_ext, models, col_offset) {
  let p = base_path + models[0] + '/' + filename_ext + '.png';  
  let cell = table_row.cells[col_offset + 0]; 
  cell.innerHTML = cell.innerHTML + createImageHTML(p);
  for (var i = 1; i < models.length; i++) {
    let p = base_path + models[i] + '/' + filename_ext + '.mp4';  
    let cell = table_row.cells[col_offset + i];  
    cell.innerHTML = cell.innerHTML + createVideoHTML(p);  
  }
}
function generateTable1Vggsound(tableId) {  
  const table  = document.getElementById(tableId);  
  const names  = ['xsRyM_fXYI_000006','j62xxyQbzo_000084','1TjLs6_Geo_000013','aggk5tA7hM_000047','1RAcDEFEszA_000093','1F23RciUwDE_000030'];
  const models = ['Diff-Foley','ThinkSound','mmaudio_150k_withvideo','Frieren-track_250k_vggsound_audiocaps_reason_all_large_withvideo','V2A-Mapper-track_260k_vggsound_audiocaps_reason_all_large_withvideo','AudioMid','AudioMid-BoN'];

  for (let i = 0; i < names.length; i++) {
    const row = table.rows[1 + i];                 // 假设表里已写好足够的 <tr><td>
    generateExampleRowVideoWithInput(row, 'data/main/', names[i], models, 0);
  }
}

function generateTable1Landscape(tableId) {
  const table  = document.getElementById(tableId);

  // 每行对应的基名（与你的文件名一致，不带扩展名）
  const ids = [
    'C2HinL8VlM','z6pymOet7g','-EQByFLFqig','-mb4Fw4Z0xg','-NsC63dA01g',
    // '0G7rb74R-2A','1e98HeU9Vrg','1L_OyngNZMA','1slvoNgzBLE'
  ];

  // 表头从第1列开始是模型列；把你要展示的模型按列顺序写在这里
  // 例如：Input | GT | AudioLDM2 | Make-An-Audio2 | Tango2 | SoundCTM | ...
  const models = ['maa2', 'tango', 'soundctm_dit', 'AudioMid', 'AudioMid-BoN'];

  // 注意：第0列留给 Input 文本，所以 col_offset=1
  for (let r = 0; r < ids.length; r++) {
    // 你表里有几行就取几行：tbody 第一行是 index 1
    generateExampleRow(table.rows[1 + r], 'data/main-tta/', ids[r], models, 1);
  }
}


function generateTable2Vggsound_think(tableId) {  
  const table  = document.getElementById(tableId);  
  const names  = ['0O463Ft4mVY_000080','hSAVR0LcQp8_000280','U24BkLFGDtg_000490','0T39A4knSu4_000057','nJbGyPg6BY_000060','02UvvE1oA1I_000030'];
  const models = ['Deepsound','thinksound-vggsound_offscreen','mmaudio-vggsound-vggsound_audiocaps_fix_150k_offscreen','AudioMid','AudioMid-BoN'];

  for (let i = 0; i < names.length; i++) {
    // 假设表里已经手写好足够的 <tr><td>：第1列留给文本，后面是模型列
    const row = table.rows[1 + i];                 // 注意有表头，故 +1
    generateExampleRowVideoWithInput(
      row,
      'data/Off-screen/',       // 视频：data/Off-screen/<model>/<id>.mp4
      names[i],
      models
    );
  }
}


function generateTable4moviegen(tableId) {  
  const table  = document.getElementById(tableId);  
  const names  = ['91','117','194','211'];
  const models = ['AudioMid','AudioMid-BoN'];

  for (let i = 0; i < names.length; i++) {
    // 假设表里已经手写好足够的 <tr><td>：第1列留给文本，后面是模型列
    const row = table.rows[1 + i];                 // 注意有表头，故 +1
    generateExampleRowVideoWithInput(
      row,
      'data/moviegen/',       // 视频：data/Off-screen/<model>/<id>.mp4
      names[i],
      models
    );
  }
}



generateTable1Vggsound('vggsound1-table')
generateTable1Landscape('landscape1-table')
generateTable2Vggsound_think('think-table2')
generateTable4moviegen('moviegen-table4')
