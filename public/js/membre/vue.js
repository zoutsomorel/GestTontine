/**
 * @param {htmlElement} div
 * @param {object} membre - attribute du membre
 * @param {isAdmin} isAdmin
 * @param {historique}

*/

class MembreVue extends Morel_Dom{

	constructor(div,membre){
		super();
		this.div=div;
		this.membre=membre;
		this.div.innerHTML=this.body();
		this.variable();
		this.event();
	}

	variable(){
		this.fa=this.getChild(this.div,'fa');
	}

	body(){
		return component.tdAction(this.membre.name,isAdmin);
	}

	event(){

		// historiaue de reunion
		if(this.fa[0]){
			this.fa[0].onclick=()=>{
				MembreApi.historique(this.membre._id).then(e=>{
					alert(this.membre.name);	
				})
			}
		}

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

		if(this.fa[1]){
			this.fa[1].onclick=()=>{
				const {divPopup,div}=this.divPopup();
				let a=new FormulaireMembreInscrire(div,this.membre);
				a.submitForm().then(e=>{
					this.membre.name=e;
					new MembreVue(this.div,this.membre);
					opacityRemove(divPopup);
				});	
			}
		}

		// action du button pour supprimer un membre
		if(this.fa[2]){
			this.fa[2].onclick=()=>{
				const {divPopup,div}=this.divPopup();
				let form=new FormulaireMembreSupprimer(div,this.membre);
				form.submitForm().then(e=>{
					if(e=='sortir') opacityRemove(divPopup);
					else{
						if(e==true){
							opacityRemove(divPopup);
						}else{	
							message(div,e,false,5);
						}
					}
				})
			}
		}
	}

}



/**
 * @param {htmlElemet} div
 * @param {function} membre - qui vas cherche les donnes en bd
*/ 


class MainMembre extends Morel_Dom{

	constructor(div){
		super();
		this.div=div;
		this.init();
	}

	init(){
		this.div.innerHTML=this.body();
		this.variable();
		this.affMembre=new AfficheMembre(this.divMembre,MembreApi.plusMembre);
		this.addEventMembre();
	}

	addEventMembre(){
		this.affMembre.addEventMembre().then(e=>{
			this.event();
		})
	}

	variable(){
		this.divMembre=this.getChild(this.div,'divMembre')[0];
	}

	body(){
		return this.balise(this.element('',{},
			[
				this.element('div',{class:'divMembre w-100'})
			]
		))
	}

	event(){
		const {divPopup,div}=this.divPopup();
		let a=new FormulaireMembreInscrire(div,{});
		a.submitForm().then(e=>{
			opacityRemove(divPopup);
		})
	}
}
/**
 * @param {htmlElement} div
 * @param {function} getMembre
 * 
*/

class AfficheMembre extends Morel_Dom{

	constructor(div,getMembre){
		super();
		this.div=div;
		this.div.innerHTML=this.body();
		this.membre={};
		this.getMembre=getMembre;
		this.variable();
		if(typeof(this.getMembre)=='function') this.execAddMembre();
		else this.add(this.getMembre);
	}

	addEventMembre(){
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

	variable(){
		this.table=this.getChild(this.div,'table')[0];
		this.btn=this.getChild(this.div,'button')[0];
	}

	body(){
		return this.balise(this.element('',{},
			[
				component.recherche(isAdmin,'Ajouter'),'<br/>',
				component.table()
			]
		))
	}

	addMembre(){
	
		return new Promise((success)=>{
			this.getMembre(this.membre._id || 'c').then(e=>{
				success(this.add(e));
			});
			
		})
	}

	add(e){
		let div;
		for(let i=0;i<e.length;i++){
			div=document.createElement('tr');
			div.classList.add('pointer');
			div.style.borderBottom='1px solid #ccc';
			this.table.appendChild(div);
			this.membre=e[i];
			new MembreVue(div,this.membre,isAdmin);
		}
		return div;
	}

	async execAddMembre(){
		let div=await this.addMembre();
		console.log(div);
		if(!this.observer){
			this.observer=new IntersectionObserver(async (entries) => {
				entries.forEach(async (entry) => {
					if (entry.isIntersecting) {
						let id=this.membre._id;
						div=await this.addMembre();
						if(id!=this.membre && div) this.observer.observe(div)
					}	
				});
			},{ threshold: 0.5 });
		}
		this.observer.observe(div);
	}
}