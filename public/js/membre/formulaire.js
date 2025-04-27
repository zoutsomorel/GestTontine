/**
 * @param {elementHTML} div 
 * @param {function} func
 * @param {function} actu - qui vas s'executer lors de la soumission du formulaire
 * 
*/

class FormulaireMembreInscrire extends Morel_Dom{

	constructor(div,membre){
		super();
		this.div=div;
		this.membre=membre || {};
		console.log(this.balise);
		this.div.innerHTML=this.body();
	}

	body(){

		return this.balise(this.element('form',{class:'text-left'},
			[
				component.titre(this.membre.name?'Modifier le membre '+this.membre.name:'Ajouter un ou des membre(s)'),
				component.input(this.membre.name?'Nouveau Nom et prenom':'Nom(s) et prenom(s) de(s) membre(s)',this.membre.name,'',!this.membre.name?'textarea':'input'),
				!this.membre.name?component.helpInfoInput():'',
				component.button()
			]
		))
	}

	submitForm(){
		return new Promise((success)=>{
			let input=this.getChild(this.div,'cool')[0];
			this.getChild(this.div,'form')[0].onsubmit=(e)=>{
				e.preventDefault();
				let post=this.membre.name?input.value:input.value.split('/n');
				chargement(this.div,Membre.Api()).then(a=>{
					if(type==Array.isArray(a)){
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


class FormulaireMembreSupprimer extends Morel_Dom{

	constructor(div,membre){
		super();
		this.div=div;
		this.membre=membre;
		this.div.innerHTML=this.balise(this.body());
	}

	body(){
		return this.element('',{},
			[
				this.element('h4',{class:'text-center text-center',formater:true},'Voulez-vous supprimer le membre ~~'+this.membre.name+'~~ et toute ces tontines ?'),
				this.element('div',{class:'w-100 flex-center'},
					[['Oui','danger'],['Non','primary']].map(e=>this.element('div',{class:'px-2'},this.element('button',{class:'btn text-white bg-'+e[1],style:'min-width:100px'},e[0])))
				)
			]
		)
	}

	submitForm(){
		return new Promise(
			(success)=>{
				let btn=this.getChild(this.div,'button');
				btn[0].onclick=()=>{
					Membre.supprimer(this.membre._id).then(e=>{
						success(e);
					});
				}

				btn[1].onclick=()=>{
					success(false);
				}
			}
		
		)
	}
}