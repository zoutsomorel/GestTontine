/**
 * @param 
 * 
*/

class PresenceApi{

	static xml=new Morel_xml(address+'/presence');

	static id(t=true){
		return (t?'/':'')+annee._id+'/'+reunion._id
	}

	// ajouter les membres
	static async addMembre(membres=[]){
		// let query=(this.xml.post(this.id(false),{membres:membres})).data.data;
		let query=membres;
		return query;
	}

	// j'obtient les membres de la presence
	static async getMembre(){
		// let query=(await this.xml.get('membre/'+this.id())).data.data;
		let query=await MembreApi.plusMembre('c');
		query.pop();
		query.pop();
		query.pop();
		query.pop();
		query.shift();
		return query;
	}

	// j'ajouter la sceance
	static async addSceance(post={}){
		// let query=(await this.xml.post('sceance/'+this.id(),posst)).data.data;
		let query=post;
		return query;
	}

	// j'obtient les sceances de la presence
	static async getSceance(){
		// let query=(await this.xml.get('sceance/'+this.id())).data.data;
		let query=[
			{
				date:Date.now() - 24*60*60*1000
			},
			{
				date:Date.now() - 2*24*60*60*1000
			}
		];
		return query;
	}

	// j'obtient les tontines durant une sceance
	static async getTontineSceance(idSceance){
		// let query=(await this.xml.get('tontine/'+idSceance+this.id())).data.data;
		let query=[
			{
				montant:1000,
				name:'Morel',
			},
			{
				montant:3000,
				name:'Gedeons'
			}
		];
		return query;
	}



	static async modifier(id){
		return true;
	}

	/**
	 * @param {array} idMembre
	 * @return {bol}
	 */

	static async enregistrer(idMembre){
		return true;
	}
}