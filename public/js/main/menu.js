/*
	cette class creer le menu de l'application, enfait il met en place le squellet de l'applicarion
	
	Parmmettre le : 
		- le menu qui contient l'icon avec le tritre et si cette valeur est a fausse alors 
		- le sous menu qui contient pariel

	fonctionnalite
	- afficher les menu ajouter
	- ajuster la taille du menu et sous menu en fnction du nombre d'element
*/

class Menu extends Morel_Dom{

	constructor(div,titre,menu,sousMenu){
		super();
		this.div=div;
		this.titre=titre;
		this.sousMenu=sousMenu || [];
		this.menu=menu || [];
		if(!div || div==''){
			this.div=document.body;
		}

		this.div.innerHTML=this.body();
		this.variable();
		this.ajusteMenu();
		window.addEventListener('resize',()=>{this.ajusteMenu()});

		// injecter les evenements dans les menu
		this.eventMenu();
	}


	body(){
		const menu=this.element('div',{class:'flex-center border-box',id:'menu'},
			this.menu.map(e=>this.element('div',{class:'p-2 men rounded break-word pointer'},e))
		);

		const sousMenu=this.element('div',{class:'flex-center justify-content-right border-box',id:'sousMenu',style:`width:${this.sousMenu.length*23}px`},
			this.sousMenu.map(e=>this.element('i',{class:e+' px-1 pointer rounded pointer'}))
		)

		const menuTop=this.element('div',{id:'menuTop',class:'w-100 p-2 border-box flex bg-white shadow',style:'left:0px;position:fixed;top:0px;left:0px;z-index:10'},
			[
				this.element('div',{style:`max-width:calc(100% - ${this.sousMenu.length*23}px);z-index:10;padding:6px 0px;white-space:nowrap`,class:'family-morel text-center fw-bold border-box',id:'titre'},this.titre),
				menu,
				sousMenu
			]
		);

		const menuBottom=this.element('div',{id:'menuBottom',class:'w-100 p-2 border-box bg-white',style:'background:linear-gradient(60deg,white,#ddd);left:0px;position:fixed;bottom:0px;left:0px;z-index:10;border-top:1px solid #ccc'},
			menu
		);

		const body=this.element('div',{id:'body'},
			this.menu.map((e,i)=>this.element('div',{class:'w-100 divBody border-box',id:'body'+i,style:'overflow-y:scroll;position:fixed;top:0px;height:100%;left:0px;display:none;padding:0px 0px 250px 0px'},e))
		);

		return this.balise(this.element('',{},
			[menuTop,body,menuBottom]
		))
	}

	variable(){
		this.body=this.getChild(this.div,'body')[0];
		this.divBody=this.getChild(this.body,'divBody');
		this.divTitre=this.getChild(this.div,'titre')[0];
		this.divMenu=this.getChild(this.div,'menu');
		this.divSousMenu=this.getChild(this.div,'sousMenu')[0];
		this.divMenuBottom=this.getChild(this.div,'menuBottom')[0];
		this.divMenuTop=this.getChild(this.div,'menuTop')[0];
		this.menuDiv=this.getChild(this.divMenu[0],'men');
		this.menuBottomDiv=this.getChild(this.divMenuBottom,'men');
		this.titreDiv=this.getChild(this.div,'titre')[0];
	}

	ajusteMenu(){
		let width=window.innerWidth;
		let widthTitre=parseInt(this.el_position(this.divTitre).width);
		let widthSousMenu=parseInt(this.el_position(this.divSousMenu).width);
		this.divMenu[0].style.width=``;
		this.divMenu[0].classList.remove('suspention');
		let widthDivMenu=parseInt(this.el_position(this.divMenu[0]).width + 50);
		let dif=width - widthTitre - widthSousMenu;
		let t=dif>widthDivMenu;
		this.divMenu[0].classList.add('suspention');
		this.divMenu[0].style.width=`calc(100% - ${widthTitre + widthSousMenu}px)`;
		let top=parseInt(this.el_position(this.divMenuTop).height);
		this.divBody.forEach(e=>{
			e.style.paddingTop=(top+10)+'px';
		});

		if(t){
			this.divMenu[0].style.visibility='';
			this.divMenuBottom.style.display='none';
		}else{
			this.divMenuBottom.style.display='';
			this.divMenu[0].style.visibility='hidden';
		}
	}

	setMenu(i,value){
		let t;
		if(t=this.menuDiv[i]){
			t.innerHTML=value;
			this.menuBottomDiv[i].innerHTML=value;
		}
		this.ajusteMenu();
	}

	setTitre(value){
		this.titreDiv.innerHTML=value;
		this.ajusteMenu();
	}


	event(el,event,func){
		el.forEach((e,i)=>{
			e.addEventListener(event || 'click',()=>{func(i)})
		})
	}

	addEventMenu(event,func){
		this.event(this.divMenu,event,func);
	}

	addEventSousMenu(event,func){
		this.event(this.divMenu,event,func);

	}

	eventMenu(){
		const func=(i,div)=>{
			this.display(this.divBody,'none');
			this.divBody[i].style.display='';
			div.forEach(a=>{
				a.style.fontWeight='';
				a.style.background='';
			});
			div[i].style.fontWeight='bold';
			div[i].style.background='#f2f2f2';
		}
		this.menuDiv.forEach((e,i)=>{
			e.addEventListener('click',()=>{
				func(i,this.menuDiv);
			});
			this.menuBottomDiv[i].addEventListener('click',(k)=>{
				func(i,this.menuBottomDiv);
			})
		});

		this.menuDiv[0].click();
		this.menuBottomDiv[0].click();
	}


}