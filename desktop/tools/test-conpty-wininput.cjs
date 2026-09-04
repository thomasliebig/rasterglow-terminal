const path=require('path'),pty=require('node-pty');
const exe=process.env.RASTERGLOW_TEST_PROBE || path.join(__dirname,'WinInputProbe.exe');
const shell=pty.spawn(exe,[],{cols:80,rows:25,useConpty:true,useConptyDll:true,name:'xterm-256color'});
let out='',sent=false;shell.onData(d=>{out+=d;if(d.includes('\x1b[c'))shell.write('\x1b[?1;2c');if(!sent&&out.includes('READY')){sent=true;setTimeout(()=>shell.write('a\x1b[112;59;0;1;0;1_\x1b[112;59;0;0;0;1_\x1b[<0;18;10M\x1b[<0;18;10m\x1b[<65;18;10M'),150);}});
setTimeout(()=>{const key=/KEY 112 59 1 0 0/.test(out);const click=/MOUSE 17 9 1 0/.test(out);const wheel=/MOUSE 17 9 4286578688 4/.test(out);console.log(`F1=${key} click=${click} wheel=${wheel}`);if(!key||!click||!wheel)console.log(JSON.stringify(out));shell.kill();setTimeout(()=>process.exit(key&&click&&wheel?0:1),100)},2400);
