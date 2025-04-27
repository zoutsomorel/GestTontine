/**
 * @param 
 * 
*/

class MembreApi{

	static xml=new Morel_xml(address+'/membre/');

	static get id(){
		return '/'+reunion._id;
	}

	static getMembre(idMembre){
		// let query=(this.xml.get(id+this.id)).data.data;
		let query=true;
		return query;
	}

	// fonction qui renvoi 100 membre a partir de l'id mis en parametre;
	static async plusMembre(id){
		// let query=(await this.xml('/plusMembre'+id+this.id)).data.data;
		
		let query= [
			{
				name:'oumarou'	
			},
			{
				name:'Gaspar'	
			},
			{
				name:'Morel zoutso'	
			},
			{
				name:'Moustapha oumarou'	
			},
			{
				name:'Liko'	
			},{
				name:'Morel'	
			},{
				name:'kiko'	
			},{
				name:'Histoire'	
			},{
				name:'Grace'	
			},{
				name:'Loal'	
			},{
				name:'kabrel'	
			},{
				name:'Christophe'	
			},{
				name:'Morel'	
			},{
				name:'antoine'	
			},{
				name:'Jeremie'	
			},
		];
		if(!id) query=[];
		return query;
	}

	// permet resortir tout les mouvement financier d'un membre durant une annee
	static async historique(idMembre,idAnnee){
		if(!this.hist) this.hist={};
		// let query=(this.xml.get('historique/'+idMembre+'/'+idAnnee+this.id,{})).data.data;
		let query={};
		return 'cool';
	}

	static async modifier(id){
		return true;
	}

	static async enregistrer(post=[]){
		// post=(await this.xml.post('',post)).data.data
		return post;
	}

	static async supprimer(idMembre){
		let query=true;
		// let query=(await this.xml.delete('',{idMembre:idMembre})).data.data;
		return query;
	}
}