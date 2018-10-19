//封装一个总的控制的函数，在里面调用其他函数
var app = {
	init: function(){ //初始化
		this.$tabs = $('footer>div')
		this.$panels =  $('section')
		this.bind()
		top250.init() //开始的时候调用top250里面的init
		us.init()
		search.init()
	},
	bind:function(){//绑定事件
		_this = this.$panels //下一层调用的时候就可以直接写_this
		this.$tabs.on('click',function(){
			$(this).addClass('active').siblings().removeClass('active')
			_this.hide().eq($(this).index()).fadeIn()
		})
	}
}
	var top250 = {
		init: function(){
			 this.num = 0
			 this.isLoading = false
			 this.clock
			 this.isFinish = false
			 this.$section0 = $('section').eq(0)
			 this.bind()
			 this.start()
		},
		bind: function(){ //绑定事件
			var _this =  this
			this.$section0.scroll(function(){
					if(_this.isTobottom()){
						_this.start()
					}
			})
		},
		start: function(){//
			var _this = this
			this.getData(function(data){
				_this.render(data)
			})
		},
		getData: function(callback){ //获取数据
			var _this = this
			if(_this.isLoading) return  //isLoading为真执行上面的，如果是正在加载中就不能再发请求，直接return
  			_this.isLoading = true //为假执行下面的 数据发出还没有到来表示true
	    	this.$section0.find('.loading').show()//如果是在加载状态就显示
		    $.ajax({
		      url:"https://api.douban.com//v2/movie/top250",
		      type:"GET",
		      data:{
		        start:_this.num,
		        count:20
		      },
		      dataType:"jsonp"
		   }).done(function(ret){
		      console.log(typeof ret)
		      _this.num += 20
		      if(_this.num >= ret.total){//如果获取数据的长度超过总长度
		      	_this.isFinish =  true
		      }
		      callback&&callback(ret) //执行回调函数
		   }).fail(function(){
		       console.log("erro")
		   }).always(function(){
		   	_this.isLoading = false //不管请求成功 还是失败加载状态都完成了
		   	_this.$section0.find('.loading').hide()//加载完成后隐藏
		   	console.log('ok')
		   })
		},
		render: function(datas){//渲染到页面
			var _this = this
			datas.subjects.forEach(function(val){
				var tpl =`<dl class = "clearfix">
	      <a href="" class="wrap " ><img class="images" src="${val.images.medium}"></a>
	      <dt><a href="" class="title"></a></dt>
	      <dd>豆瓣评分：<span class="score"></span>分 / <span class ="collect"></span>收藏</dd>
	      <dd>导演：<a href="" class="directors"></a></dd>
	      <dd>主演：<a href="" class="casts"></a></dd>
	      <dd>类型：<span class="genres"></span></dd>
	      </dl>`

	      var $node = $(tpl)
      		$node.find('a.wrap').attr('href',val.alt)
      		$node.find('dt .title').attr('href',val.alt)
      		$node.find('dt .title').text(val.title)
      		$node.find('dd .score').text(val.rating.average)
      		$node.find('dd .collect').text(val.collect_count)
      		$node.find('dd .genres').text(val.genres.join('/'))
      		$node.find('dd .directors').text(function(){
      			var nameArr = []
      			val.directors.forEach(function(e){
      				nameArr.push(e.name)
      			})
      			return nameArr.join('/')
      		})
      		$node.find('dd .directors').attr('href',function(){
      			var altArr = []
      			val.directors.forEach(function(e){
      				altArr.push(e.alt)
      			})
      			return altArr
      		})
      		$node.find('dd .casts').text(function(){
      			var castsArr = []
      			val.casts.forEach(function(v){
      				castsArr.push(v.name)
      			})
      			return castsArr.join('/')
      		})
      		$node.find('dd .casts').attr('href',function(){
      			var arr =[]
      			val.casts.forEach(function(i){
      				arr.push(i.alt)
      			})
      			return arr
      		})
				_this.$section0.find('.top250').append($node)
			})
      		
		},
		isTobottom: function(){//判断页面是否到底部
			 
			return Math.floor(this.$section0.find('.top250').height()) <= Math.floor(this.$section0.scrollTop()  + this.$section0.height() + 10)
		}
	}
	var us = {
		init: function(){
			this.$section1 = $('section').eq(1)
			this.start()
		},
		start: function(){//
			var _this = this
			this.getData(function(data){
				_this.render(data)
			})
		},
		getData: function(callback){
			var _this = this
		    $.ajax({
		      url:"https://api.douban.com/v2/movie/us_box",
		      dataType:"jsonp"
		   }).done(function(ret){
		      callback&&callback(ret)
		      //执行回调函数
		   }).fail(function(){
		       console.log("erro")
		   })
		},
		render: function(datas){
			var  _this = this
			datas.subjects.forEach(function(val){
				val = val.subject
				var tpl =`<dl class = "clearfix">
	      <a href="" class="wrap" href=""><img class="images" src="${val.images.medium}"></a>
	      <dt><a href="" class="title"></a></dt>
	      <dd>豆瓣评分：<span class="score"></span>分 / <span class ="collect"></span>收藏</dd>
	      <dd>导演：<a href="" class="directors"></a></dd>
	      <dd>主演：<a href="" class="casts"></a></dd>
	      <dd>类型：<span class="genres"></span></dd>
	      </dl>`

	      var $node = $(tpl)

      		$node.find('a .wrap').attr('href',val.alt)
      		$node.find('dt .title').text(val.title)
      		$node.find('dd .score').text(val.rating.average)
      		$node.find('dd .collect').text(val.collect_count)
      		$node.find('dd .genres').text(val.genres.join('/'))
      		$node.find('dd .directors').text(function(){
      			var nameArr = []
      			val.directors.forEach(function(e){
      				nameArr.push(e.name)
      			})
      			return nameArr.join('/')
      		})
      		$node.find('dd .directors').attr('href',function(){
      			var altArr = []
      			val.directors.forEach(function(e){
      				altArr.push(e.alt)
      			})
      			return altArr
      		})
      		$node.find('dd .casts').text(function(){
      			var castsArr = []
      			val.casts.forEach(function(v){
      				castsArr.push(v.name)
      			})
      			return castsArr.join('/')
      		})
      		$node.find('dd .casts').attr('href',function(){
      			var arr =[]
      			val.casts.forEach(function(i){
      				arr.push(i.alt)
      			})
      			return arr
      		})
				_this.$section1.find('.us').append($node)
			})
		}
	}
	var search = {
		init: function(){
			 this.$section2 = $('section').eq(2)
			 this.$ipt = this.$section2.find('.ipt')
			 this.$btn = this.$section2.find('.btn')
			 this.$result = this.$section2.find('.result')
			 this.$section2.find('.loading').hide()
			 this.bind()
		},
		bind: function(){
			var _this = this
			this.$btn.on('click',function(){

				_this.getData(_this.$ipt.val(),function(data){
					console.log(data)
					_this.render(data)
				})
			})
		},
		getData: function(keyword,callback){
			var _this = this
			this.$section2.find('.loading').show()//如果是在加载状态就显示
		    $.ajax({
		      url:"https://api.douban.com/v2/movie/search",
		      data: {
		      	q: keyword
		      },
		      dataType:"jsonp"
		   }).done(function(ret){
		      callback&&callback(ret) //执行回调函数
		   }).fail(function(){
		       console.log("erro")
		   }).always(function(){
		   	_this.$section2.find('.loading').hide()//加载完成后隐藏
		  
		   })
		},
		render: function(datas){
			var  _this = this
			datas.subjects.forEach(function(val){
				
				var tpl =`<dl class = "clearfix">
	      <a href="" class="wrap" href=""><img class="images" src="${val.images.medium}"></a>
	      <dt><a href="" class="title"></a></dt>
	      <dd>豆瓣评分：<span class="score"></span>分 / <span class ="collect"></span>收藏</dd>
	      <dd>导演：<a href="" class="directors"></a></dd>
	      <dd>主演：<a href="" class="casts"></a></dd>
	      <dd>类型：<span class="genres"></span></dd>
	      </dl>`

	      var $node = $(tpl)
      		$node.find('a .wrap').attr('href',val.alt)
      		$node.find('dt .title').text(val.title)
      		$node.find('dd .score').text(val.rating.average)
      		$node.find('dd .collect').text(val.collect_count)
      		$node.find('dd .genres').text(val.genres.join('/'))
      		$node.find('dd .directors').text(function(){
      			var nameArr = []
      			val.directors.forEach(function(e){
      				nameArr.push(e.name)
      			})
      			return nameArr.join('/')
      		})
      		$node.find('dd .directors').attr('href',function(){
      			var altArr = []
      			val.directors.forEach(function(e){
      				altArr.push(e.alt)
      			})
      			return altArr
      		})
      		$node.find('dd .casts').text(function(){
      			var castsArr = []
      			val.casts.forEach(function(v){
      				castsArr.push(v.name)
      			})
      			return castsArr.join('/')
      		})
      		$node.find('dd .casts').attr('href',function(){
      			var arr =[]
      			val.casts.forEach(function(i){
      				arr.push(i.alt)
      			})
      			return arr
      		})
				_this.$section2.find('.result').append($node)
			})
		}
	}
app.init()