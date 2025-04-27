/**
	Vas permettre de se connecter a une tontine
	parammetre
	* @param {selectedElement} div - element ou seras mis le formulaire
	* @param {function} connexion - function qui renvoi une promesse pour permettre de se connecter
	* @param {string} classe - liste des classes qui vont s'ajouter au formulaire
*/

class FormulaireConnexionReunion extends Morel_Dom{

	constructor(div){
		super();
		this.div=div;
		this.div.innerHTML=this.body();
	}

	body(){
		const titre=this.element('h4',{class:'text-center'},'Connexion à votre tontine');

		const input=this.element('div',{},
			[['Login',''],['Mot de passe','passWord']].map(e=>this.element('div',{class:'my-2'},
				[
					this.element('span',{},e[0]),'<br/>',
					this.element('input',{
						class:'w-100 rounded border p-2 my-1 form-control',
						attribute:`placeholder='${e[0]}' type='${e[1]}' required`
					},'')
				]
			))
		);

		const btn=this.element('div',{class:'w-100 text-right'},
			this.element('button',{class:'btn bg-primary text-white'},'Se connecter')
		)
		return this.balise(this.element('form',{class:'p-10 rounded shadow text-left w-100',attribute:"align='center'"},
			[
				titre,
				input,
				btn,
				this.element('a',{class:'text-primary text-underline pointer',id:'link'},'Creer une tontine')
			]
		))
	}

	submitForm(){
        return new Promise(
            (success)=>{
                let input=this.getChild(this.div,'input');
                this.getChild(this.div,'form')[0].onsubmit=(e)=>{
                    e.preventDefault();
                    let post={};
                    ['login','passWord'].forEach((e,i)=>post[e]=input[i].value);
                    chargement(this.div,ReunionApi.connexion(post)).then(e=>{
                        success(post);
                    });
                }
                this.getChild(this.div,'link')[0].onclick=()=>{
                    let a=new FormulaireCreerReunion(this.div);
                    a.submitForm().then(post=>{
                        success(post);
                    })
                }
            }
        )
	}
}

/**
 * @param {htmlElement} div
 * @param {function} inscription
 * @param {string} classe
 * @param {string} titre 
*/


class FormulaireCreerReunion extends Morel_Dom{

	constructor(div,reunion){
		super();
		this.reunion=reunion || {};
		this.div=div;
		this.div.innerHTML=this.body();
	}

	body(){
		const titre=this.element('h4',{class:'text-center'},this.reunion.name?'Modifier la tontine '+this.reunion.name:'Creer une tontine');

		const input=this.element('div',{},
			[['Nom de la tontine','',this.reunion.name],['Login de la tontine','',this.reunion.login],['Mot de passe des membres','passWord',this.reunion.passWord],['Confirmer le mot de passe','passWord'],['Mot de passe de l\'admin','passWord',this.reunion.passWordAdmin],['Confirmer le mot de passe','passWord']].map(e=>this.element('div',{class:'my-2'},
				[
					this.element('span',{},e[0]),'<br/>',
					this.element('input',{
						class:'w-100 rounded border p-2 my-1 form-control',
						attribute:`placeholder="${e[0]}" type='${e[1]}' required`,
						text:e[2] || ''
					},'')
				]
			))
		);

		const btn=this.element('div',{class:'w-100 text-right'},
			this.element('button',{class:'btn bg-primary text-white',style:'min-width:100px'},this.reunion.name?'Modifier':'Creer')
		)
		return this.balise(this.element('form',{class:'p-10 rounded shadow text-left w-100 mx-0',attribute:"align='center'"},
			[
				titre,
                this.element('div',{class:'error'}),
				input,
				btn,'<br/>',
				this.reunion.name?'':this.element('a',{class:'text-primary text-underline pointer',id:'cool'},'Se connecter a votre tontine')
			]
		))
	}

	submitForm(){
        return new Promise((success)=>{
            let divError=this.getChild(this.div,'error')[0];
            let input=this.getChild(this.div,'input');
            const verif=(form)=>{
                let t=true;
                if(input[2].value!=input[3].value){
                    t=false;
                    message(divError,'Mot de passe different',false,5);
                }

                if(input[4].value!=input[5].value){
                    t=false;
                    message(divError,'Mot de passe different',false,5);
                }
                return t;
            }

            this.getChild(this.div,'form')[0].onsubmit=(e)=>{
                e.preventDefault();
                if(verif(e.target)){
                    let post={};
                    ['name','login','passWord','c','passWordAdmin',''].forEach((e,i)=>post[e]=input[i].value);
                    chargement(this.div,ReunionApi.creer(post)).then(a=>{
                        if(a){
                           success(post)
                        }else{
                            message(e.target,'Login existe deja',false,5);
                        }
                    })
                }
            }

            let p;
            if(p=this.getChild(this.div,'cool')[0]){
                p.onclick=()=>{
                    let a=new FormulaireConnexionReunion(this.div);
                    a.submitForm().then(post=>{success(post)})
                }
            }
        });
		
	}
}