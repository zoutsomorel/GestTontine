
class MainTontine extends Morel_Dom{

	constructor(div,isAdmin){
		super();
		this.div=div;
		this.isAdmin=isAdmin;
		this.div.innerHTML=this.body();
		this.variable();
		new AfficheMembre(this.divPresence,MembreApi.plusMembre,this.selectMembre);
		new AfficheDateTontine(this.divDatePresence,[this.divDatePresence,this.divTontinePresence],isAdmin,TontineApi.getDate);
		new AfficheTontines(this.divChoixTontine,isAdmin);
	}

	variable(){
		this.divPresence=this.getChild(this.div,'divPresence')[0];
		this.divChoixTontine=this.getChild(this.div,'divChoixTontine')[0];
		this.divDatePresence=this.getChild(this.div,'divDatePresence')[0];
		this.divTontinePresence=this.getChild(this.div,'divTontinePresence')[0];
	}

	body(){

		return this.balise(this.element('',{},
			[
				component.titre('Choix des tontines'),
				this.element('div',{style:";",class:'divChoixTontine w-100'}),'<br/>',
				component.titre('Membres presents '+500),
				this.element('div',{style:";",class:'divPresence w-100'}),'<br/>',
				component.titre('Tontines '+5000),
				this.element('div',{class:'divDatePresence w-100'}),
				this.element('div',{class:'divTontinePresence w-100',style:'style:display:none'},)
			]
		))
	}

	selectMembre(){
		console.log(this.div);
		const {divPopup,div}=this.divPopup();
		let form=new FormulaireChoixPresence(div,PresenceApi.enregistrer);
		form.submitForm().then(e=>{
			if(e){
				opacityRemove(divPopup);
				console.log(e);
			}
		})
	}
}





class DateTontine extends Morel_Dom{

	constructor(div,date,isAdmin,divMain){
		super();
		this.date=date;
		if(div){
			this.div=div;
			this.divMain=divMain;
			this.isAdmin=isAdmin;
			this.div.innerHTML=this.body();
			this.fa=this.getChild(this.div,'fa');
			this.event();
		}
	}

	body(){

		return this.balise(this.element('',{},
			component.tdAction(this.stringDate(),this.isAdmin)
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
				this.divMain[0].style.display='none';
				this.divMain[1].style.display='';
				new AfficheTontine(this.divMain[1],this.date,TontineApi.getTontine,this.isAdmin,this.divMain);
			}
		}

		// modifier une presence
		if(this.fa[1]){
			this.fa[1].onclick=()=>{
				const {divPopup,div}=this.divPopup();
				let a=new FormulairePresence(div,this.membre,MembreApi.modifier);
				a.submitForm().then(e=>{
					this.membre.name=e;
					new MembreVue(this.div,this.membre,this.isAdmin);
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


class AfficheDateTontine extends Morel_Dom{

	constructor(div,divMain,isAdmin,dateTontine){
		super();
		this.isAdmin=isAdmin;
		if(div){
			this.divMain=divMain;
			this.dateTontine=TontineApi.getDate;
			this.div=div;
			this.date={};
			this.div.innerHTML=this.body();
			this.variable();
			this.putDate();
			this.event();
		}
	}

	variable(){
		this.divDate=this.getChild(this.div,'divDate')[0];
		this.divTontine=this.getChild(this.div,'divTontine')[0];
		this.table=this.getChild(this.div,'table');
	}

	body(){
		return this.balise(this.element('',{},
			[
				component.recherche(this.isAdmin,'Tontiner'),'<br/>',
				component.table(['DATE','ACTION']),
				...[1,1,1,1].map(e=>'<br/>')
			]
		));
	}

	putDate(){
		return new Promise((success)=>{
			this.dateTontine(this.date.id || '').then(e=>{
				let div;
				for(let i=0;i<e.length;i++){
					div=document.createElement('tr');
					div.classList.add('pointer');
					div.style.borderBottom='1px solid #ccc';
					this.table[0].appendChild(div);
					this.date=e[i];
					new DateTontine(div,this.date,this.isAdmin,this.divMain);
				}
				success(div);
			});
		})
	}

	event(){
		let p;
		if(p=this.getChild(this.div,'button')[0]){
			p.onclick=()=>{
				let {divPopup,div}=this.divPopup();
				let a=new FormulairePresence(div,{},PresenceApi.modifier,MembreApi.plusMembre);
				a.submitForm().then(e=>{
					console.log(e);
				});
			}
		}
	}
}


class AfficheTontines extends Morel_Dom{

	constructor(div,isAdmin){
		super();
		this.div=div;
		this.isAdmin=isAdmin;
		this.div.innerHTML=this.body();
		this.variable();
		this.putTontine();
	}

	variable(){
		this.table=this.getChild(this.div,'table')[0];
	}

	body(){
		return this.balise(this.element('',{},
			[
				component.recherche(this.isAdmin,'Ajouter'),'<br/>',
				component.table(['MONTANT','ACTION'],'')
			]
		))
	}

	putTontine(){
		TontineApi.getListeTontine().then(liste=>{
			console.log(liste)
			for(let i=0;i<liste.length;i++){
				let d=document.createElement('tr');
				d.classList.add('py-2','pointer');
				d.style.borderBottom='1px solid #f2f2f2';
				this.table.appendChild(d);
				new Tontin(d,liste[i],this.isAdmin);
			}
		});
	}


}

class Tontin extends Morel_Dom{

	static divCheck;

	constructor(div,tontines,isAdmin){
		super();
		this.div=div;
		this.isAdmin=isAdmin;
		this.tontines=tontines;
		this.div.innerHTML=this.body();
		this.event();
	}

	body(){
		const nom=this.element('span',{},this.tontines.montant || 'Morel');
		let tab=[this.tontines.montant];
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
		this.fa=this.getChild(this.div,'fa');
		// histif()
		const checked=(div)=>{
			AnneeApi.choixAnnee(this.tontines._id).then(e=>{
				if(Tontin.divCheck){
					Tontin.divCheck.checked=false;
				}
				div.checked=true;
				Tontin.divCheck=div;
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
			if(contains(this.fa[0]) && contains(this.fa[1]) && contains(this.fa[2])){
				if(this.fa[0]) this.fa[0].click();
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
