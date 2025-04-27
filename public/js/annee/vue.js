/**
 * @param {htmlElement} div
 * @param {object} annee - attribute du annee
 * @param {isAdmin} isAdmin
 * @param {historique}

*/

class AnneeVue extends Morel_Dom{
	static divCheck;

	constructor(div,annee,isAdmin){
		super();
		this.div=div;
		this.isAdmin=isAdmin || false;
		this.annee=annee || {};
		this.div.innerHTML=this.body();
		this.variable();
		this.event();
	}

	variable(){
		this.fa=this.getChild(this.div,'fa');
	}

	body(){
		const nom=this.element('span',{},this.annee.number || 'Morel');
		let tab=[nom];
		tab.push(
			this.element('div',{class:'flex-center h-100'},[
				this.element('div',{class:'px-2'},this.element('input',{attribute:"type='checkbox'",id:'choixAnnee',class:'fa'})),
				...(this.isAdmin?['fa-edit','fa-trash']:[]).map((e,i)=>this.element('i',{class:`pointer ${i==0?'text-primary':'text-danger'} px-2 fa `+e}))
				]
			)
		)

		return this.balise(this.element('',{},
			tab.map(e=>this.element('td',{class:'suspention p-2 border-box text-left'},e))
		))
	}

	event(){

		// histif()
		const checked=(div)=>{
			AnneeApi.choixAnnee(this.annee._id).then(e=>{
				if(AnneeVue.divCheck){
					AnneeVue.divCheck.checked=false;
				}
				div.checked=true;
				AnneeVue.divCheck=div;
			})
		}

		// selectonner l'annee au click de la div
		this.div.addEventListener('click',(e)=>{
			const contains=(el)=>{
				let t=true;
				if(el){
					if(el.contains(e.target)) t=false;
				}
				return t;
			}
			if(contains(this.fa[1]) && contains(this.fa[2])){
				checked(this.fa[0]);
			}

		},{capture:true})


		if(this.fa[0]){
			this.fa[0].onclick=(e)=>{
				checked(e.target);
			}
		}

		if(this.fa[1]){
			this.fa[1].onclick=()=>{
				const {divPopup,div}=this.divPopup();
				let a=new FormulaireAnneeInscrire(div,this.annee,AnneeApi.modifier);
				a.submitForm().then(e=>{
					this.annee.name=e;
					new AnneeVue(this.div,this.annee,this.isAdmin);
					opacityRemove(divPopup);
				});	
			}
		}

		if(this.fa[2]){
			this.fa[2].onclick=()=>{
				const {divPopup,div}=this.divPopup();
				new FormulaireAnneeSupprimer(div,this.annee);
			}
		}
	}

}



/**
 * @param {htmlElemet} div
 * @param {function} annee - qui vas cherche les donnes en bd
*/ 


class MainAnnee extends Morel_Dom{

	constructor(div,isAdmin){
		super();
		this.div=div;
		this.isAdmin=isAdmin;
		this.div.innerHTML=this.body();
		this.variable();
		new AfficheAnnee(this.divannee,AnneeApi.plusAnnee,isAdmin);
	}

	variable(){
		this.divannee=this.getChild(this.div,'divannee')[0];
		this.btnAjouter=this.getChild(this.div,'ajouter')[0];
	}

	body(){
		const ajouter=this.element('div',{class:'w-100 text-right my-2'},
			this.element('button',{class:'btn border-1 border-gray rounded ajouter'},[this.element('i',{class:'fa fa-plus px-2'}),'Ajouter'])
		)

		const recherche=this.element('div',{class:'container-500 bg-white'},
			[
				this.element('div',{class:'flex w-100 rounded-20',style:'border:1px solid #ccc'},[
					this.element('div',{style:'width:40px;padding:0px 0px 0px 20px',class:'flex-center h-auto'},this.element('i',{class:'fa fa-search',style:'opacity:0.7'})),
					this.element('div',{style:'width:calc(100% - 40px)',class:'border-box flex-center justify-content-left'},
						this.element('input',{class:'w-90 border-none p-2 bg-inherit',style:'outline:none',attribute:"placeholder='Recherche'"})
					)
				]),
				this.isAdmin?ajouter:''
			]
		);


		return this.balise(this.element('',{},
			[
				this.element('div',{class:'divannee w-100'})
			]
		))
	}
}
/**
 * @param {htmlElement} div
 * @param {function} getAnnee
 * 
*/

class AfficheAnnee extends Morel_Dom{

	constructor(div,getAnnee,isAdmin){
		super();
		this.div=div;
		this.isAdmin=isAdmin;
		this.div.innerHTML=this.body();
		this.annee={};
		this.getAnnee=getAnnee;
		this.variable();
		this.addAnnee();
		this.event();
	}

	variable(){
		this.table=this.getChild(this.div,'table')[0];
	}

	body(){
		return this.balise(this.element('',{},
			[
				component.recherche(this.isAdmin,'Ajouter'),'<br/>',
				component.table()
			]
		))
	}

	addAnnee(){
		return new Promise((success)=>{
			this.getAnnee(this.annee._id || '').then(e=>{
				let div;
				for(let i=0;i<e.length;i++){
					div=document.createElement('tr');
					div.classList.add('pointer');
					div.style.borderBottom='1px solid #ccc';
					this.table.appendChild(div);
					this.annee=e[i];
					new AnneeVue(div,this.annee,this.isAdmin);
				}
				success(div);
			});
		})
	}

	event(){
		let p;
		if(p=this.getChild(this.div,'button')[0]){
			p.onclick=()=>{
				let div=popup();
				let info=this.getChild(div,'info')[0];
				let d=document.createElement('div');
				info.appendChild(d);
				new FormulaireAnneeInscrire(d,{});
			}
		}
	}
}