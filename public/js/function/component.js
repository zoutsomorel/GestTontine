class Component extends Morel_Dom{

	recherche(isAdmin,text=''){
		const ajouter=this.element('div',{class:'w-100 text-right my-2'},
			this.element('button',{class:'btn border-1 border-gray rounded ajouter'},[this.element('i',{class:'fa fa-plus px-2'}),`${text || 'selectionner'}`])
		)

		const recherche=this.element('div',{class:'container-500 bg-white'},
			[
				this.element('div',{class:'flex w-100 rounded-20',style:'border:1px solid #ccc'},[
					this.element('div',{style:'width:40px;padding:0px 0px 0px 20px',class:'flex-center h-auto'},this.element('i',{class:'fa fa-search',style:'opacity:0.7'})),
					this.element('div',{style:'width:calc(100% - 40px)',class:'border-box flex-center justify-content-left'},
						this.element('input',{id:'search',class:'w-90 border-none p-2 bg-inherit',style:'outline:none',attribute:"placeholder='Recherche'"})
					)
				]),
				isAdmin?ajouter:''
			]
		);
		return recherche	
	}

	titre(titre){
		return this.element('h4',{
			id:'titre',
			class:'family-morel text-left fw-bold',
			style:'font-size:20px;width:calc(100% - 10px);padding:5px 0px 10px 0px;margin-left:5px;border-bottom:1px solid #ccc',
			attribute:"align='center'"
		},titre)
	}

	table(menu,el=''){
		menu=menu || ['NOM','ACTION'];

		return this.element('div',{style:'max-height:300px;overflow-y:scroll;background:linear-Gradient(58deg,#f8f8f8,#f2f2f2,#ccc)'},this.element('table',{class:'',style:'table-layout:fixed',class:'container-500'},
			[
				this.element('tr',{style:'border-bottom:1px solid #ccc',class:'pointer sticky-top bg-white p-2 border-box'},
					menu.map((e,i)=>this.element('th',{class:i==(menu.length-1)?'text-center':'text-left'},e))
				),
				...(Array.isArray(el)?el:[el])
			]
		));
	}

	tdAction(value,isAdmin){
		let tab=[];
		if(!Array.isArray(value)) value=[value];
		value.forEach(e=>tab.push(this.element('span',{},e || 'Morel')));
		tab.push(
			this.element('div',{class:'flex-center h-100'},
				(isAdmin?['fa-list','fa-edit','fa-trash']:['fa-list']).map((e,i)=>this.element('i',{class:`pointer ${i==0?'text-dark':i==1?'text-primary':'text-danger'} px-2 fa `+e}))
			)
		)

		return this.balise(this.element('',{},
			tab.map(e=>this.element('td',{class:'suspention p-2 border-box text-left'},e))
		))
	}

	input(placeholder='Nom(s) et prenom(s) de(s) membre(s)',value='',type='text',bal='input'){
		return this.balise(this.element('div',{class:'py-2'},
			[
				this.element('span',{},placeholder),'<br/>',
				this.element(bal,{
					id:'cool',
					class:'w-100 rounded border p-2 my-1 form-control',
					attribute:`type='${type}' placeholder='${placeholder}' required`,
					text:value || ''
				},'')
			]
		));
	}

	stringDate(date){
		let mois=['janvier','fevrier','Mars','avril','mai','juin','jullet','Aout','septembre','octobre','novembre','decembre'];
		let d=new Date(date || Date.now());
		return (d.getDate()<10?'0':'')+d.getDate()+" "+mois[d.getMonth()]+" "+d.getFullYear()
	}

	button(text='Ajouter'){
		return this.balise(this.element('div',{class:'w-100 text-right my-2'},
			this.element('button',{class:'btn bg-primary text-white'},text)
		));
	}

	helpInfoInput(message='chaque ligne enregistre un membre et la limite est de 10 membres'){
		const help=this.element('div',{class:'w-100 flex-center justify-content-right text-danger',style:'font-size:13px'},
			[
				this.element('div',{style:'width:30px',class:'flex-center'},this.element('i',{class:'fa fa-circle-info px-1'})),
				this.element('div',{class:'text-left'},
					message	
				)
			]
		);
		return this.balise(help);
	}
}