class TontineApi{

	static async getDate(idAnnee){

		return [
			{
				date:Date.now() - 30*24*60*60*1000
			},
			{
				date:Date.now() - 60*24*60*60*1000
			},
			{
				date:Date.now() - 660*24*60*60*1000
			}
		]
	}

	static async getListeTontine(){
		return [
			{
				montant:5000
			},
			{
				montant:3000
			}
		]
	}

	static async getTontine(idDate){
		return [
			{
				montant:5000,
				name:'morela'
			},
			{
				montant:5000,
				name:'morel'
			},
			{
				montant:500,	
				name:'Bam'
			}
		]
	}
}