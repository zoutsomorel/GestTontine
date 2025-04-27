/**
 * @param {htmlElement} div
 * @param {object} Presence - attribute du Presence
 * @param {isAdmin} isAdmin
 * @param {historique}

*/

class MainPresence extends Morel_Dom{

	constructor(div,isAdmin){
		super();
		this.div=div;
		isAdmin=isAdmin;
		this.init();
	}

	async init(){
		this.div.innerHTML=this.body();
		this.variable();
		this.sceance=await PresenceApi.getSceance();
		this.membre=await PresenceApi.getMembre();
		this.getChild(this.titre[0],'i')[0].innerText=this.membre.length;
		this.getChild(this.titre[1],'i')[0].innerText=this.sceance.length;
		this.affMembre=new AfficheMembre(this.divPresence,this.membre,this.selectMembre);
		this.addEventMembre();
		this.affDate=new AfficheDatePresence(this.divDatePresence,[this.divDatePresence,this.divTontinePresence],this.sceance);
		this.addEventDate();
	}

	addEventDate(){
		this.affDate.addEventDate().then(async (e)=>{
			const {div,divPopup}=this.divPopup();
			let form=new FormulairePresence(div,await PresenceApi.getMembre());
			form.submitForm().then(e=>{
				if(e){
					let i=this.getChild(this.titre[1],'i')[0]
					i.innerText=parseInt(i.innerText)+1;
					opacityRemove(divPopup);
				}
			});
			this.addEventDate();
		});
	}

	addEventMembre(){
		this.affMembre.addEventMembre().then(e=>{
			this.selectMembre();
			this.addEventMembre();
		})
	}

	variable(){
		this.divPresence=this.getChild(this.div,'divPresence')[0];
		this.divDatePresence=this.getChild(this.div,'divDatePresence')[0];
		this.divTontinePresence=this.getChild(this.div,'divTontinePresence')[0];
		this.titre=this.getChild(this.div,'titre');
	}

	body(){

		return this.balise(this.element('',{},
			[
				component.titre('Membres presents ( <i>0</i> )'),
				this.element('div',{style:";",class:'divPresence w-100'}),'<br/>',
				component.titre('Tontines presence ( <i>0</i> )'),
				this.element('div',{class:'divDatePresence w-100'}),
				this.element('div',{class:'divTontinePresence w-100',style:'display:none'})
			]
		))
	}

	async selectMembre(){
		console.log(this.div);
		const {divPopup,div}=this.divPopup();
		let form=new FormulaireChoixPresence(div,this.membre);
		form.submitForm().then(e=>{
			if(e){
				opacityRemove(divPopup);
				this.membre=e;
				this.affMembre=new AfficheMembre(this.divPresence,e,this.selectMembre);
				this.addEventMembre();
				console.log(e);
				this.getChild(this.titre[0],'i')[0].innerText=this.membre.length;
			}
		})
	}
}

/**
 * @param {htmlElement} div
 * @param {function} getPresence
 * 
*/


/**
 * @param {shmlElement} div
 * @param {object} date
 * @param {function} getTontine
 */


class DatePresence extends Morel_Dom{

	constructor(div,date,divMain){
		super();
		this.date=date;
		if(div){
			this.div=div;
			this.divMain=divMain;
			this.div.innerHTML=this.body();
			this.fa=this.getChild(this.div,'fa');
			this.event();
		}
	}

	body(){

		return this.balise(this.element('',{},
			component.tdAction(this.stringDate(),isAdmin)
		));
	}

	stringDate(){
		return component.stringDate(this.date.date);
	}

	event(){

		// historiaue de reunion

		this.div.addEventListener('click',(e)=>{
			const contains=(el)=>{
				let t=true;
				if(el){
					if(el.contains(e.target)) t=false;
				}
				return t;
			}
			if(contains(this.fa[0]) && contains(this.fa[1]) && contains(this.fa[2])){
				this.fa[0].click();
			}

		},{capture:true})

		if(this.fa[0]){
			this.fa[0].onclick=()=>{
				console.log(this.divMain);
				this.divMain[0].style.display='none';
				this.divMain[1].style.display='';
				new AfficheTontine(this.divMain[1],this.date,PresenceApi.getTontineSceance,isAdmin,this.divMain);
			}
		}

		// modifier une presence
		if(this.fa[1]){
			this.fa[1].onclick=async ()=>{
				const {divPopup,div}=this.divPopup();
				let a=new FormulairePresence(div,await PresenceApi.getMembre(),this.date);
				a.submitForm().then(e=>{
					this.membre.name=e;
					new MembreVue(this.div,this.membre,isAdmin);
					opacityRemove(divPopup);
				});	
			}
		}

		// supprimer une presence
		if(this.fa[2]){
			this.fa[2].onclick=()=>{
				const {divPopup,div}=this.divPopup();
				new FormulaireMembreSupprimer(div,this.membre);
			}
		}
	}

}


