/**
 * @param {elementHTML} div 
 * @param {function} func
 * @param {function} actu - qui vas s'executer lors de la soumission du formulaire
 * 
*/

class FormulaireAnneeInscrire extends Morel_Dom{

	constructor(div,annee,func){
		super();
		this.div=div;
		this.annee=annee || {};
		this.isMod=this.annee.number;
		alert(this.isMod);
		this.func=func;
		this.div.innerHTML=this.body();
		this.variable();
		MembreApi.plusMembre().then(a=>{
			this.select=new ChoixMembre(this.divChoixMembre,a,'name');
		});
	}

	variable(){
		this.divChoixMembre=this.getChild(this.div,'divChoixMembre')[0];
	}	

	body(){
		const titre=this.element('h4',{class:'text-center'},this.isMod?'Modifier l\'annee '+this.annee.number:'Ajouter une annee');
		const input=this.element('div',{},
			[
				this.element('span',{},this.isMod?'Nouvelle annee':'Annee'),'<br/>',
				this.element('input',{
					id:'cool',
					class:'w-100 rounded border p-2 my-1 form-control',
					attribute:`placeholder='${this.mod?'Nouvelle annee':'Annee'}' required type='number'`,
					text:this.annee.number || ''
				},'')
			]
		);

		const btn=this.element('div',{class:'w-100 text-right my-2'},
			this.element('button',{class:'btn bg-primary text-white'},this.isMod?'Modifier':'Ajouter')
		);

		const help=this.element('div',{class:'w-100 flex-center justify-content-right text-danger',style:'font-size:13px'},
			[
				this.element('div',{style:'width:30px',class:'flex-center'},this.element('i',{class:'fa fa-circle-info px-1'})),
				this.element('div',{class:'text-left'},
					'chaque ligne enregistre un membre et la limite est de 10 membres'
				)
			]
		)

		return this.balise(this.element('form',{class:'text-left'},
			[
				titre,'<br/>',
				input,
				this.element('div',{class:'my-2'},'Choisir les membres'),
				this.element('div',{style:'height:300px;overflow-y:scroll;border:1px solid #f2f2f2',class:'w-100 p-2 rounded border-box border-1 border-gray',id:'divChoixMembre'}),
				btn
			]
		))
	}

	submitForm(){
		return new Promise((success)=>{
			let input=this.getChild(this.div,'cool')[0];
			this.getChild(this.div,'form')[0].onsubmit=(e)=>{
				e.preventDefault();
				chargement(this.div,this.func(input.value)).then(a=>{
					if(a){
						success(input.value);
					}
					else{
						message(e.target,'Membre existant',false,4);
					}
				})
			}
		})
	}
}


/**
 * @param {htmlElement} div
 * @param {array} option
 * 
 * 
 */




class FormulaireAnneeSupprimer extends Morel_Dom{

	constructor(div,membre,func,actu){
		super();
		this.div=div;
		this.membre=membre;
		this.div.innerHTML=this.balise(this.body());
	}

	body(){
		return this.element('',{},
			[
				this.element('h4',{class:'text-center text-center',formater:true},'Voulez-vous supprimer l\'annee ~~'+this.annee.number+'~~ et toute ces tontines ?'),
				this.element('div',{class:'w-100 flex-center'},
					[['Oui','danger'],['Non','primary']].map(e=>this.element('div',{class:'px-2'},this.element('button',{class:'btn text-white bg-'+e[1],style:'min-width:100px'},e[0])))
				)
			]
		)
	}
}