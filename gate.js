const accessKey='dtv-preview-access';
const accessHash='e7d20661aad65e4f88b2ea9fc24676d9ae6a5088bd833f8d657b707c8c3b0a03';

async function hashAccess(value){
  const data=new TextEncoder().encode(value);
  const digest=await crypto.subtle.digest('SHA-256',data);
  return [...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');
}

function unlockSite(){
  document.querySelector('.access-gate')?.remove();
  document.documentElement.classList.remove('access-locked');
}

if(localStorage.getItem(accessKey)===accessHash){
  unlockSite();
}else{
  const gate=document.createElement('section');
  gate.className='access-gate';
  gate.setAttribute('role','dialog');
  gate.setAttribute('aria-modal','true');
  gate.setAttribute('aria-labelledby','access-title');
  gate.innerHTML=`
    <div class="access-gate-panel">
      <p class="access-gate-mark">Dance Temple Vancouver · Private preview</p>
      <h1 id="access-title">Private preview</h1>
      <p class="access-gate-copy">Enter the password to view the website.</p>
      <form class="access-form">
        <label for="preview-password">Preview password</label>
        <div class="access-field"><input id="preview-password" type="password" required autocomplete="current-password"><button type="submit">Enter</button></div>
        <p class="access-error" role="alert" aria-live="polite"></p>
      </form>
    </div>`;
  document.body.prepend(gate);
  const form=gate.querySelector('form');
  const input=gate.querySelector('input');
  const error=gate.querySelector('.access-error');
  form.addEventListener('submit',async event=>{
    event.preventDefault();
    const submittedHash=await hashAccess(input.value);
    if(submittedHash===accessHash){
      localStorage.setItem(accessKey,accessHash);
      unlockSite();
    }else{
      input.value='';
      error.textContent='That password is not quite right. Try again.';
      input.focus();
    }
  });
  input.focus();
}
