const address='http://localhost:3000';
const xml=new Morel_xml(address);

class Tontines{

	static endPoint='tontines';

	static async inscrire(name,login,passWord){
		let post={
			name:name,
			login:login,
			passWord:passWord
		}
		// let user=(await xml.post(`${this.endPoint}`,{name:name,login:login,passWord:passWord})).data.data;
		let user={_id:'1',hack:'cool'}
		saveUser({...user,...post});
		return user?true:false;
	}

	static async modifier(name,login,passWord){
		let post={
			name:name,
			login:login,
			passWord:passWord
		}
		// let user=(await xml.put(`${this.endPoint}`,{name:name,login:login,passWord:passWord})).data.data;
		let user={_id:'1',hack:'cool'}
		saveUser({...user,...post});
		return user?true:false;
	}
}