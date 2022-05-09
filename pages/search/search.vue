<template>
	<view class="search">
		<musichead title="搜索" :icon="true" :iconblack="true"></musichead>
		<view class="container">
			<scroll-view scroll-y="true" >
				<view class="search-search">
					<text class="iconfont iconsearch"></text>
					<input type="text" placeholder="搜索歌曲" v-model="searchWord" @confirm="handleToSearch" @input="handleToSuggest">
					<text v-show="searchType !== 1" @tap="handleToClose" class="iconfont iconguanbi"></text>
				</view>
				
				<block v-if="searchType == 1">
					<view class="search-history">
						<view class="search-history-head">
							<text>历史记录</text>
							<text class="iconfont iconlajitong" @tap="clearHistory"></text>
						</view>
						<view class="search-history-list">
							<view v-for="(item,index) in searchHistory" :key="index" @tap="handleToWord(item)">{{item}}</view>
						</view>
					</view>
					
					<view class="search-hot">
						<view class="search-hot-title">热搜榜</view>
						<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index" @tap="handleToWord(item.searchWord)">
							<view class="search-hot-top">{{index+1}}</view>
							<view class="search-hot-word">
								<view>
									{{item.searchWord}} <image :src="item.iconUrl" mode="aspectFit"></image> 
								</view>
								<view>{{item.content}}</view>
							</view>
							<text class="search-hot-count">{{item.score}}</text>
						</view>
					</view>
				</block>
				
				<block v-else-if="searchType == 2">
					<view class="search-result">
						<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
							<view class="search-result-word">
								<view>{{ item.name }}</view>
								<view>{{ item.artists[0].name }} - {{ item.album.name }}</view>
							</view>
						<text class="iconfont iconbofang"></text>
						</view>
					</view>
				</block>
						
				<block v-else-if="searchType == 3">
					<view class="search-suggest">
						<view class="search-suggest-title">搜索"{{ this.searchWord }}"</view>
						<!-- <view class="search-suggest-item">
							<text class="iconfont iconsearch"></text>
							少年抖音
						</view> -->
						<view class="search-suggest-item" v-for="(item,index) in suggestList" :key="index" @tap="handleToWord(item.keyword)">
							<text class="iconfont iconsearch"></text>
							{{ item.keyword }}
						</view>
					</view>
				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import '@/common/iconfont.css'
	import {searchHot,searchWord,searchSuggest} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot: [],
				searchWord: '',
				searchHistory: [],
				searchType: 1,
				searchList: []
			}
		},
		onLoad(){
			searchHot().then(res => {
				if(res[1].data.code == 200){
					this.searchHot = res[1].data.data;
					console.log(this.searchHot);
				}
				
			})
			
			uni.getStorage({
				key:'searchHistory',
				success: res => {
					this.searchHistory = res.data;
				}
			})
		},
		components:{
			musichead
		},
		methods: {
			//点击热搜榜把搜索词填入搜索框
			handleToWord(e){
				this.searchWord = e;
				this.handleToSearch();
			},
			//点击回车搜索
			handleToSearch(){
				this.searchHistory.unshift(this.searchWord);
				this.searchHistory = [...new Set(this.searchHistory)];
				if(this.searchHistory.length > 10){
					this.searchHistory.length = 10;
				}
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory
				})
				this.getSearchList(this.searchWord);
			},
			//清除历史记录
			clearHistory(){
				uni.removeStorage({
					key: 'searchHistory',
					success: res => {
						this.searchHistory = [];
					}
				})
			},
			
			//获取搜索结果列表
			getSearchList(word){
				searchWord(word).then((res)=>{
					if(res[1].data.code == '200'){
						this.searchList = res[1].data.result.songs;
						console.log(this.searchList);
						this.searchType = 2;
					}
				});
			},
			
			// 点击搜索框关闭x
			handleToClose(){
				this.searchWord = '';
				this.searchType = 1;
			},
			
			handleToSuggest(ev){
				let value = ev.detail.value;
				if(!value){
					this.searchType = 1;
					return;
				}
				searchSuggest(value).then((res)=>{
					if(res[1].data.code == '200'){
						this.suggestList = res[1].data.result.allMatch;
						this.searchType = 3;
					}
				});
			},
			
			handleToDetail(songId){
				console.log(songId);
				uni.navigateTo({
					url: '/pages/detail/detail?songid='+songId
				});
			}
		}
	}
</script>
	
<style scoped>
	.search-search{
		display: flex; 
		align-items: center; 
		height: 70rpx; 
		margin: 70rpx 30rpx 30rpx 30rpx;
		background-color: #f7f7f7;
		border-radius: 50rpx;
	}
	.search-search text{
		font-size: 26rpx;
		margin-right: 26rpx;
		margin-left: 28rpx;
	}
	.search-search input{
		font-size: 28rpx;
		flex: 1;
	}
	
	.search-history{margin: 0 30rpx; font-size: 26rpx;}
	.search-history-head{display: flex; justify-content: space-between;}
	.search-history-list{ display: flex; margin-top: 36rpx; flex-wrap: wrap;}
	.search-history-list view{ padding: 20rpx 40rpx; background: #f7f7f7; border-radius: 50rpx; margin-right: 30rpx; margin-bottom: 20rpx;}
	
	.search-hot{margin: 30rpx 30rpx; font-size: 26rpx; color: #bebebe;}
	.search-hot-title{}
	.search-hot-item{ display: flex; align-items: center; margin-top: 40rpx;}
	.search-hot-top{ width: 60rpx; color: #fb222f; font-size: 34rpx;}
	.search-hot-word{flex: 1;}
	.search-hot-word view:nth-child(1){ font-size: 30rpx; color: black;}
	.search-hot-word image{ width: 48rpx; height: 22rpx;margin-left: 10rpx;}
	.search-hot-count{}
	
	.search-result{ border-top: 2rpx #e4e4e4 solid; padding: 30rpx;}
	.search-result-item{display: flex; justify-content: space-between; align-items: center; padding-bottom: 30rpx; margin-bottom: 30rpx; border-bottom: 2rpx #e4e4e4 solid;}
	.search-result-word{ flex: 1;}
	.search-result-word view:nth-child(1){ font-size: 28rpx; color: #3e6694;margin-bottom: 12rpx;}
	.search-result-word view:nth-child(2){ font-size: 22rpx; color: #898989;}
	.search-result-item text{ font-size: 50rpx;}
	
	.search-suggest{ border-top: 2rpx #e5e5e5 solid; padding: 30rpx; font-size: 26rpx;}
	.search-suggest-title{ color: #537caa; margin-bottom: 40rpx;}
	.search-suggest-item{ color: #666666; margin-bottom: 50rpx;}
	.search-suggest-item text{ color: #c2c2c2; font-size: 26rpx; margin-right: 26rpx;}
</style>
