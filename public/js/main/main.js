let nameSession='user';
let user;
let div;
let component=new Component();
let menu;
let reunion;
let isAdmin=true;
let annee=2024;

if(typeof(dom)=='undefined') dom=new Morel_Dom();

function saveUser(user){
    if(user){
        sessionStorage.setItem(nameSession,JSON.stringify(
            /*{
                _id:user._id,
                hack:user.hack
            }*/
            user
        ))
    }
}

function main(){
    user=sessionStorage.getItem(nameSession);
    if(!user){
        div=popup('',false,false,'container-500');
        let info=dom.getChild(div,'info')[0];
        info.classList.remove('bg-white');
        info.style.background="linear-Gradient(58deg,white,#f2f2f2,#ccc)";
        let form=new FormulaireConnexionReunion(info);
        form.submitForm().then(post=>{
            reunion=post;
            sessionStorage.setItem(nameSession,JSON.stringify({_id:post._id,login:post.login,...post}))
            main();
        });
    }else{
        user=JSON.parse(user);
        if(div) div.remove();
        menu=new Menu('','GestTontine',['Profil','Presence','Tontine'],['']);
        menu.setTitre("GestTontine <b class='text-danger'>"+2024+"</b>");
        let profil=new Profil(menu.divBody[0],user);
        new MainMembre(profil.divMembre,true);
        new MainAnnee(profil.divAnnee,true);
        new MainPresence(menu.divBody[1],true);
        new MainTontine(menu.divBody[2],true);
        ['Profil&nbsp','Presence','Tontine'].forEach((e,i)=>new NavigationTitre(menu.divBody[i],'titre',e));
    }
}

main();