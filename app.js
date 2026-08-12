/* MUZAN ARCHIVE Â· self-contained WebGL character mutation scene */
(() => {
  const forms = [...document.querySelectorAll('.form-card')];
  const formName = document.querySelector('#formName');
  let setPalette = () => {};
  let quality = true;
  let resizeScene = () => {};
  const fidelityButton = document.querySelector('#fidelity');

  fidelityButton.addEventListener('click', event => {
    quality = !quality;
    event.currentTarget.setAttribute('aria-pressed', quality);
    event.currentTarget.textContent = `4K fidelity: ${quality ? 'ON' : 'OFF'}`;
    resizeScene();
  });
  const changeForm = (card) => {
    forms.forEach(item => item.classList.toggle('active', item === card));
    formName.textContent = card.dataset.form;
    setPalette(card.dataset.colour);
  };
  forms.forEach(card => card.addEventListener('click', () => changeForm(card)));
  document.querySelector('#formButton').addEventListener('click', () => {
    const current = forms.findIndex(item => item.classList.contains('active'));
    changeForm(forms[(current + 1) % forms.length]);
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
  }), { threshold: .13 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  const canvas = document.querySelector('#void');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' });
  if (!gl) return;
  const vertex = `attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }`;
  const fragment = `
    precision highp float;
    uniform vec2 r; uniform float t; uniform vec2 m; uniform vec3 c;
    mat2 rot(float a){float s=sin(a),q=cos(a);return mat2(q,-s,s,q);}
    float hash(vec2 p){return fract(sin(dot(p,vec2(41.71,289.31)))*412.19);}
    float map(vec3 p){
      p.x-=.95; p.yz=rot(.32*sin(t*.25)+m.y*.32)*p.yz; p.xz=rot(.38+t*.12+m.x*.28)*p.xz;
      float organic=sin(p.x*5.+t)*sin(p.y*4.-t*.7)*sin(p.z*6.)*.045;
      return length(p*vec3(1.,.77,1.18))-1.18+organic;
    }
    vec3 normal(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(map(p+e.xyy)-map(p-e.xyy),map(p+e.yxy)-map(p-e.yxy),map(p+e.yyx)-map(p-e.yyx)));}
    void main(){
      vec2 uv=(gl_FragCoord.xy-.5*r)/r.y; vec3 ro=vec3(0.,0.,5.4),rd=normalize(vec3(uv,-1.75));
      float depth=0.,hit=0.; vec3 p=ro;
      for(int i=0;i<76;i++){p=ro+rd*depth;float d=map(p);if(d<.002){hit=1.;break;}depth+=d*.72;if(depth>11.)break;}
      vec3 col=vec3(0.);
      if(hit>.5){vec3 n=normal(p),l=normalize(vec3(-2.8,3.2,4.));float diff=max(dot(n,l),0.);float rim=pow(1.-max(dot(n,-rd),0.),2.4);float spec=pow(max(dot(reflect(-l,n),-rd),0.),34.);float veins=sin(p.x*16.+sin(p.y*8.)*2.)*.5+.5;col=c*(.18+diff*.83+rim*.85)+vec3(1.,.07,.16)*spec*.85+veins*c*.12;}
      vec2 starUv=uv*vec2(1.7,1.);float stars=0.;for(float j=0.;j<3.;j++){vec2 cell=floor(starUv*15.+j*8.);vec2 local=fract(starUv*15.+j*8.)-.5;float seed=hash(cell+j);vec2 point=vec2(hash(cell+seed),hash(cell+seed+5.))-0.5;stars+=smoothstep(.018,.0,length(local-point))*(.25+seed*.75);}
      col+=c*stars*.32; float vignette=1.-dot(uv,uv)*.22; gl_FragColor=vec4(col*vignette, min(1.,hit*.97+stars*.2));
    }`;
  const compile = (type, source) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
  const program = gl.createProgram(); gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program); gl.useProgram(program);
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, 'p'); gl.enableVertexAttribArray(point); gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
  const resolution = gl.getUniformLocation(program, 'r'); const time = gl.getUniformLocation(program, 't'); const mouse = gl.getUniformLocation(program, 'm'); const colour = gl.getUniformLocation(program, 'c');
  let pointer = [0,0]; let tint = [196/255,29/255,64/255];
  const toRgb = hex => [parseInt(hex.slice(1,3),16)/255,parseInt(hex.slice(3,5),16)/255,parseInt(hex.slice(5,7),16)/255];
  setPalette = hex => { tint = toRgb(hex); };
  resizeScene = () => { const ratio = Math.min(devicePixelRatio, quality ? 2 : 1); canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; gl.viewport(0,0,canvas.width,canvas.height); };
  addEventListener('resize', resizeScene); addEventListener('pointermove', event => { pointer = [(event.clientX / innerWidth - .5) * .8,(event.clientY / innerHeight - .5) * .55]; }); resizeScene();
  const started = performance.now();
  function draw(now) { gl.useProgram(program); gl.uniform2f(resolution, canvas.width, canvas.height); gl.uniform1f(time, (now-started)*.001); gl.uniform2f(mouse,pointer[0],pointer[1]); gl.uniform3f(colour,tint[0],tint[1],tint[2]); gl.drawArrays(gl.TRIANGLES,0,6); requestAnimationFrame(draw); }
  requestAnimationFrame(draw);
  fetch('/api/system').then(response => response.ok ? response.json() : null).then(data => { if (data?.engine === 'c') document.documentElement.dataset.engine = 'c'; }).catch(() => {});
})();

