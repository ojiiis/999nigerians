  function fakeLogout(){
        localStorage.setItem("token",null);
        location.reload();
    }
    
   const webData = (!JSON.parse(localStorage.getItem('web-data')) == null) ? JSON.parse(localStorage.getItem('web-data')) : {};
        window.onload = function () {

            if (localStorage.getItem("token") != null && localStorage.getItem("token") != "undefined") {
                (

                    async () => {
                        document.getElementById("loading").style.display = "flex";
                        var wl = (window.location.href.toString().substring(7).split("/")[1] !== "") ? window.location.href.toString().substring(7).split("/")[1] : "/";
                        var url = "https://lin.com.ng/love/";

                        switch (wl) {
                            case "/":
                                url = "https://lin.com.ng/love/";
                                break;
                            case "/profile":
                                url = "https://lin.com.ng/love/profile/";
                                break;
                            case "/logout":
                    localStorage.setItem("token",null);
                            break;
                        }

                        const req = await fetch(url, {
                            method: "POST",
                            headers: {
                                "token": localStorage.getItem("token"),
                                "Content-Type": "application/json"
                            },
                        });
                        const res = await req.json();
                       
                        if (res.status == 1) {
                            switch (res?.redirect) {
                                case "let-know-you":
                                    swapAuth('sign-in', 'let-know-you');
                                    swapAuth('sign-up', 'let-know-you');
                                    break;
                                case "add-media":
                    
                       swapAuth('sign-in', 'add-media');
                                    swapAuth('let-know-you', 'add-media');
                                    break;
                                case "home":
                                    removeAuth();
                    
                                    break;
                                
                            }
                            
                        
                            if (res?.user.fullname && document.getElementById("let-know-you-usersname")) {
                                document.getElementById("let-know-you-usersname").innerText = res.user.fullname;
                            }
                            if (res?.data && res?.redirect == "home") {
                                
     if (res?.user.media && document.getElementById("profile")) {
         
        if (res?.user.media.split(",").length == 4) {
            
            document.getElementById("media-card-btn2").classList.add("uploaded2");
                                    document.getElementById("media-card-btn2").setAttribute("id", "");

             }
                 let uploaded = document.getElementsByClassName("uploaded2");
               
                                for (let i = 0; i < res?.user.media.split(",").length; i++){
            uploaded[i].innerHTML = `<div class="delete_media" onclick='delete_media(${i})'><i class='fa fa-trash-o'></i></div>`;               uploaded[i].style.backgroundImage = `url('https://lin.com.ng/love/media/${res?.user.media.split(",")[i]}')`;
                                    uploaded[i].style.backgroundPosition = "center";
                                    uploaded[i].style.backgroundSize = "cover";
                                }

    }                               
                                
                              
   document.getElementById("profile-fullname").innerText = res.user.fullname;     
   document.getElementById("profile-dob").innerText = res.user.dob; 
   document.getElementById("profile-location").innerText = res.user.state+", "+res.user.city+".";  
   document.getElementById("profile-lookingfor").innerText = res.user.lookingfor; 
   document.getElementById("profile-about").innerText = res.user.about; 
   
   res?.data.forEach((item)=>{
     let play = Play(item); 
     document.getElementById("wrapper").appendChild(play);
   });                             


                            }


                            if (res?.user.media && document.getElementById("add-media")) {
                                if (res?.user.media.split(",").length == 4) {
                                    document.getElementById("media-card-btn").classList.add("uploaded");
                                    document.getElementById("media-card-btn").setAttribute("id", "");

                                }
                 var uploaded = document.getElementsByClassName("uploaded");

                                for (let i = 0; i < res?.user.media.split(",").length; i++){
            uploaded[i].innerHTML = `<div class="delete_media" onclick='delete_media(${i})'><i class='fa fa-trash-o'></i></div>`;               uploaded[i].style.backgroundImage = `url('https://lin.com.ng/love/media/${res?.user.media.split(",")[i]}')`;
                                    uploaded[i].style.backgroundPosition = "center";
                                    uploaded[i].style.backgroundSize = "cover";
                                }

                            }
    
                              
                       
                       
                            
                            
                        }
                         document.getElementById("loading").style.display = "none";
                    }
                )();
            }
        }
        if (document.getElementById("location")) {
            var loc = document.getElementById("location");
            if (loc.options.length == 1) {
                (
                    
                        async () => {
                            
                     try{       
                        const req = await fetch("https://lin.com.ng/love/nigeria");
                        const res = await req.json();
                        for (let i in res.data) {
                            let op = document.createElement("option");
                            op.value = i;
                            op.textContent = i;
                            loc.appendChild(op);

                        }
                        }catch(e){
                        
           document.getElementById("network-error").style.display = "flex";               
                        
                        
                            
                        }

                    }
                  
                )();

                loc.onchange = async function () {
                    var state = this.getAttribute('data-state');
                    if (state == "state") {
                        const req = await fetch(`https://lin.com.ng/love/nigeria/${this.value}`);
                        document.getElementById("state").value = this.value;
                        this.parentElement.children[0].innerText = `Where in ${this.value} do you live?`;
                        this.value = "";
                        this.innerHTML = `<option value="">Select a place in ${this.value}</option>`;
                        this.required = true;
                        const res = await req.json();
                        this.setAttribute("data-state", "city");
                        
                        for (let i = 0; i < res.data.cities.length; i++) {
                            this.required = true;
                            let op = document.createElement("option");
                            op.value = res.data.cities[i];
                            op.textContent = res.data.cities[i];
                            loc.appendChild(op);

                        }

                    } else if (state == "city") {
                        document.getElementById("city").value = this.value;
                        
                        
                    }

                }


            }

        }
        for (let i of document.getElementsByTagName("form")) {
            i.onsubmit = async function (e) {
                e.preventDefault();
                this.querySelector('.submit').disabled = true;
                var btnContent = this.querySelector('.submit').innerHTML;
                this.querySelector('.submit').style.background = "#ddd";
                this.querySelector('.submit').innerHTML = "Working...";
                const formdata = new FormData(this);
                var processing = (this.getAttribute("processing") == null) ? 0 : this.getAttribute("processing");
                if (processing == 1) return;
                this.setAttribute("processing", 1);
                const data = {};
                formdata.forEach((item, index) => {
                    data[index] = item;
                });
                try {

                    const url = (this.action != null) ? this.action : "/";
                    const req = await fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "token": localStorage.getItem("token")
                        },
                        body: JSON.stringify(data)

                    });
                    var res;
                    try {
                        res = await req.json();
                    } catch (e) {
                        res = { "status": 0, "error": ["internal error.", "contact support"], "devError": e.toString() };
                    }

                } catch (e) {
                    res = { "status": 0, "error": ["internal error.", "contact support"], "devError": e.toString() };

                }
                this.setAttribute("processing", 0);
                
                this.querySelector('.submit').disabled = false;
                this.querySelector('.submit').style.background = "#303030";
                this.querySelector('.submit').innerHTML = btnContent;
                if (res.status == 1) {
                    switch (res?.redirect) {
                        case "let-know-you":
                            swapAuth('sign-in', 'let-know-you');
                            swapAuth('sign-up', 'let-know-you');
                    
                       document.getElementById("let-know-you-usersname").innerText = res.data;
                         localStorage.setItem('token', res.token);
                            break;
                        case "add-media":
                             
                           
                    
                            swapAuth('sign-in', 'add-media');
                            swapAuth('let-know-you', 'add-media');
                         localStorage.setItem('token', res.token);
                            break;
                        case "home":
                            removeAuth();
                            localStorage.setItem('token', res.token);
                            location.reload();
                            break;
                    }
                }
                if (res.status == 0) {
                    displayError(res.error);
                }
            }

        }

       
        
        document.getElementById("wrapper").ondblclick = function () {
            if (document.getElementsByTagName("nav")[0].style.display == "none") {
                document.getElementsByTagName("nav")[0].style.display = "block";
            } else {
                document.getElementsByTagName("nav")[0].style.display = "none";
            }
        }
        var l = document.getElementsByClassName("likie");
        for (let g of l) {
            g.onclick = function () {
                
                if (this.getAttribute("liked") == null || this.getAttribute("liked") == 0) {
                    this.setAttribute("liked", "1");
                    this.children[0].style.display = "block";
                    this.children[0].style.animation = "none";
                    this.children[0].style.animation = "actlike 1s forwards";
                    setTimeout(() => {
                        this.style.background = "#FF1493";
                    }, 800);
                } else if (this.getAttribute("liked") == 1) {

                    this.setAttribute("liked", "0");
                    this.style.background = "#303030";
                    this.style.color = "#f7f7f7";
                    this.children[0].style.display = "none";
                    this.children[0].style.animation = "none";
                }
            }
        }

        function swapAuth(a, b) {

            var b = document.getElementById(b);
            var a = document.getElementById(a);

            if (a && b) {
                b.style.display = "block";
                b.style.animation = "add-auth 0.5s forwards";
                a.style.animation = "remove-auth 0.3s forwards";
                setTimeout(() => {
                    a.style.display = "none";
                    document.getElementById("wrapper").scrollTop = 0;
                }, 500);
            }

        }

        function removeAuth(d = true) {
             
            for (let i of document.getElementsByClassName("auth")) {

                i.style.display = "none";

            }
            if (!d) return;
            for (let i of document.getElementsByClassName("play")) {

                i.style.display = "block";

            }

        }

        if (document.getElementById("media-card-btn")) {
            if (document.getElementById("media-card-btn").getAttribute("working") == null || document.getElementById("media-card-btn").getAttribute("working") == 0)
                document.getElementById("media-card-btn").onclick = () => document.getElementById("media").click();
        }
        document.getElementById("media").onchange = async function () {
            var btn = document.getElementById("media-card-btn");
            btn.setAttribute("working", 1);
            btn.previousText = "Click to upload picture";
            btn.innerText = "Uploading...";
            const data = new FormData();
            data.append('media', this.files[0]);
            const req = await fetch('https://lin.com.ng/love/add-media', {
                method: "POST",
                headers: {
                    "token": localStorage.getItem("token")
                },
                body: data
            });
            const res = await req.json();
            
            
            btn.setAttribute("working", 0);
            btn.innerText = "Click to upload picture";
            if (res.status != 1) {
                displayError(res.error);
            } else {

                const medias = res.current_media.split(",");
                
                const currentMedia = document.getElementsByClassName("uploaded")[medias.length - 1];

               currentMedia.innerHTML =  `<div class="delete_media" onclick='delete_media(${medias.length - 1})'><i class='fa fa-trash-o'></i></div>`;            
                currentMedia.style.backgroundImage = `url('https://lin.com.ng/love/media/${medias[medias.length - 1]}')`;
                currentMedia.style.backgroundPosition = "center";
                currentMedia.style.backgroundSize = "cover";

            }
        }
     
    if(document.getElementById("media-card-btn2")){
            if (document.getElementById("media-card-btn2").getAttribute("working") == null || document.getElementById("media-card-btn2").getAttribute("working") == 0)
                document.getElementById("media-card-btn2").onclick = () => document.getElementById("media2").click();
        }
        document.getElementById("media2").onchange = async function () {
            var btn = document.getElementById("media-card-btn2");
            btn.setAttribute("working", 1);
            btn.previousText = "Click to upload picture";
            btn.innerText = "Uploading...";
            const data = new FormData();
            data.append('media', this.files[0]);
            const req = await fetch('https://lin.com.ng/love/add-media', {
                method: "POST",
                headers: {
                    "token": localStorage.getItem("token")
                },
                body: data
            });
            const res = await req.json();
            
            
            btn.setAttribute("working", 0);
            btn.innerText = "Click to upload picture";
            if (res.status != 1) {
                displayError(res.error);
            } else {

                const medias = res.current_media.split(",");
                const currentMedia = document.getElementsByClassName("uploaded2")[medias.length - 1];

               currentMedia.innerHTML =  `<div class="delete_media" onclick='delete_media(${medias.length - 1})'><i class='fa fa-trash-o'></i></div>`;            
                currentMedia.style.backgroundImage = `url('https://lin.com.ng/love/media/${medias[medias.length - 1]}')`;
                currentMedia.style.backgroundPosition = "center";
                currentMedia.style.backgroundSize = "cover";

            }
        }
            
     
     
     
     
        
        
        function displayError(er) {
            document.getElementById("error-card").innerHTML = "";
            let d = 0;
            var task = setInterval(function () {
                if (d < er.length) {
                    var e = document.createElement("span");
                    e.classList.add("errors");
                    e.innerText = er[d];
                    e.animation = "displayError 1s forwards";
                    document.getElementById("error-card").appendChild(e);
                    d++;
                    setTimeout(() => {
                        let re = setInterval(() => {

                            if ((e.offsetTop + e.offsetHeight) > 0) {
                                e.style.marginTop = e.offsetTop - 20 + "px";

                            } else {
                                clearInterval(re);
                            }
                        }, 50);
                    }, 3000);
                }
            }, 10);
        }
        
        function Play(data = {}){
     const play = document.createElement("div");
     play.classList.add("novel-cards");
     play.classList.add("play");
     play.style.display = "block";
     const playCover = document.createElement("div");
     playCover.classList.add("novel-cards-cover");
     data.media.split(",").forEach((item)=>{
         
     let cover = document.createElement("div");
     cover.classList.add("card-images");
     
    cover.style.backgroundImage = 'url("https://lin.com.ng/love/media/'+item+'")';
    
    playCover.appendChild(cover); 
     });
     
  const playTitle = document.createElement("div");
       playTitle.classList.add("novel-cards-title");
      
     const h = document.createElement("h2");
     h.innerText = `${data.fullname}, ${new Date().getFullYear() - data.dob.split("-")[0]}.`;
    const lo = document.createElement("div"),lf =document.createElement("div"),d1 = document.createElement("div"),d2 = document.createElement("div"),d3 = document.createElement("div"),d4 = document.createElement("div");
    lo.classList.add("card-lister");
    d1.innerText = 'Location';
    d2.innerText = `${data.city}, ${data.state}.`;
    lo.appendChild(d1);
    lo.appendChild(d2);
    
    
    
    
    lf.classList.add("card-lister");
    d3.innerText = 'Looking for';
    d4.innerText = `${data.lookingfor}`;
    lf.appendChild(d3);
    lf.appendChild(d4);
    
    const cbtn = document.createElement("div"),btn1 = document.createElement("button"),span = document.createElement("span"), btn2 = document.createElement("button"),a = document.createElement("a");
    cbtn.classList.add("card-btn");
    
    btn1.classList.add("likie");
    btn1.setAttribute("liked",0);
    btn1.setAttribute("data-user", data.user_id);
     btn1.appendChild(span);
     btn1.appendChild(document.createTextNode(" Like "))
    
    btn1.onclick = async function () {
     var res = [];
      try{
            const req = await fetch("https://lin.com.ng/love/like",{
            method:"POST",
            "headers":{
                "Content-Type":"application/json",
                "token":localStorage.getItem("token")
            },
            body:JSON.stringify({
                "user":btn1.getAttribute("data-user")
            })
        });
        const res = await req.json();
      }catch(e){
          console.log(e);
      }
        

                if (this.getAttribute("liked") == null || this.getAttribute("liked") == 0) {
                    this.setAttribute("liked", "1");
                    this.children[0].style.display = "block";
                    this.children[0].style.animation = "none";
                    this.children[0].style.animation = "actlike 1s forwards";

                    setTimeout(() => {
                        this.style.background = "#FF1493";
                    }, 800);
                } else if (this.getAttribute("liked") == 1) {

                    this.setAttribute("liked", "0");
                    this.style.background = "#303030";
                    this.style.color = "#f7f7f7";
                    this.children[0].style.display = "none";
                    this.children[0].style.animation = "none";
                }
            }
     if(data.liked){
         btn1.style.background = "#FF1493";
         btn1.setAttribute("liked", "1");
     }
    a.href="javascript:void(0)";
    a.innerHTML = "<button onclick='popUpMsg(this)' data-pid="+data.user_id+">message</button>";
    btn2.classList.add("show-details");
    btn2.onclick =  function() {
                   
                    let t = document.getElementById("card_" + this.getAttribute("data-id"));
                    t.style.animation = "none";
                    t.style.animation = `showcard 1s forwards`;
                    
                    t.style.display = "block";
                };
    btn2.setAttribute("data-id",data.user_id);
    btn2.innerHTML = "View full profile";
    cbtn.appendChild(btn1);       
    cbtn.appendChild(a);  
    cbtn.appendChild(btn2);  
                          
    
    const fd = document.createElement("div");
    fd.classList.add("card-full-details");
    fd.id = `card_${data.user_id}`;
    
   
    
    const cn = document.createElement("div"), bbtn = document.createElement("button"), lo2 = document.createElement("div"),lf2 =document.createElement("div"),d12 = document.createElement("div"),d22 = document.createElement("div"),d32 = document.createElement("div"),d42 = document.createElement("div");
    
    cn.classList.add("container");
    bbtn.classList.add("close-details");
    bbtn.setAttribute("data-id",`card_${data.user_id}`);
    bbtn.innerText = "Close";
    bbtn.onclick = function() {
                    let t = document.getElementById(this.getAttribute("data-id"));

                    t.style.animation = "none";
                    t.style.animation = `hidecard 1s forwards`;
                    t.style.display = "none";
                    

                }
    cn.appendChild(bbtn);
    
    lo2.classList.add("card-lister");
    d12.innerText = 'Location';
    d22.innerText = `${data.city}, ${data.state}.`;
    lo2.appendChild(d12);
    lo2.appendChild(d22);
    const about = document.createElement("div");
    about.innerHTML = `
    <div class="card-lister">
    <div>About</div>
     <div>${data.about}</div>
    </div>
    `;
    
    
    
    lf2.classList.add("card-lister");
    d32.innerText = 'Looking for';
    d42.innerText = data.lookingfor;
    lf2.appendChild(d32);
    lf2.appendChild(d42);
    fd.appendChild(cn);
    fd.appendChild(lo2);
    fd.appendChild(lf2);
    fd.appendChild(about);
    //fullDetails
    
    
    playTitle.appendChild(h);
    playTitle.appendChild(lo);
    playTitle.appendChild(lf);
    playTitle.appendChild(cbtn);
    play.appendChild(playCover);
    play.appendChild(playTitle);
  //  play.insertAdjacentElement("afterend",fd);
  play.insertBefore(fd,play.parentElement)
     const fullDetails = document.createElement("div");
     
     return play;
     
}

