import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		topListId: [],
		nextId: ''
	},
	mutations: {
		INIT_TOPLISTID(state,payload){
			state.topListId = payload;
		},
		NEXT_ID(state,payload){
			for(var i = 0; i < state.topListId.length; i ++){
				if(state.topListId[i].id == payload){
					if(i < state.topListId.length - 1){
						state.nextId = state.topListId[i+1].id;
					}else{
						state.nextId = '';
					}
				}
			}
		}
	}
})