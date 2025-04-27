/**
 * @param {htmlElement} div
 * @param {function} save
 * @param {membre}
 * 
*/


class FormulairePresence extends Morel_Dom{

	constructor(div,getMembre,date){
		super();
		this.div=div;
		this.date=date || {};
		this.isModif=(this.date || {}).date;
		this.div.innerHTML=this.body();
		const cool=this.getChild(this.div,'coo')[0];
		const DivBene=this.getChild(this.div,'bene')[0];
		this.choix=new ChoixMembre(cool,getMembre,'name',[]);
		this.beneficiaire=new ChoixMembre(DivBene,getMembre,'name',[]);
	}

	body(){
		return this.balise(this.element('form',{class:'text-left'},
			[
				component.titre((this.isModif?'Modifier la selection des ':'Selectionner les')+' membres qui ont tontines et les beneficiaires'),
				component.input('Date de la sceance',this.getDate(),'date'),
				this.element('span',{},'Selectionner les membres'),
				this.element('div',{class:'w-100 border-box border-1 border-gray rounded',style:'max-height:22vh;overflow-y:scroll',id:'coo'}),'<br/>',
				this.element('span',{},'Selectionner les Beneficiaire du jour'),
				this.element('div',{class:'w-100 border-box border-1 border-gray rounded',style:'max-height:22vh;overflow-y:scroll',id:'bene'}),
				component.button(this.isModif?'Modifier':'Enregistrer')
			]
		))
	}

	getDate(){
		let d=new Date(this.date.date || Date.now());
		return d.getFullYear()+'-'+(d.getMonth()<10?'0':'')+d.getMonth()+'-'+(d.getDate()<10?'0':'')+d.getDate();
	}

	submitForm(){
		return new Promise((success)=>{
			this.getChild(this.div,'form')[0].onsubmit=(e)=>{
				e.preventDefault();
				let post={
					date:(new Date(this.getChild(e.target,'cool')[0].value)).getTime(),
					idMembre:this.choix.select.map(e=>e._id)
				}

				chargement(this.div,PresenceApi.addSceance()).then(a=>{
					if(typeof(a)!='objet'){
						success(post);
					}
					else{
						message(e.target,a,false,4);
					}
				})
			}
		})
	}
}

// class pour choisir les membres dans une presence

/**
 * @param {htmlElement} div
 * @param {function} enregistrer
 * @param {array} membre
*/ 

class FormulaireChoixPresence extends Morel_Dom{

	constructor(div,membre){
		super();
		this.div=div;
		this.membre=membre || [{name:'Morel'}];
		this.init();
	}

	async init(){
		this.isModif=this.membre.length;
		this.div.innerHTML=this.body();
		this.choix=new ChoixMembre(this.getChild(this.div,'coo')[0],MembreApi.plusMembre,'name',this.membre);
	}

	body(){
		return this.balise(this.element('form',{class:'text-left'},
			[
				component.titre(this.isModif?'Modifier le choix des membres':'Choisir les membres'),
				this.element('div',{class:'py-2'},'Choisir les membres'),
				this.element('div',{id:'coo',class:'text-left',style:'max-height:300px;overflow-y:scroll'}),
				component.button('Enregistrer')
			]
		))
	}

	submitForm(){
		return new Promise(
			(success)=>{
				this.getChild(this.div,'form')[0].onsubmit=(e)=>{
					e.preventDefault();
					let post=this.choix.select.map(e=>e);
					chargement(this.div,PresenceApi.addMembre(post)).then(a=>{
						if(Array.isArray(a)) success(post);
						else message(e.target,a,false,5)
					})
				}
			}
		)
	}
}


class ChoixMembre extends Morel_Dom{

	constructor(div,option,name,select){
		super();
		this.select=select || [{name:'morel'}];
		this.div=div;
		console.log(div);
		this.option=option;
		this.name=name;
		this.option=option;
		this.div.innerHTML=this.body();
		if(!Array.isArray(this.option)){
			this.membre={};
			this.putListe();
		}
		else{
			this.lister(option)
		}
	}

	isPresent(membre){
		let t=false;
		for(let i=0;i<this.select.length;i++){
			let e=this.select[i];
			console.log(e[this.name]);
			console.log(membre[this.name]);
			if(e[this.name]==membre[this.name]){
				t=true;break
			}
		}
		return t;
	}

	liste(e){
		let t=this.isPresent(e);
		return this.balise(this.element('',{},[
			this.element('div',{style:'width:40px',class:'flex-center'},
				this.element('input',{attribute:`type='checkbox' ${t?'checked':''}`,class:'pointer'})
			),
			this.element('div',{style:'width:calc(100% - 40px)',class:'break-word'},this.name?e[this.name] || e:e)
		]))
	}

	body(){
		return this.balise(this.element('',{},
			Array.isArray(this.option)=='object'?this.option.map((e,i)=>{
				return this.element('div',{class:'flex w-100 pointer',style:`background:${i%2==1?'white':'#f2f2f2'}`},this.liste()
				)
			}):''
		))
	}

	putListe(){
		this.option(this.membre._id || 'c').then(liste=>{
			this.lister(liste);
		});
	}

	lister(liste){
		for(let i=0;i<liste.length;i++){
			let d=document.createElement('div');
			d.classList.add('flex','w-100','pointer');
			d.style.background=`${i%2==1?'white':'#f2f2f2'}`;
			d.innerHTML=this.liste(liste[i]);
			let check=this.getChild(d,'input')[0];
			this.div.appendChild(d);
			this.event(d,check,liste[i])
		}
	}

	event(div,check,liste){
		div.addEventListener('click',(e)=>{
			if(!check.contains(e.target)){
				check.click();
			}
		},{capture:true})

		check.onclick=()=>{
			if(check.checked){
				this.select.push(liste);
			}else{
				this.select=this.select.filter(e=>e[this.name]!=liste[this.name])
			}
		}
	}
}