class AfficheDatePresence extends Morel_Dom{

	constructor(div,divMain,dateTontine){
		super();
		isAdmin=isAdmin;
		if(div){
			this.divMain=divMain;
			this.dateTontine=dateTontine || PresenceApi.getSceance;
			console.log(this.dateTontine);
			this.div=div;
			this.date={};
			this.div.innerHTML=this.body();
			this.variable();
			if(!Array.isArray(this.dateTontine)) this.putDate();
			else{
				this.listerDate(this.dateTontine);
			}
		}
	}

	variable(){
		this.divDate=this.getChild(this.div,'divDate')[0];
		this.divTontine=this.getChild(this.div,'divTontine')[0];
		this.table=this.getChild(this.div,'table');
		this.btn=this.getChild(this.div,'button')[0];
	}

	body(){
		return this.balise(this.element('',{},
			[
				component.recherche(isAdmin,'Tontiner'),'<br/>',
				component.table(['DATE','ACTION']),
				...[1,1,1,1].map(e=>'<br/>')
			]
		));
	}

	putDate(){
		return new Promise((success)=>{
			this.dateTontine(this.date.id || '').then(e=>{
				this.listerDate(e);
			});
		})
	}

	listerDate(e){
		for(let i=0;i<e.length;i++){
			div=document.createElement('tr');
			div.classList.add('pointer');
			div.style.borderBottom='1px solid #ccc';
			this.table[0].appendChild(div);
			this.date=e[i];
			new DatePresence(div,this.date,this.divMain);
		}
		return div
	}

	addEventDate(){
		return new Promise(
			(success)=>{
				if(this.btn){
					this.btn.onclick=()=>{
						success(true);
					}
				}
			}
		)
	}
}


class Tontine extends Morel_Dom{

	constructor(div,tontine,isAdmin,suppTontine){
		super();
		this.div=div;
		isAdmin=isAdmin;
		this.tontine=tontine || {};
		this.div.innerHTML=this.body();
		this.event();
	}

	body(){
		const nom=this.element('td',{class:'p-2 text-left'},this.tontine.name || 'morel');
		const montant=this.element('td',{style:'white-space:nowrap;',class:'text-center p-2 border-box'},
			[
				this.tontine.montant || 2500,
				isAdmin?this.element('i',{class:'px-2 fa fa-trash text-danger'}):''
			]
		);

		return this.balise(this.element('',{},
			[
				nom,
				montant
			]
		))
	}

	event(){
		let p;
		if(p=this.getChild(this.div,'fa')[0]){
			p.onclick=()=>{
				suppTontine(this.tontine._id).then(e=>{
					if(e) opacityRemove(this.div);
				});
			}
		}
	}
}	

class AfficheTontine extends Morel_Dom{

	constructor(div,date,getTontine,isAdmin,divMain){
		super();
		this.div=div;
		this.divMain=divMain;
		console.log(getTontine);
		this.getTontine=getTontine || PresenceApi.getTontine;
		this.date=date;
		isAdmin=isAdmin;
		this.div.innerHTML=this.body();
		this.variable();
		this.putTontine();
		this.event();
	}

	variable(){
		this.table=this.getChild(this.div,'table')[0];
		this.btnBack=this.getChild(this.div,'back')[0];
	}

	body(){
		return this.balise(this.element('',{},
			[
				component.recherche(false,'Tontiner'),'<br/>',
				// retour
				this.element('div',{class:'flex container-500'},[
					this.element('div',{style:'width:50px',class:'flex-center'},this.element('i',{class:'fa fa-arrow-left back pointer'})),
					this.element('div',{style:'width:calc(100% - 50px)',class:'text-center fw-bold'},(new DatePresence(false,this.date)).stringDate()),
				]),'<br/>',
				component.table(['NOM','MONTANT']),
				'<br/></br></br>'
			]
		))
	}


	putTontine(){
		return new Promise((success)=>{
			this.getTontine(this.date.id || '').then(e=>{
				console.log(e);
				let div;
				for(let i=0;i<e.length;i++){
					div=document.createElement('tr');
					div.classList.add('pointer');
					div.style.borderBottom='1px solid #ccc';
					this.table.appendChild(div);
					this.date=e[i];
					new Tontine(div,this.date,isAdmin,this.divMain);
				}
				success(div);
			});
		})
	}

	event(){
		this.btnBack.onclick=()=>{
			this.divMain[0].style.display='';
			this.divMain[1].style.display='none';
		}
	}

}