function popUpMsg(u){
    
let pid = u.getAttribute("data-pid");
    document.getElementById("pm-btn").setAttribute("data-pid",pid);
    document.getElementById("pm-div").style.display = "flex";
    document.getElementById("pm-msg-callback").innerText   = "";
}


document.getElementById("pm-btn").onclick = async function(){
    let msg = document.getElementById("pm-msg").value;
let pid = document.getElementById("pm-btn").getAttribute("data-pid");
  this.disabled = true;
  
  const req = await fetch("https://lin.com.ng/love/emapi/send_message",{
      method:"POST",
      headers:{
          "token":localStorage.getItem("token"),
          "Content-Type":"application/json"
      },
      body:JSON.stringify({
          message:msg,
          pid:pid
      })
  });
  const a = await req.json();
  
       if(a.status == 1){
    document.getElementById("pm-msg").value = "";           
    
           }
           
 document.getElementById("pm-msg-callback").style.display = "block";
   
 document.getElementById("pm-msg-callback").innerText   = a.message;
 this.disabled = false;
}

document.getElementById("close-pm").onclick = function(){
    document.getElementById("pm-div").style.display = "none";
    
}
async function delete_media(m){
  
    let req = await fetch("https://lin.com.ng/love/emapi/delete_media",{
        method:"POST",
        headers:{
            'token':localStorage.getItem("token"),
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
          i:m  
        })
    });
    
    let res = await req.json();
    if(res.status == 1){

document.getElementsByClassName("uploaded")[m].style.backgroundImage = 'none';
document.getElementsByClassName("uploaded")[m].innerHTML = '';  
 document.getElementsByClassName("uploaded2")[m].style.backgroundImage = 'none';
document.getElementsByClassName("uploaded2")[m].innerHTML = '';   

    }
}

async function delete_account(){
    
    let req = await fetch("https://lin.com.ng/love/emapi/delete_account",{
        method:"GET",
        headers:{
            'token':localStorage.getItem("token"),
            'Content-Type':'application/json'
        }
    });
    
    let res = await req.json();
    if(res.status == 1){
    fakeLogout();
    }
}

function showProfile(){
    document.getElementById("profile").style.display = "block";
    document.getElementById("wrapper").style.overflowY = "hidden";
}

function hideProfile(){
    document.getElementById("profile").style.display = "none";
    document.getElementById("wrapper").style.overflowY = "scroll";
}