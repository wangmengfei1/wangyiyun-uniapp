import {baseUrl} from './config.js';

export function topList(){
	return new Promise(function(resolve,reject){
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				let result = res.data.list;
				result.length = 4;
				resolve(result);
				
			},
			fail: (err) => {
				console.log(err);
			},
			complete: () => {}
		})
	})
}
//获取榜单详情列表
export function getList(e){
	 return new Promise(function(resolve,reject){
		 uni.request({
		 	url: `${baseUrl}/playlist/detail?id=` + e,
		 	method: 'GET',
		 	success: res => {
		 		resolve(res);
		 	},
		 	fail: (err) => {
		 		console.log(err);
		 	},
		 	complete: () => {}
		 })
	 })
}

// 获取歌曲详情
export function getSongDetail(songId){
	return uni.request({
		url: `${baseUrl}/song/detail?ids=${songId}`,
		method: 'GET'
	});
}

//关联推荐歌曲
export function songSimi(songId){
	return uni.request({
		url: `${baseUrl}/simi/song?id=${songId}`,
		method: 'GET'
	});
}

//评论
export function songComment(songId){
	return uni.request({
		url: `${baseUrl}/comment/music?id=${songId}`,
		method: 'GET'
	});
}

//歌词
export function songLyric(songId){
	return uni.request({
		url: `${baseUrl}/lyric?id=${songId}`,
		method: 'GET'
	});
}

//歌曲mp3
export function songUrl(songId){
	return uni.request({
		url: `${baseUrl}/song/url?id=${songId}`,
		method: 'GET'
	});
}


//搜索热词
export function searchHot(){
	return uni.request({
		url: `${baseUrl}/search/hot/detail`,
		method: 'GET'
	});
}

// 搜索结果
export function searchWord(word){
	return uni.request({
		url: `${baseUrl}/search?keywords=${word}`,
		method: 'GET'
	});
}

//下拉提示
export function searchSuggest(word){
	return uni.request({
		url: `${baseUrl}/search/suggest?keywords=${word}&type=mobile`,
		method: 'GET'
	});
}