/**
 * @param 
 * 
*/

class AnneeApi{

	static endPoint='membre';

	static getAnnee(id){

	}

	static async plusAnnee(id){
		let tab=[1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
		return tab.map((e,i)=>{
			return {
				number:2000+i
			}
		})
	}


	static async choixAnnee(idAnnee){
		return 'cool';
	}


	static async modifier(id){
		return true;
	}
}