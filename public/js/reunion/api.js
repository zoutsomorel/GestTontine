/**
    cette communique avec la base de donne et charge d'effectuer les operations lies a la reunion qui sont
*/
const address='localhost:3000';

class ReunionApi{

    static xml=new Morel_xml(address+'/reunion');

    static async creer(post){
        // communication avec le serveur
        // post=(await this.xml.post('',{})).data.data
        return post;
    }


    static async modifier(idReunion,post={}){
        // post=(await this.xml.put('',{...post,idReunion:idReunion})).data.data
        return post;
    }

    static async supprimer(idReunion){
        let query=true;
        // let query=(await this.xml.delete('',{idReunion:idReunion})).data.data;
        return query;
    }

    static async connexion(post){
        // post=(await this.xml.post('',post)).data.data
        return post;
    }
}