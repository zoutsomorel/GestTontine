
/**
 *@param {elementHtml} div - qui contenir la vue du squellete du profil
 *@param {string} info - ce vas contenir le profil par defaut 
*/

class Profil extends Morel_Dom{

	constructor(div,reunion){
		super();
		this.div=div;
		this.info=reunion;
		this.div.innerHTML=this.body();
		this.variable();
		this.event();
	}

	variable(){
		this.divInfo=this.getChild(this.div,'info')[0];
		this.divMembre=this.getChild(this.div,'membre')[0]
		this.divAnnee=this.getChild(this.div,'annee')[0];
		this.btnEdit=this.getChild(this.div,'fa-edit')[0];
	}

	body(){
	
		return this.balise(this.element('',{},
			[
				...[['Info de la tontine','info'],['Membre de la Tontine','membre'],["Choix de l'Annee",'annee']].map(
					(e,i)=>{
						return this.element('',{},
							[
								component.titre(e[0]),'<br/>',
								i==0?this.htmlInfo():this.element('div',{id:e[1]}),'<br/>'
							]
						)
					}
				)
			]
		))
	}

	htmlInfo(){
		const info=(titre,value)=>{
			if(!value) return '';
			return this.element('tr',{},
				[
					this.element('td',{class:'fw-bold p-2 text-left w-50',style:'vertical-align:middle'},titre),
					this.element('td',{class:'p-2 text-right w-50',style:'vertical-align:middle'},value),
					(titre.indexOf('Nom')!=-1 && isAdmin)?this.element('td',{class:'text-center',attribute:"rowspan='3'",style:'vertical-align:middle;width:40px'},
						this.element('i',{class:'fa fa-edit pointer'})
					):''
				]
			)
		}

		return this.element('div',{id:'info',class:'container-500 text-left border-box px-2'},
			this.element('table',{style:'table-layout:fixed;background:linear-Gradient(58deg,#f8f8f8,#f2f2f2,#ccc)',class:'w-100 rounded p-2 border-box'},
				[['Nom de la tontine',this.info.name],['Nbrs Membre',10],['Annee courante',2024]].map(e=>info(...e))
			)
		)
	}

	event(){
        if(this.btnEdit){
            this.btnEdit.onclick=()=>{
                let div=popup();
                let info=this.getChild(div,'info')[0];
                info.style.background="linear-Gradient(58deg,white,#f2f2f2,#ccc)";
                let di=document.createElement('div');
                info.appendChild(di);
                let a=new FormulaireCreerReunion(di,this.info);
                a.submitForm().then(post=>{
                    main();
                })
            }
        }
	}
}