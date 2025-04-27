class Membre{

	static endPoint='membre';

	static async connexion(login,passWord){
		// verifier
		// let user=(await xml.post(`${endPoint}/verifier`,{login:login.toLowerCase()})).data.data;
		let user={_id:1,hack:'10'}
		saveUser(user);
		return user;
	}

	static async authentification(idUser,hack){
		// let user=(await xml.post(`${endPoint}/authentification`,{idUser:idUser,hack})).data.data;
		let user={_id:'1',hack:'10'}
		saveUser(user);
		return user;
	}
}