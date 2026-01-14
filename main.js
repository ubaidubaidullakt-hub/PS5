let currentConsole=null, emulator=null;
let lastFrame=performance.now(), fps=0;
let perfMode=false;

// ---------- FPS ----------
function updateFPS(){
  const now=performance.now();
  fps=Math.round(1000/(now-lastFrame));
  lastFrame=now;
  document.getElementById("fps").innerText="FPS: "+fps;
  requestAnimationFrame(updateFPS);
}
requestAnimationFrame(updateFPS);

// ---------- Console ----------
function selectConsole(c){ currentConsole=c; }

// ---------- ROM LOAD (ZIP SUPPORT) ----------
function addROM(){
  document.getElementById("romInput").click();
}

document.getElementById("romInput").onchange=async e=>{
  const file=e.target.files[0];
  if(file.name.endsWith(".zip")){
    const zip=await JSZip.loadAsync(file);
    const romFile=Object.values(zip.files)[0];
    startROM(await romFile.async("arraybuffer"));
  }else{
    startROM(await file.arrayBuffer());
  }
};

// ---------- BIOS CHECK ----------
function checkBIOS(){
  if(["ps1","dos","mame","amiga"].includes(currentConsole)){
    alert("⚠ BIOS required for "+currentConsole);
  }
}

// ---------- START ----------
function startROM(data){
  checkBIOS();
  document.getElementById("home").style.display="none";
  document.getElementById("emu").style.display="block";

  const canvas=document.getElementById("screen");
  if(perfMode){ canvas.width=320; canvas.height=240; }

  switch(currentConsole){
    case "nes": emulator=new JSNES({canvas}); break;
    case "snes": emulator=new JSSNES({canvas}); break;
    case "gb": emulator=new JSGB({canvas}); break;
    case "gba": emulator=new GameBoyAdvance(canvas); break;
    case "genesis": emulator=new Genesis(canvas); break;
    case "sms": emulator=new JSSMS(canvas); break;
    case "ps1": emulator=new PCSX(canvas); break;
    case "dos": emulator=new DOSBox(canvas); break;
    case "neogeo": emulator=new NeoGeo(canvas); break;
    case "atari": emulator=new JSAtari(canvas); break;
    case "mame": emulator=new JSMAME(canvas); break;
    case "coleco": emulator=new Coleco(canvas); break;
    case "zx": emulator=new JSZX(canvas); break;
    case "amiga": emulator=new Amiga(canvas); break;
  }

  emulator.loadROM(new Uint8Array(data));
}

// ---------- ANALOG STICK ----------
const analog=document.getElementById("analog");
let ax=0, ay=0;
analog.ontouchmove=e=>{
  ax=e.touches[0].clientX;
  ay=e.touches[0].clientY;
};

// ---------- SETTINGS ----------
function openSettings(){ document.getElementById("settings").style.display="block"; }
function closeSettings(){ document.getElementById("settings").style.display="none"; }
function resetLayout(){ localStorage.clear(); location.reload(); }
function togglePerformance(){ perfMode=!perfMode; alert("Performance: "+perfMode); }

// ---------- EXIT ----------
function exitGame(){
  emulator=null;
  document.getElementById("emu").style.display="none";
  document.getElementById("home").style.display="block";
}